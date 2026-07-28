import { deflateRawSync } from "node:zlib";

import { NextRequest, NextResponse } from "next/server";

import { codexDeepSeekProduct, getCodexDeepSeekDownloadToken } from "@/lib/products";

export const runtime = "nodejs";

type ZipFile = {
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

function createZip(files: ZipFile[]) {
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

function buildReadme() {
  return `# ${codexDeepSeekProduct.title}

感谢购买。请先阅读本文件，再继续安装准备。

## 重要说明

- 本包用于 Mac Codex 接入 DeepSeek 的自助安装准备。
- 你需要自备 DeepSeek API Key，API 用量费用由你的 DeepSeek 帐户另行承担。
- 不要把 API Key、密码或验证码发送给任何人。
- 如果你的 Codex、macOS 或本地配置与说明不一致，请先停止操作并通过微信联系。

## 文件说明

- README.md：本说明。
- install-checklist.md：安装前检查清单。
- deepseek-env-template.txt：填写 DeepSeek API Key 时可参考的变量模板。
- support-message-template.txt：遇到问题时复制给微信客服的排查信息模板。

## 售后

请保留付款备注码。后续如果安装脚本更新，会按购买记录补发。
`;
}

function buildChecklist() {
  return `# 安装前检查清单

1. 确认你使用的是 macOS。
2. 确认 Codex 在本机已经可以正常打开。
3. 确认你已有 DeepSeek API Key。
4. 确认终端可以联网。
5. 安装前先备份自己的 Codex 配置。
6. 不要把 API Key 发给客服，只描述报错现象即可。
`;
}

function buildEnvTemplate() {
  return `# DeepSeek API Key 模板
# 复制时只在自己的本机使用，不要发送给他人。

DEEPSEEK_API_KEY=请在这里填入你自己的 DeepSeek API Key
DEEPSEEK_MODEL_FAST=deepseek-chat
DEEPSEEK_MODEL_PRO=deepseek-reasoner
`;
}

function buildSupportTemplate() {
  return `# 微信客服排查信息模板

付款备注码：
Mac 型号：
macOS 版本：
Codex 是否能正常打开：
DeepSeek API Key 是否已准备好：是 / 否
遇到的问题：
截图说明：

请不要发送 API Key、密码或验证码。
`;
}

function buildProductZip() {
  return createZip([
    { name: "README.md", data: Buffer.from(buildReadme(), "utf8") },
    { name: "install-checklist.md", data: Buffer.from(buildChecklist(), "utf8") },
    { name: "deepseek-env-template.txt", data: Buffer.from(buildEnvTemplate(), "utf8") },
    { name: "support-message-template.txt", data: Buffer.from(buildSupportTemplate(), "utf8") },
  ]);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() || "";
  const expectedToken = getCodexDeepSeekDownloadToken();

  if (!expectedToken || token !== expectedToken) {
    return NextResponse.json({ error: "Download locked" }, { status: 401 });
  }

  const file = buildProductZip();

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${codexDeepSeekProduct.downloadName}"`,
      "Content-Length": String(file.byteLength),
      "Content-Type": "application/zip",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
