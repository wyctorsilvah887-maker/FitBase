"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { readStudentsFromPhoto } from "@/ai/flows/read-students-from-photo";
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

/** Reduz a foto no navegador: leitura mais rápida e envio bem menor. */
async function photoToDataUri(file: File, max = 1600): Promise<string> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close?.();
  return canvas.toDataURL("image/jpeg", 0.82);
}

const isImage = (f: File) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name);

/**
 * Importa a lista de alunos de uma planilha (.xlsx, .csv) ou de uma foto do caderno.
 * Nada é gravado antes de o dono conferir a lista.
 */
export function ImportMembersModal({ isOpen, onClose, existing }: Props) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);

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
      setError("Não encontrei alunos nessa lista. Confira se o arquivo tem os nomes ou tire a foto mais perto.");
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
    if (files.length === 0) return;
    setError("");
    const images = files.filter(isImage);
    const sheets = files.filter((f) => !isImage(f));
    if (images.length > 0 && sheets.length > 0) {
      setError("Envie só fotos ou só um arquivo por vez.");
      return;
    }
    setStep("reading");
    try {
      if (images.length > 0) {
        if (images.length > 6) throw new Error("Envie até 6 fotos por vez.");
        const token = await user?.getIdToken();
        const all: RawStudent[] = [];
        let firstError = "";
        for (let i = 0; i < images.length; i++) {
          setStatus(images.length > 1 ? `Lendo a foto ${i + 1} de ${images.length}` : "Lendo a foto");
          let uri: string;
          try {
            uri = await photoToDataUri(images[i]);
          } catch {
            firstError ||= "Não consegui abrir essa foto. Tente outra em JPG ou PNG.";
            continue;
          }
          const res = await readStudentsFromPhoto({ idToken: token ?? "", photoDataUri: uri });
          if (res.ok) all.push(...res.students);
          else firstError ||= res.error;
        }
        if (all.length === 0 && firstError) throw new Error(firstError);
        finishReading(all);
        return;
      }

      const file = sheets[0];
      setStatus("Lendo o arquivo");
      const name = file.name.toLowerCase();
      let table: string[][];
      if (name.endsWith(".xlsx")) table = await readXlsx(await file.arrayBuffer());
      else if (/\.(csv|txt|tsv)$/.test(name)) table = parseCsv(await file.text());
      else if (/\.(xls|ods)$/.test(name)) throw new Error("Esse formato é antigo. Abra a planilha e salve como .xlsx ou .csv.");
      else throw new Error("Esse tipo de arquivo não funciona. Envie .xlsx, .csv ou uma foto da lista.");
      finishReading(tableToStudents(table));
    } catch (e: any) {
      const known = typeof e?.message === "string" && /[a-zà-ú]/i.test(e.message) && e.message.length > 12 ? e.message : "";
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
                  : "Traga a lista que você já tem. Você confere tudo antes de salvar."}
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
                  <div className="ap-imp-opts">
                    <button type="button" className="ap-imp-opt" onClick={() => fileInput.current?.click()}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                        <path d="M14 3v5h5M9 13h6M9 17h6" />
                      </svg>
                      <strong>Enviar arquivo</strong>
                      <small>Excel ou CSV</small>
                    </button>
                    <button type="button" className="ap-imp-opt" onClick={() => photoInput.current?.click()}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                        <circle cx="12" cy="13" r="3.5" />
                      </svg>
                      <strong>Foto da lista</strong>
                      <small>Caderno ou planilha impressa</small>
                    </button>
                  </div>
                  <p className="ap-imp-hint">Ou arraste o arquivo ou a foto para cá.</p>
                </>
              )}
              <input ref={fileInput} type="file" hidden accept=".xlsx,.csv,.txt,.tsv,.xls,.ods" onChange={onPick} />
              <input ref={photoInput} type="file" hidden accept="image/*" multiple onChange={onPick} />
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
                <li>Serve qualquer lista com nome e telefone. Vencimento e plano são opcionais.</li>
                <li>Na foto, pegue uma página por vez, bem de frente e com boa luz.</li>
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
