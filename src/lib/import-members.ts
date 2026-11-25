import { addDays } from "date-fns";
import type { Plan } from "@/lib/member-utils";
import { getEffectiveStatus } from "@/lib/member-utils";
import { normalizeText } from "@/lib/format";

export const MAX_IMPORT_ROWS = 500;

/** O que foi lido da planilha ou da foto, antes de qualquer correção. */
export type RawStudent = { name?: string; phone?: string; plan?: string; expiry?: string };

export type ImportRow = {
  id: number;
  include: boolean;
  name: string;
  phone: string; // "(85) 99999-1111" ou ""
  plan: Plan;
  expiry: string; // "aaaa-mm-dd" ou ""
  /** Dígitos do telefone sem DDD (8 ou 9 dígitos): aguardam o DDD padrão. */
  pendingDigits: string;
  phoneEdited: boolean;
  duplicate: boolean;
};

/* ------------------------------------------------------------------ */
/* Texto e CSV                                                          */
/* ------------------------------------------------------------------ */

export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, "");
  const firstLines = text.split(/\r?\n/).slice(0, 5).join("\n");
  const counts: Record<string, number> = { ";": 0, ",": 0, "\t": 0 };
  let inQ = false;
  for (const ch of firstLines) {
    if (ch === '"') inQ = !inQ;
    else if (!inQ && ch in counts) counts[ch]++;
  }
  const delim = (Object.keys(counts) as string[]).sort((a, b) => counts[b] - counts[a])[0];
  const sep = counts[delim] > 0 ? delim : ";";

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') inQ = false;
      else cell += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === sep) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows.filter((r) => r.some((c) => c.trim() !== "")).slice(0, MAX_IMPORT_ROWS + 50);
}

/* ------------------------------------------------------------------ */
/* Campos                                                               */
/* ------------------------------------------------------------------ */

const slug = (s: string) => normalizeText(s).replace(/[^a-z0-9]/g, "");

const HEADERS = {
  name: ["nome", "nomecompleto", "aluno", "aluna", "cliente", "nomedoaluno"],
  phone: ["telefone", "celular", "whatsapp", "whats", "zap", "fone", "contato", "tel", "numero"],
  plan: ["plano", "tipodeplano", "tipo"],
  expiry: ["vencimento", "validade", "venc", "vence", "datavencimento", "datadevencimento", "pagoate", "proximopagamento", "venceem"],
} as const;

type Field = keyof typeof HEADERS;

function headerField(cell: string): Field | null {
  const s = slug(cell);
  if (!s) return null;
  for (const f of Object.keys(HEADERS) as Field[]) if ((HEADERS[f] as readonly string[]).includes(s)) return f;
  return null;
}

export function digitsOf(s: string) {
  return s.replace(/\D/g, "");
}

/** Número de série de data do Excel (45992 = 2025-12-05) virando data. */
export function excelSerialToDate(n: number): Date | null {
  if (!(n > 20000 && n < 80000)) return null;
  const d = new Date(Date.UTC(1899, 11, 30) + Math.floor(n) * 86400000);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

const pad = (n: number) => String(n).padStart(2, "0");
export const toIsoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function validDate(y: number, m: number, d: number): Date | null {
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? dt : null;
}

/** Aceita 05/12/2025, 5/12/25, 05-12-2025, 2025-12-05, 05/12 (ano atual) e número de série do Excel. */
export function parseDate(raw: string | undefined, now: Date): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  let d: Date | null = null;
  let m: RegExpExecArray | null;
  if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/.exec(s))) d = validDate(+m[1], +m[2], +m[3]);
  else if ((m = /^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})$/.exec(s))) {
    const y = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    d = validDate(y, +m[2], +m[1]);
  } else if ((m = /^(\d{1,2})[/.\-](\d{1,2})$/.exec(s))) d = validDate(now.getFullYear(), +m[2], +m[1]);
  else if (/^\d{5}(\.\d+)?$/.test(s)) d = excelSerialToDate(parseFloat(s));
  if (!d || d.getFullYear() < 2000 || d.getFullYear() > 2100) return "";
  return toIsoDate(d);
}

export function parsePlan(raw: string | undefined): Plan {
  const s = normalizeText(raw ?? "");
  if (/trim|\b3\b|3 ?m/.test(s)) return "trimestral";
  if (/anu|ano|\b12\b|12 ?m/.test(s)) return "anual";
  return "mensal";
}

export function formatPhone(digits: string) {
  const d = digits.slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * Telefone brasileiro: tira o 55 e o 0 iniciais. Com 10 ou 11 dígitos já tem DDD;
 * com 8 ou 9 falta o DDD (fica "pendente"); qualquer outra coisa é descartada.
 */
export function splitPhone(raw: string | undefined): { digits: string; pending: string } {
  let d = digitsOf(raw ?? "");
  if (d.length >= 12 && d.startsWith("55")) d = d.slice(2);
  if (d.length >= 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length === 10 || d.length === 11) return { digits: d, pending: "" };
  if (d.length === 8 || d.length === 9) return { digits: "", pending: d };
  return { digits: "", pending: "" };
}

const SMALL = new Set(["da", "de", "do", "das", "dos", "e"]);
export function cleanName(raw: string | undefined): string {
  const s = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  const letters = s.replace(/[^A-Za-zÀ-ÿ]/g, "");
  const flat = letters === letters.toUpperCase() || letters === letters.toLowerCase();
  if (!flat) return s;
  return s
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* Tabela -> alunos                                                     */
/* ------------------------------------------------------------------ */

const PHONE_IN_TEXT = /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s.]?\d{4}/;

function lineToStudent(line: string): RawStudent | null {
  const m = PHONE_IN_TEXT.exec(line);
  const phone = m ? m[0] : "";
  const rest = (m ? line.replace(m[0], " ") : line).replace(/[-–—:;,|]+/g, " ").replace(/\s+/g, " ").trim();
  const dateM = /\b\d{1,2}[/.]\d{1,2}(?:[/.]\d{2,4})?\b/.exec(rest);
  let name = (dateM ? rest.replace(dateM[0], " ") : rest).replace(/\s+/g, " ").trim();
  // Palavras que acompanham a data ("vence 15/12", "pago até 15/12") não fazem parte do nome.
  if (dateM) name = name.replace(/\b(?:pago|paga|vence|vencimento|venc|validade|até|ate|dia|em)\b/gi, " ").replace(/\s+/g, " ").trim();
  if (!/[A-Za-zÀ-ÿ]{2}/.test(name)) return null;
  // Linha longa sem telefone nem data é anotação do caderno, não aluno.
  if (!m && !dateM && name.split(" ").length > 4) return null;
  return { name, phone, expiry: dateM?.[0] };
}

/** Descobre as colunas pelo cabeçalho; sem cabeçalho, pelo conteúdo. */
export function tableToStudents(table: string[][], now: Date = new Date()): RawStudent[] {
  const rows = table.filter((r) => r.some((c) => (c ?? "").toString().trim() !== ""));
  if (rows.length === 0) return [];
  const width = Math.max(...rows.map((r) => r.length));

  // Uma coluna só: lista de texto livre ("Maria Souza 85 99999-1111").
  if (width === 1) {
    return rows
      .map((r) => lineToStudent(String(r[0] ?? "")))
      .filter((s): s is RawStudent => !!s);
  }

  const map: Partial<Record<Field, number>> = {};
  const head = rows[0].map((c) => headerField(String(c ?? "")));
  head.forEach((f, i) => {
    if (f && map[f] === undefined) map[f] = i;
  });
  const hasHeader = map.name !== undefined || map.phone !== undefined;
  const data = hasHeader ? rows.slice(1) : rows;

  if (!hasHeader) {
    const col = (i: number) => data.map((r) => String(r[i] ?? "").trim());
    const share = (vals: string[], test: (v: string) => boolean) =>
      vals.filter(Boolean).length ? vals.filter((v) => v && test(v)).length / vals.filter(Boolean).length : 0;
    const used = new Set<number>();
    for (let i = 0; i < width; i++) if (share(col(i), (v) => splitPhone(v).digits !== "" || splitPhone(v).pending !== "") > 0.6 && map.phone === undefined) { map.phone = i; used.add(i); }
    for (let i = 0; i < width; i++) if (!used.has(i) && share(col(i), (v) => parseDate(v, now) !== "") > 0.6 && map.expiry === undefined) { map.expiry = i; used.add(i); }
    for (let i = 0; i < width; i++) if (!used.has(i) && share(col(i), (v) => /^[A-Za-zÀ-ÿ' .]{3,}$/.test(v)) > 0.6 && map.name === undefined) { map.name = i; used.add(i); }
    for (let i = 0; i < width; i++) if (!used.has(i) && map.plan === undefined && share(col(i), (v) => /mensal|trimestral|anual/i.test(v)) > 0.5) { map.plan = i; used.add(i); }
  }

  const get = (r: string[], f: Field) => (map[f] === undefined ? undefined : String(r[map[f]!] ?? "").trim());
  return data.map((r) => ({ name: get(r, "name"), phone: get(r, "phone"), plan: get(r, "plan"), expiry: get(r, "expiry") }));
}

/* ------------------------------------------------------------------ */
/* Alunos lidos -> linhas para conferir                                 */
/* ------------------------------------------------------------------ */

export function mostCommonDdd(students: RawStudent[]): string {
  const count = new Map<string, number>();
  for (const s of students) {
    const { digits } = splitPhone(s.phone);
    if (digits) count.set(digits.slice(0, 2), (count.get(digits.slice(0, 2)) ?? 0) + 1);
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

export function applyDdd(row: ImportRow, ddd: string): ImportRow {
  if (row.phoneEdited || !row.pendingDigits) return row;
  const d = digitsOf(ddd);
  return { ...row, phone: d.length === 2 ? formatPhone(d + row.pendingDigits) : "" };
}

export function buildRows(
  students: RawStudent[],
  opts: { now?: Date; ddd?: string; existing?: { name?: string; phone?: string }[]; startId?: number } = {}
): ImportRow[] {
  const now = opts.now ?? new Date();
  const ddd = digitsOf(opts.ddd ?? "");
  const seenPhones = new Set<string>();
  const seenNames = new Set<string>();
  for (const e of opts.existing ?? []) {
    const p = splitPhone(e.phone).digits;
    if (p) seenPhones.add(p);
    if (e.name) seenNames.add(normalizeText(e.name.trim()));
  }

  const out: ImportRow[] = [];
  let id = opts.startId ?? 0;
  for (const s of students) {
    const name = cleanName(s.name);
    if (!name && !digitsOf(s.phone ?? "")) continue;
    const { digits, pending } = splitPhone(s.phone);
    const filled = digits || (pending && ddd.length === 2 ? ddd + pending : "");
    const phoneDigits = filled;
    const key = normalizeText(name);
    const duplicate = (!!phoneDigits && seenPhones.has(phoneDigits)) || (!!key && seenNames.has(key));
    if (phoneDigits) seenPhones.add(phoneDigits);
    if (key) seenNames.add(key);
    out.push({
      id: id++,
      include: name.length >= 2 && !duplicate,
      name,
      phone: phoneDigits ? formatPhone(phoneDigits) : "",
      plan: parsePlan(s.plan),
      expiry: parseDate(s.expiry, now),
      pendingDigits: digits ? "" : pending,
      phoneEdited: false,
      duplicate,
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Linha -> documento do aluno                                          */
/* ------------------------------------------------------------------ */

export type NoExpiryMode = "em-dia" | "vencido";

export function rowIssues(r: ImportRow): { bad: string[]; warn: string[] } {
  const bad: string[] = [];
  const warn: string[] = [];
  if (r.name.trim().length < 2) bad.push("Falta o nome");
  if (r.duplicate) warn.push("Já cadastrado");
  const d = digitsOf(r.phone);
  if (!d) warn.push(r.pendingDigits ? "Falta o DDD" : "Sem telefone");
  else if (d.length < 10) warn.push("Telefone incompleto");
  return { bad, warn };
}

/** Monta os campos do aluno. Sem vencimento: em dia por 30 dias ou vencido, conforme a escolha. */
export function rowToMember(r: ImportRow, mode: NoExpiryMode, now: Date = new Date()) {
  const noon = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  };
  let expiry: Date;
  if (r.expiry) expiry = noon(r.expiry);
  else expiry = mode === "em-dia" ? addDays(now, 30) : now;
  const iso = expiry.toISOString();
  const status = !r.expiry && mode === "vencido" ? "vencido" : getEffectiveStatus({ status: "ativo", expiryDate: iso }, now);
  return {
    name: r.name.trim(),
    phone: digitsOf(r.phone).length >= 10 ? r.phone : "",
    plan: r.plan,
    status,
    joinedAt: now.toISOString(),
    expiryDate: iso,
  };
}

/** Modelo de planilha para o dono preencher. */
export const TEMPLATE_CSV =
  "nome;telefone;plano;vencimento\r\nMaria Souza;(82) 99999-1111;mensal;15/12/2026\r\nJoão Pereira;(82) 98888-2222;trimestral;02/01/2027\r\n";
