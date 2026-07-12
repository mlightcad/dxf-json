import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import { joinAcisObjectChunks } from '../acis/decrypt.ts'
import type { CommonDXFObject } from './types.ts'

/** Common fields on ACSH history-node OBJECT entries (`AcDbShHistoryNode`). */
export interface AcshHistoryNodeFields {
  /**
   * Row-major 4×4 transform from groups 40–55 under `AcDbShHistoryNode`.
   * Positions the primitive in WCS.
   */
  transform?: number[]
  /** Encrypted or plain ACIS payload from repeated group 1 lines. */
  acisData?: string
}

type AcshParsePhase = 'header' | 'matrix' | 'primitive' | 'acis'

/**
 * Shared scanner for ACSH OBJECT entries that contain an `AcDbShHistoryNode`
 * transform (groups 40–55) and optional primitive-specific doubles.
 *
 * @param curr Opening `{0, objectName}` group; scanner is on the first in-object group.
 * @param scanner DXF scanner positioned at the first group inside the object.
 * @param createObject Factory that initializes the target object with its DXF `name`.
 * @param onPrimitiveCode Called for numeric groups 40–99 under a primitive subclass.
 * @param collectAcis When true, concatenates group 1/3 chunks into {@link AcshHistoryNodeFields.acisData}.
 * @param onSubclass Invoked when a primitive subclass marker (e.g. `AcDbShBox`) is seen.
 */
export function parseAcshHistoryNodeObject<
  T extends CommonDXFObject & AcshHistoryNodeFields,
>(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
  createObject: () => T,
  onPrimitiveCode?: (code: number, value: number, object: T) => void,
  collectAcis = false,
  onSubclass?: (subclass: string) => void,
): T {
  const object = createObject()
  let phase: AcshParsePhase = 'header'
  const matrix: number[] = []
  const acisChunks: string[] = []

  curr = scanner.next()
  while (curr.code !== 0) {
    switch (curr.code) {
      case 5:
        object.handle = String(curr.value)
        break
      case 330:
        object.ownerObjectId = String(curr.value)
        break
      case 100:
        if (curr.value === 'AcDbShHistoryNode') {
          phase = 'matrix'
        } else if (
          typeof curr.value === 'string' &&
          curr.value.startsWith('AcDbSh') &&
          curr.value !== 'AcDbShHistoryNode'
        ) {
          phase = 'primitive'
          onSubclass?.(curr.value)
        }
        break
      case 1:
        if (collectAcis) {
          phase = 'acis'
          acisChunks.push(String(curr.value))
        }
        break
      case 3:
        if (collectAcis) {
          acisChunks.push(String(curr.value))
        }
        break
      default:
        if (phase === 'matrix' && curr.code >= 40 && curr.code <= 55) {
          const value = Number(curr.value)
          if (Number.isFinite(value)) {
            matrix.push(value)
          }
        } else if (phase === 'primitive' && curr.code >= 40 && curr.code <= 99) {
          const value = Number(curr.value)
          if (Number.isFinite(value)) {
            onPrimitiveCode?.(curr.code, value, object)
          }
        }
        break
    }
    curr = scanner.next()
  }

  if (matrix.length === 16) {
    object.transform = matrix
  }
  if (acisChunks.length > 0) {
    object.acisData = joinAcisObjectChunks(acisChunks)
  }

  return object
}
