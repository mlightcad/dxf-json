import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import type { AcdsDataSection } from './types.ts'

const ASM_DATA_TYPE = 'ASM_Data'

/** Normalizes a DXF handle for cross-section lookups (uppercase, trimmed). */
export function normalizeDxfHandle(handle: string): string {
  return String(handle).trim().toUpperCase()
}

/** Looks up an ASM_Data payload by owner handle with normalized matching. */
export function getAcdsDataByOwnerHandle(
  section: AcdsDataSection,
  ownerHandle: string,
): Uint8Array | undefined {
  return section.byOwnerHandle[normalizeDxfHandle(ownerHandle)]
}

function hexToBytes(hex: string): Uint8Array | undefined {
  const cleaned = hex.replace(/\s+/g, '')
  if (cleaned.length === 0) {
    return new Uint8Array(0)
  }
  if (cleaned.length % 2 !== 0) {
    return undefined
  }
  const length = cleaned.length / 2
  const out = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    const byte = Number.parseInt(cleaned.slice(i * 2, i * 2 + 2), 16)
    if (byte < 0 || byte > 255) {
      return undefined
    }
    out[i] = byte
  }
  return out
}

function parseAcdsRecord(
  scanner: DxfArrayScanner,
): {
  ownerHandle?: string
  dataType?: string
  hexChunks: string[]
} {
  let ownerHandle: string | undefined
  let currentDataType: string | undefined
  const chunksByType: Record<string, string[]> = {}

  let curr = scanner.next()
  while (curr.code !== 0) {
    switch (curr.code) {
      case 320:
        ownerHandle = normalizeDxfHandle(String(curr.value))
        break
      case 2:
        currentDataType = String(curr.value)
        chunksByType[currentDataType] ??= []
        break
      case 310:
        if (currentDataType) {
          chunksByType[currentDataType]!.push(String(curr.value))
        }
        break
      default:
        break
    }
    curr = scanner.next()
  }

  const hexChunks = chunksByType[ASM_DATA_TYPE] ?? []
  const dataType = hexChunks.length > 0 ? ASM_DATA_TYPE : undefined

  return { ownerHandle, dataType, hexChunks }
}

/**
 * Parses the DXF `ACDSDATA` section and indexes `ASM_Data` binary payloads by
 * the owning entity handle (group 320).
 *
 * @param curr First group inside the section (after the `ACDSDATA` header).
 * @param scanner DXF scanner positioned at `curr`.
 */
export function parseAcdsData(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcdsDataSection {
  const byOwnerHandle: Record<string, Uint8Array> = {}

  while (curr.code !== 0 || !['EOF', 'ENDSEC'].includes(String(curr.value))) {
    if (curr.code === 0 && curr.value === 'ACDSRECORD') {
      const record = parseAcdsRecord(scanner)
      if (
        record.ownerHandle &&
        record.dataType === ASM_DATA_TYPE &&
        record.hexChunks.length > 0
      ) {
        const payload = hexToBytes(record.hexChunks.join(''))
        if (payload) {
          byOwnerHandle[record.ownerHandle] = payload
        }
      }
      curr = scanner.lastReadGroup
    } else if (curr.code === 0) {
      curr = scanner.next()
    } else {
      curr = scanner.next()
    }
  }

  return { byOwnerHandle }
}
