import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import type { AcshHistoryDXFObject } from './types.ts'

/**
 * Parses an `ACSH_HISTORY_CLASS` object.
 *
 * @param curr Opening `{0, ACSH_HISTORY_CLASS}` group; scanner is on the first in-object group.
 * @param scanner DXF scanner positioned at the first group inside the object.
 */
export function parseAcshHistoryObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshHistoryDXFObject {
  const object: AcshHistoryDXFObject = {
    name: 'ACSH_HISTORY_CLASS',
    handle: '',
    ownerObjectId: '0',
  }

  curr = scanner.next()
  while (curr.code !== 0) {
    switch (curr.code) {
      case 5:
        object.handle = String(curr.value)
        break
      case 330:
        object.ownerObjectId = String(curr.value)
        break
      case 360:
        object.evalGraphHardId = String(curr.value)
        break
      case 100:
        if (curr.value === 'AcDbShHistory') {
          object.subclassMarker = 'AcDbShHistory'
        }
        break
    }
    curr = scanner.next()
  }

  return object
}
