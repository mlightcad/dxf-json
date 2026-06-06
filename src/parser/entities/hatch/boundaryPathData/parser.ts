import { BoundaryPathTypeFlag } from '../../../../consts/hatch.ts'
import {
  parseGroupValue,
  type DxfArrayScanner,
  type ScannerGroup,
} from '../../../DxfArrayScanner.ts'
import { createParser } from '../../../shared/parserGenerator.ts'
import { EdgeBoundaryPathDataSnippets } from './edge.ts'
import { PolylineSnippets } from './polyline.ts'

/**
 * Some exporters omit bit 2 (polyline) on group 92 even when the boundary uses
 * the polyline layout (93 → 72 hasBulge → optional 73 isClosed → vertices).
 * Detect that pattern so we do not treat hasBulge 0 as "edge type 0".
 *
 * When hasBulge is 1, group 72 collides with edge-type Line (also 1). Both
 * layouts then use 10→20 for the first XY pair (vertex vs line start). The next
 * code disambiguates: polyline continues with another 10 or 42 (bulge); a line
 * edge continues with 11 (end X).
 */
function scanSuggestsMislabeledPolylineBoundary(
  lines: readonly string[],
  startPairIndex: number,
): boolean {
  const maxIndex = Math.min(lines.length, startPairIndex + 120)
  let i = startPairIndex
  while (i < maxIndex - 1) {
    const code = parseInt(lines[i], 10)
    if (Number.isNaN(code)) return false
    if (code === 93) {
      if (i + 3 >= lines.length) return false
      const code72 = parseInt(lines[i + 2], 10)
      if (code72 !== 72) return false
      const val72 = parseGroupValue(72, lines[i + 3])
      if (val72 === 0) return true
      if (val72 === 1) {
        if (i + 5 < lines.length) {
          const codeAfterBulge = parseInt(lines[i + 4], 10)
          if (codeAfterBulge === 73) return true
        }
        if (i + 8 < lines.length) {
          const codeAfterBulge = parseInt(lines[i + 4], 10)
          if (codeAfterBulge === 10) {
            const codeAfterStartY = parseInt(lines[i + 8], 10)
            if (codeAfterStartY === 10 || codeAfterStartY === 42) return true
          }
        }
      }
      return false
    }
    if (code === 0) return false
    i += 2
  }
  return false
}

export function parseBoundaryPathData(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
) {
  // assume start with 92
  const boundaryPathData = {
    boundaryPathTypeFlag: curr.value,
  }
  let usePolyline = !!(
    boundaryPathData.boundaryPathTypeFlag & BoundaryPathTypeFlag.Polyline
  )

  const firstInnerPairIndex = scanner.getReadIndex()
  curr = scanner.next()

  if (
    !usePolyline &&
    scanSuggestsMislabeledPolylineBoundary(
      scanner.getLines(),
      firstInnerPairIndex,
    )
  ) {
    usePolyline = true
  }

  if (usePolyline) {
    createParser(PolylineSnippets)(curr, scanner, boundaryPathData)
    return boundaryPathData
  }
  createParser(EdgeBoundaryPathDataSnippets)(curr, scanner, boundaryPathData)
  return boundaryPathData
}
