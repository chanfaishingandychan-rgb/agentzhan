import { deflateRawSync } from "node:zlib";

export type ZipFile = {
  name: string;
  data: Buffer;
};

const crcTable = new Uint32Array(256);

for (let i = 0; i < 256; i += 1) {
  let value = i;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  crcTable[i] = value >>> 0;
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getDosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosDate, dosTime };
}

export function createZip(files: ZipFile[]) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  const { dosDate, dosTime } = getDosDateTime();
  let offset = 0;

  for (const file of files) {
    const nameBuffer = Buffer.from(file.name, "utf8");
    const compressedData = deflateRawSync(file.data);
    const checksum = crc32(file.data);
    const compressedSize = compressedData.byteLength;
    const size = file.data.byteLength;
    const flags = 0x0800;
    const compressionMethod = 8;

    const localHeader = Buffer.alloc(30 + nameBuffer.byteLength);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(flags, 6);
    localHeader.writeUInt16LE(compressionMethod, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(compressedSize, 18);
    localHeader.writeUInt32LE(size, 22);
    localHeader.writeUInt16LE(nameBuffer.byteLength, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuffer.copy(localHeader, 30);

    const centralHeader = Buffer.alloc(46 + nameBuffer.byteLength);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(flags, 8);
    centralHeader.writeUInt16LE(compressionMethod, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(compressedSize, 20);
    centralHeader.writeUInt32LE(size, 24);
    centralHeader.writeUInt16LE(nameBuffer.byteLength, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    nameBuffer.copy(centralHeader, 46);

    localParts.push(localHeader, compressedData);
    centralParts.push(centralHeader);
    offset += localHeader.byteLength + compressedData.byteLength;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.byteLength, 0);
  const endHeader = Buffer.alloc(22);
  endHeader.writeUInt32LE(0x06054b50, 0);
  endHeader.writeUInt16LE(0, 4);
  endHeader.writeUInt16LE(0, 6);
  endHeader.writeUInt16LE(files.length, 8);
  endHeader.writeUInt16LE(files.length, 10);
  endHeader.writeUInt32LE(centralSize, 12);
  endHeader.writeUInt32LE(offset, 16);
  endHeader.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, ...centralParts, endHeader], offset + centralSize + endHeader.byteLength);
}
