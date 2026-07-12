import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import type { AcadEvalGraphDXFObject } from './types.ts'

/**
 * Parses an `ACAD_EVALUATION_GRAPH` object.
 *
 * @param curr Opening `{0, ACAD_EVALUATION_GRAPH}` group; scanner is on the first in-object group.
 * @param scanner DXF scanner positioned at the first group inside the object.
 */
export function parseAcadEvalGraphObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcadEvalGraphDXFObject {
  const object: AcadEvalGraphDXFObject = {
    name: 'ACAD_EVALUATION_GRAPH',
    handle: '',
    ownerObjectId: '0',
    nodeObjectHardIds: [],
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
        object.nodeObjectHardIds!.push(String(curr.value))
        break
      case 100:
        if (curr.value === 'AcDbEvalGraph') {
          object.subclassMarker = 'AcDbEvalGraph'
        }
        break
    }
    curr = scanner.next()
  }

  return object
}
