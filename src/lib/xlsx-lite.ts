/**
 * Leitor mínimo de planilhas .xlsx (sem dependências): descompacta o ZIP, lê as textos
 * compartilhados e devolve a primeira aba como matriz de textos.
 */

const decoder = new TextDecoder("utf-8");

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

type ZipEntry = { method: number; size: number; offset: number };

function readZipIndex(bytes: Uint8Array): Map<string, ZipEntry> {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("zip");
  const count = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const out = new Map<string, ZipEntry>();
  for (let i = 0; i < count; i++) {
    if (dv.getUint32(p, true) !== 0x02014b50) throw new Error("zip");
    const method = dv.getUint16(p + 10, true);
    const size = dv.getUint32(p + 20, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const offset = dv.getUint32(p + 42, true);
    const name = decoder.decode(bytes.subarray(p + 46, p + 46 + nameLen));
    out.set(name, { method, size, offset });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

async function readEntry(bytes: Uint8Array, e: ZipEntry): Promise<string> {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const nameLen = dv.getUint16(e.offset + 26, true);
  const extraLen = dv.getUint16(e.offset + 28, true);
  const start = e.offset + 30 + nameLen + extraLen;
  const raw = bytes.subarray(start, start + e.size);
  const data = e.method === 0 ? raw : await inflateRaw(raw);
  return decoder.decode(data);
}

function decodeXml(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function textOf(xml: string): string {
  let out = "";
  const re = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out += m[1];
  return decodeXml(out);
}

function colIndex(ref: string): number {
  const letters = ref.replace(/[^A-Za-z]/g, "").toUpperCase();
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

function plainNumber(v: string): string {
  // O Excel grava números grandes em notação científica (8.5999E+10). Telefones precisam voltar a ser dígitos.
  if (/^-?\d+(\.\d+)?[eE][+-]?\d+$/.test(v)) {
    const n = Number(v);
    if (Number.isFinite(n)) return n.toFixed(0);
  }
  return v;
}

export async function readXlsx(buffer: ArrayBuffer, maxRows = 5000): Promise<string[][]> {
  const bytes = new Uint8Array(buffer);
  const zip = readZipIndex(bytes);

  const shared: string[] = [];
  const ss = zip.get("xl/sharedStrings.xml");
  if (ss) {
    const xml = await readEntry(bytes, ss);
    const re = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml))) shared.push(textOf(m[1]));
  }

  // A primeira aba da pasta de trabalho (o nome do arquivo da aba nem sempre é sheet1).
  let sheetPath = "xl/worksheets/sheet1.xml";
  const wb = zip.get("xl/workbook.xml");
  const rels = zip.get("xl/_rels/workbook.xml.rels");
  if (wb && rels) {
    const wbXml = await readEntry(bytes, wb);
    const rid = /<sheet\b[^>]*\br:id="([^"]+)"/.exec(wbXml)?.[1];
    if (rid) {
      const relXml = await readEntry(bytes, rels);
      for (const r of relXml.match(/<Relationship\b[^>]*>/g) ?? []) {
        if (new RegExp(`\\bId="${rid}"`).test(r)) {
          const target = /\bTarget="([^"]+)"/.exec(r)?.[1];
          if (target) sheetPath = target.startsWith("/") ? target.slice(1) : `xl/${target}`;
        }
      }
    }
  }
  const sheet = zip.get(sheetPath);
  if (!sheet) throw new Error("sheet");
  const xml = await readEntry(bytes, sheet);

  const table: string[][] = [];
  const cellRe = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
  let m: RegExpExecArray | null;
  while ((m = cellRe.exec(xml))) {
    const attrs = m[1];
    const body = m[2] ?? "";
    const ref = /\br="([A-Za-z]+)(\d+)"/.exec(attrs);
    if (!ref) continue;
    const row = parseInt(ref[2], 10) - 1;
    if (row >= maxRows) break;
    const type = /\bt="([^"]+)"/.exec(attrs)?.[1];
    let value = "";
    if (type === "inlineStr") value = textOf(body);
    else {
      const v = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1] ?? "";
      if (type === "s") value = shared[parseInt(v, 10)] ?? "";
      else if (type === "b") value = v === "1" ? "Sim" : "Não";
      else value = type === "str" || type === "e" ? decodeXml(v) : plainNumber(v);
    }
    (table[row] ??= [])[colIndex(ref[1])] = value;
  }
  return Array.from(table, (r) => Array.from(r ?? [], (c) => c ?? ""));
}
