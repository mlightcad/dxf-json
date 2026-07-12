import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'

/**
 * Advances the scanner past an unrecognized OBJECTS entry without storing
 * its groups. Keeps parse time and memory bounded for huge XRECORD blobs.
 *
 * `curr` is the opening `{0, objectName}` group and the scanner is already
 * positioned on the first in-object group (see `DxfParser` / section parsers).
 *
 * @returns the opening `{0, *}` group of the next object; the scanner is
 *          positioned on the first in-object group after that header.
 */
export function skipUnknownDxfObject(
  _curr: ScannerGroup,
  scanner: DxfArrayScanner,
): ScannerGroup {
  let curr = scanner.next()
  while (curr.code !== 0) {
    curr = scanner.next()
  }
  return curr
}
