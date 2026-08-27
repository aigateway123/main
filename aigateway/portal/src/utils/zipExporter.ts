// ============================================================================
// zipExporter —— 无第三方依赖的 ZIP 打包工具（STORE 模式，不压缩）
//
// 还原参考 demo 的「导出代码 ZIP」功能：将论文复现工程的所有文件
// 打包为浏览器可直接下载的 .zip 文件。为避免引入 jszip 依赖，
// 这里实现一个最小化的 ZIP 容器写入器（仅 STORE 存储，含 CRC32 校验）。
// ============================================================================

export interface ZipEntry {
  path: string
  content: string
}

// ---------------------------------------------------------------- CRC32 表

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

// ---------------------------------------------------------------- 小端写入

function writeUint16(arr: Uint8Array, offset: number, value: number) {
  arr[offset] = value & 0xff
  arr[offset + 1] = (value >>> 8) & 0xff
}

function writeUint32(arr: Uint8Array, offset: number, value: number) {
  arr[offset] = value & 0xff
  arr[offset + 1] = (value >>> 8) & 0xff
  arr[offset + 2] = (value >>> 16) & 0xff
  arr[offset + 3] = (value >>> 24) & 0xff
}

// ---------------------------------------------------------------- DOS 时间

function dosDateTime(): { time: number; date: number } {
  const d = new Date()
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2)
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
  return { time, date }
}

// ---------------------------------------------------------------- ZIP 构建

export function buildZipBlob(entries: ZipEntry[]): Blob {
  const encoder = new TextEncoder()
  const nameBytes = entries.map((e) => encoder.encode(e.path))
  const contentBytes = entries.map((e) => encoder.encode(e.content))
  const crcs = contentBytes.map((b) => crc32(b))
  const { time, date } = dosDateTime()

  let offset = 0
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  const localOffsets: number[] = []

  entries.forEach((e, i) => {
    const name = nameBytes[i]
    const data = contentBytes[i]
    const crc = crcs[i]
    const size = data.length

    // --- 本地文件头 (Local File Header) ---
    const header = new Uint8Array(30)
    writeUint32(header, 0, 0x04034b50)
    writeUint16(header, 4, 20) // version needed
    writeUint16(header, 6, 0x0800) // UTF-8 flag
    writeUint16(header, 8, 0) // method: store
    writeUint16(header, 10, time)
    writeUint16(header, 12, date)
    writeUint32(header, 14, crc)
    writeUint32(header, 18, size)
    writeUint32(header, 22, size)
    writeUint16(header, 26, name.length)
    writeUint16(header, 28, 0) // extra len

    localParts.push(header, name, data)
    localOffsets.push(offset)
    offset += 30 + name.length + size

    // --- 中央目录记录 (Central Directory Record) ---
    const cd = new Uint8Array(46)
    writeUint32(cd, 0, 0x02014b50)
    writeUint16(cd, 4, 20) // version made by
    writeUint16(cd, 6, 20) // version needed
    writeUint16(cd, 8, 0x0800)
    writeUint16(cd, 10, 0) // method: store
    writeUint16(cd, 12, time)
    writeUint16(cd, 14, date)
    writeUint32(cd, 16, crc)
    writeUint32(cd, 20, size)
    writeUint32(cd, 24, size)
    writeUint16(cd, 28, name.length)
    writeUint16(cd, 30, 0) // extra len
    writeUint16(cd, 32, 0) // comment len
    writeUint16(cd, 34, 0) // disk number
    writeUint16(cd, 36, 0) // internal attrs
    writeUint32(cd, 38, 0) // external attrs
    writeUint32(cd, 42, localOffsets[i]) // local header offset

    centralParts.push(cd, name)
  })

  const cdSize = centralParts.reduce((acc, p) => acc + p.length, 0)
  const cdOffset = offset

  // --- 中央目录结束记录 (End of Central Directory) ---
  const eocd = new Uint8Array(22)
  writeUint32(eocd, 0, 0x06054b50)
  writeUint16(eocd, 4, 0) // disk number
  writeUint16(eocd, 6, 0) // cd disk
  writeUint16(eocd, 8, entries.length)
  writeUint16(eocd, 10, entries.length)
  writeUint32(eocd, 12, cdSize)
  writeUint32(eocd, 16, cdOffset)
  writeUint16(eocd, 20, 0) // comment len

  const all = [...localParts, ...centralParts, eocd]
  const total = all.reduce((acc, p) => acc + p.length, 0)
  const out = new Uint8Array(total)
  let pos = 0
  for (const part of all) {
    out.set(part, pos)
    pos += part.length
  }

  return new Blob([out], { type: 'application/zip' })
}

// ---------------------------------------------------------------- 下载触发

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** 将论文复现工程打包为 ZIP 并触发下载 */
export function exportProjectAsZip(paperTitle: string, files: Array<{ path: string; content: string }>) {
  const cleanName = paperTitle.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 30)
  const root = `paper2code_${cleanName}`

  const entries: ZipEntry[] = files.map((f) => {
    const cleanPath = f.path.startsWith('/') ? f.path.slice(1) : f.path
    return { path: `${root}/${cleanPath}`, content: f.content }
  })

  const blob = buildZipBlob(entries)
  downloadBlob(blob, `paper2code_${cleanName}_reproduction.zip`)
}
