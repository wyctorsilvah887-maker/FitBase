"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { readXlsx } from "@/lib/xlsx-lite";
import {
  MAX_IMPORT_ROWS,
  TEMPLATE_CSV,
  applyDdd,
  buildRows,
  digitsOf,
  formatPhone,
  mostCommonDdd,
  parseCsv,
  rowIssues,
  rowToMember,
  tableToStudents,
  type ImportRow,
  type NoExpiryMode,
  type RawStudent,
} from "@/lib/import-members";
import "@/components/landing/landing.css";
import "@/components/app/app.css";

type Step = "pick" | "reading" | "review" | "saving";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  existing: { name?: string; phone?: string }[];
}

/**
 * Importa a lista de alunos de uma planilha (.xlsx, .csv). Passa a limpo, mostra a lista para o dono conferir e só então salva.
 * Nada é gravado antes de o dono conferir a lista.
 */
export function ImportMembersModal({ isOpen, onClose, existing }: Props) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("pick");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [ddd, setDdd] = useState("");
  const [mode, setMode] = useState<NoExpiryMode>("em-dia");
  const [truncated, setTruncated] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const busy = step === "reading" || step === "saving";

  const reset = useCallback(() => {
    setStep("pick");
    setError("");
    setRows([]);
    setTruncated(false);
    setSavedCount(0);
  }, []);

  const handleClose = () => {
    if (busy) return;
    onClose();
    setTimeout(reset, 250);
  };

  const finishReading = (students: RawStudent[]) => {
    if (students.length === 0) {
      setError("Não encontrei alunos nesse arquivo. Confira se ele tem uma coluna com os nomes.");
      setStep("pick");
      return;
    }
    const initial = mostCommonDdd(students) || mostCommonDdd(existing);
    const built = buildRows(students.slice(0, MAX_IMPORT_ROWS), { ddd: initial, existing });
    setTruncated(students.length > MAX_IMPORT_ROWS);
    setDdd(initial);
    setRows(built);
    setStep("review");
  };

  const readFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError("");
    setStep("reading");
    setStatus("Lendo o arquivo");
    try {
      const name = file.name.toLowerCase();
      let table: string[][];
      if (name.endsWith(".xlsx")) table = await readXlsx(await file.arrayBuffer());
      else if (/\.(csv|txt|tsv)$/.test(name)) table = parseCsv(await file.text());
      else if (/\.(xls|ods)$/.test(name)) throw new Error("Esse formato é antigo. Abra a planilha e salve como .xlsx ou .csv.");
      else throw new Error("Esse tipo de arquivo não funciona. Envie uma planilha .xlsx ou um arquivo .csv.");
      finishReading(tableToStudents(table));
    } catch (e: any) {
      const known = typeof e?.message === "string" && /^(Esse )/.test(e.message) ? e.message : "";
      setError(known || "Não consegui ler o arquivo. Salve a planilha como CSV e tente de novo.");
      setStep("pick");
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    void readFiles(files);
  };

  const patch = (id: number, p: Partial<ImportRow>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)));

  const changeDdd = (v: string) => {
    const d = digitsOf(v).slice(0, 2);
    setDdd(d);
    setRows((rs) => rs.map((r) => applyDdd(r, d)));
  };

  const selectable = rows.filter((r) => rowIssues(r).bad.length === 0);
  const chosen = rows.filter((r) => r.include && rowIssues(r).bad.length === 0);
  const allChosen = selectable.length > 0 && selectable.every((r) => r.include);
  const warnCount = rows.filter((r) => rowIssues(r).warn.length > 0 && !r.duplicate).length;
  const dupCount = rows.filter((r) => r.duplicate).length;
  const needsMode = chosen.some((r) => !r.expiry);
  const needsDdd = rows.some((r) => r.pendingDigits);

  const save = async () => {
    if (!user || !db || chosen.length === 0) return;
    setStep("saving");
    setError("");
    let done = 0;
    try {
      const now = new Date();
      for (let i = 0; i < chosen.length; i += 400) {
        const batch = writeBatch(db);
        for (const r of chosen.slice(i, i + 400)) {
          batch.set(doc(collection(db, "users", user.uid, "members")), {
            userId: user.uid,
            ...rowToMember(r, mode, now),
            createdAt: serverTimestamp(),
          });
        }
        await batch.commit();
        done += Math.min(400, chosen.length - i);
        setSavedCount(done);
      }
      toast({ title: done === 1 ? "1 aluno importado" : `${done} alunos importados`, description: "Eles já estão na sua lista." });
      onClose();
      setTimeout(reset, 250);
    } catch {
      setError(
        done > 0
          ? `Só ${done} de ${chosen.length} alunos foram salvos. Fale com o suporte antes de tentar de novo, para não duplicar.`
          : "Não deu para salvar agora. Nenhum aluno foi importado. Tente de novo."
      );
      setStep("review");
    }
  };

  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob(["﻿" + TEMPLATE_CSV], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo-alunos-fitbase.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const summary = useMemo(() => {
    const parts = [`${rows.length} ${rows.length === 1 ? "aluno encontrado" : "alunos encontrados"}`];
    if (warnCount > 0) parts.push(`${warnCount} com aviso`);
    if (dupCount > 0) parts.push(`${dupCount} já ${dupCount === 1 ? "cadastrado" : "cadastrados"}`);
    return parts.join(" · ");
  }, [rows.length, warnCount, dupCount]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="ap-overlay" />
        <Dialog.Content
          className={`lp ap-modal ap-imp${step === "review" || step === "saving" ? " ap-modal--wide" : ""}`}
          aria-describedby="imp-desc"
          onInteractOutside={(e) => busy && e.preventDefault()}
          onEscapeKeyDown={(e) => busy && e.preventDefault()}
        >
          <div className="ap-modal-head">
            <div>
              <Dialog.Title className="ap-modal-title">Importar alunos</Dialog.Title>
              <Dialog.Description id="imp-desc" className="ap-modal-sub">
                {step === "review" || step === "saving"
                  ? "Confira a lista. Nada é salvo antes de você confirmar."
                  : "Traga a planilha que você já tem. Você confere tudo antes de salvar."}
              </Dialog.Description>
            </div>
            <Dialog.Close className="ap-modal-x" aria-label="Fechar" disabled={busy}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </Dialog.Close>
          </div>

          {(step === "pick" || step === "reading") && (
            <div
              className={`ap-imp-drop${dragging ? " is-drag" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                if (!busy) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (!busy) void readFiles(Array.from(e.dataTransfer.files));
              }}
            >
              {step === "reading" ? (
                <div className="ap-imp-reading" role="status">
                  <span className="ap-imp-spin" aria-hidden="true" />
                  <strong>{status || "Lendo"}…</strong>
                  <small>Isso leva alguns segundos.</small>
                </div>
              ) : (
                <>
                  <button type="button" className="ap-imp-opt ap-imp-opt--solo" onClick={() => fileInput.current?.click()}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                      <path d="M14 3v5h5M9 13h6M9 17h6" />
                    </svg>
                    <strong>Escolher planilha</strong>
                    <small>Excel (.xlsx) ou CSV</small>
                  </button>
                  <p className="ap-imp-hint">Ou arraste o arquivo para cá.</p>
                </>
              )}
              <input ref={fileInput} type="file" hidden accept=".xlsx,.csv,.txt,.tsv,.xls,.ods" onChange={onPick} />
            </div>
          )}

          {step === "pick" && (
            <>
              {error && (
                <p className="ap-field-error ap-imp-error" role="alert">
                  {error}
                </p>
              )}
              <ul className="ap-imp-tips">
                <li>Serve qualquer planilha com nome e telefone. Vencimento e plano são opcionais.</li>
                <li>Só tem o caderno? Digite os nomes numa planilha ou use o modelo abaixo.</li>
              </ul>
              <button type="button" className="lp-link-btn" onClick={downloadTemplate}>
                Baixar modelo de planilha
              </button>
            </>
          )}

          {(step === "review" || step === "saving") && (
            <>
              <p className="ap-imp-summary" role="status">
                {summary}
              </p>
              {truncated && <p className="ap-imp-note">Mostramos os primeiros {MAX_IMPORT_ROWS}. Importe o resto em uma segunda vez.</p>}

              <div className="ap-imp-controls">
                {needsDdd && (
                  <label className="ap-imp-ddd">
                    <span>DDD dos telefones sem DDD</span>
                    <input className="ap-input" inputMode="numeric" maxLength={2} placeholder="82" value={ddd} onChange={(e) => changeDdd(e.target.value)} disabled={step === "saving"} />
                  </label>
                )}
                <label className="ap-imp-all">
                  <input
                    type="checkbox"
                    checked={allChosen}
                    disabled={step === "saving"}
                    onChange={(e) => setRows((rs) => rs.map((r) => (rowIssues(r).bad.length === 0 ? { ...r, include: e.target.checked } : r)))}
                  />
                  <span>Selecionar todos</span>
                </label>
              </div>

              <ul className="ap-imp-list">
                {rows.map((r) => {
                  const { bad, warn } = rowIssues(r);
                  return (
                    <li key={r.id} className={`ap-imp-row${r.include && !bad.length ? "" : " is-off"}`}>
                      <label className="ap-imp-pick">
                        <input
                          type="checkbox"
                          checked={r.include && !bad.length}
                          disabled={bad.length > 0 || step === "saving"}
                          onChange={(e) => patch(r.id, { include: e.target.checked })}
                          aria-label={`Importar ${r.name || "linha sem nome"}`}
                        />
                      </label>
                      <div className="ap-imp-fields">
                        <input
                          className="ap-input"
                          aria-label="Nome"
                          placeholder="Nome do aluno"
                          value={r.name}
                          disabled={step === "saving"}
                          aria-invalid={bad.length > 0 || undefined}
                          onChange={(e) => patch(r.id, { name: e.target.value })}
                        />
                        <div className="ap-imp-sub">
                          <input
                            className="ap-input"
                            aria-label={`Telefone de ${r.name || "aluno"}`}
                            inputMode="tel"
                            placeholder="Telefone"
                            value={r.phone}
                            disabled={step === "saving"}
                            onChange={(e) => patch(r.id, { phone: formatPhone(digitsOf(e.target.value)), phoneEdited: true })}
                          />
                          <select
                            className="ap-input"
                            aria-label={`Plano de ${r.name || "aluno"}`}
                            value={r.plan}
                            disabled={step === "saving"}
                            onChange={(e) => patch(r.id, { plan: e.target.value as ImportRow["plan"] })}
                          >
                            <option value="mensal">Mensal</option>
                            <option value="trimestral">Trimestral</option>
                            <option value="anual">Anual</option>
                          </select>
                          <input
                            className="ap-input"
                            type="date"
                            aria-label={`Vencimento de ${r.name || "aluno"}`}
                            value={r.expiry}
                            disabled={step === "saving"}
                            onChange={(e) => patch(r.id, { expiry: e.target.value })}
                          />
                        </div>
                        {(bad.length > 0 || warn.length > 0) && (
                          <div className="ap-imp-issues">
                            {bad.map((t) => (
                              <span key={t} className="lp-chip lp-chip--bad">{t}</span>
                            ))}
                            {warn.map((t) => (
                              <span key={t} className="lp-chip lp-chip--warn">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {needsMode && (
                <fieldset className="ap-fieldset ap-imp-mode" disabled={step === "saving"}>
                  <legend className="ap-label">Quem está sem vencimento</legend>
                  <div className="ap-imp-modes">
                    {(
                      [
                        ["em-dia", "Em dia por 30 dias", "Você ajusta depois"],
                        ["vencido", "Marcar como vencido", "Aparece para cobrar"],
                      ] as const
                    ).map(([key, title, sub]) => (
                      <label key={key} className="ap-choice">
                        <input type="radio" name="imp-mode" checked={mode === key} onChange={() => setMode(key)} />
                        <span className="ap-choice-box">
                          <strong>{title}</strong>
                          <small>{sub}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {error && (
                <p className="ap-field-error ap-imp-error" role="alert">
                  {error}
                </p>
              )}

              <div className="ap-modal-actions">
                <button type="button" className="ap-modal-cancel" onClick={reset} disabled={step === "saving"}>
                  Voltar
                </button>
                <button type="button" className="lp-btn lp-btn-primary ap-modal-submit" onClick={save} disabled={step === "saving" || chosen.length === 0}>
                  {step === "saving"
                    ? `Salvando ${savedCount} de ${chosen.length}…`
                    : chosen.length === 0
                      ? "Escolha alunos para importar"
                      : `Importar ${chosen.length} ${chosen.length === 1 ? "aluno" : "alunos"}`}
                </button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
