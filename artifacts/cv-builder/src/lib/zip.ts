/**
 * Minimal ZIP writer, enough to package an OOXML document.
 *
 * A .docx is a ZIP of XML parts, and the only thing needed to build one in the
 * browser is a writer that can store entries. Everything is written uncompressed
 * ("stored"), which every ZIP reader — Word, LibreOffice, Google Docs, Python's
 * zipfile — accepts, and which keeps this to a few dozen lines rather than
 * pulling in a compression library for files measured in kilobytes.
 */

const LOCAL_HEADER_SIG = 0x04034b50;
const CENTRAL_HEADER_SIG = 0x02014b50;
const EOCD_SIG = 0x06054b50;
/** Bit 11: filenames and comments are UTF-8. */
const UTF8_FLAG = 0x0800;
const VERSION_NEEDED = 20;

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/** Builds a ZIP archive from the given entries, in the order supplied. */
export function createZip(entries: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const prepared = entries.map((entry) => ({
    nameBytes: encoder.encode(entry.name),
    data: entry.data,
    crc: crc32(entry.data),
  }));

  const localSize = prepared.reduce((sum, e) => sum + 30 + e.nameBytes.length + e.data.length, 0);
  const centralSize = prepared.reduce((sum, e) => sum + 46 + e.nameBytes.length, 0);

  const out = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(out.buffer);
  let offset = 0;

  const offsets: number[] = [];

  for (const entry of prepared) {
    offsets.push(offset);

    view.setUint32(offset, LOCAL_HEADER_SIG, true);
    view.setUint16(offset + 4, VERSION_NEEDED, true);
    view.setUint16(offset + 6, UTF8_FLAG, true);
    view.setUint16(offset + 8, 0, true); // stored, no compression
    view.setUint16(offset + 10, 0, true); // modification time
    view.setUint16(offset + 12, 0, true); // modification date
    view.setUint32(offset + 14, entry.crc, true);
    view.setUint32(offset + 18, entry.data.length, true); // compressed size
    view.setUint32(offset + 22, entry.data.length, true); // uncompressed size
    view.setUint16(offset + 26, entry.nameBytes.length, true);
    view.setUint16(offset + 28, 0, true); // extra field length
    offset += 30;

    out.set(entry.nameBytes, offset);
    offset += entry.nameBytes.length;
    out.set(entry.data, offset);
    offset += entry.data.length;
  }

  const centralStart = offset;

  prepared.forEach((entry, i) => {
    view.setUint32(offset, CENTRAL_HEADER_SIG, true);
    view.setUint16(offset + 4, VERSION_NEEDED, true); // version made by
    view.setUint16(offset + 6, VERSION_NEEDED, true); // version needed
    view.setUint16(offset + 8, UTF8_FLAG, true);
    view.setUint16(offset + 10, 0, true); // stored
    view.setUint16(offset + 12, 0, true);
    view.setUint16(offset + 14, 0, true);
    view.setUint32(offset + 16, entry.crc, true);
    view.setUint32(offset + 20, entry.data.length, true);
    view.setUint32(offset + 24, entry.data.length, true);
    view.setUint16(offset + 28, entry.nameBytes.length, true);
    view.setUint16(offset + 30, 0, true); // extra
    view.setUint16(offset + 32, 0, true); // comment
    view.setUint16(offset + 34, 0, true); // disk number
    view.setUint16(offset + 36, 0, true); // internal attributes
    view.setUint32(offset + 38, 0, true); // external attributes
    view.setUint32(offset + 42, offsets[i], true);
    offset += 46;

    out.set(entry.nameBytes, offset);
    offset += entry.nameBytes.length;
  });

  view.setUint32(offset, EOCD_SIG, true);
  view.setUint16(offset + 4, 0, true); // this disk
  view.setUint16(offset + 6, 0, true); // disk with central directory
  view.setUint16(offset + 8, prepared.length, true);
  view.setUint16(offset + 10, prepared.length, true);
  view.setUint32(offset + 12, offset - centralStart, true);
  view.setUint32(offset + 16, centralStart, true);
  view.setUint16(offset + 20, 0, true); // comment length

  return out;
}
