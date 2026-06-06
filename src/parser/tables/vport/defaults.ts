/**
 * Fills VPORT table fields that some DXF files omit but downstream consumers expect.
 * Missing groups would otherwise leave properties undefined after parsing.
 */
export function applyVPortTableEntryDefaults(entry: Record<string, unknown>): void {
  if (entry.lowerLeftCorner == null) {
    entry.lowerLeftCorner = { x: 0, y: 0 }
  }
  if (entry.upperRightCorner == null) {
    entry.upperRightCorner = { x: 1, y: 1 }
  }
  if (entry.center == null) {
    entry.center = { x: 0, y: 0 }
  }
  if (entry.snapBasePoint == null) {
    entry.snapBasePoint = { x: 0, y: 0 }
  }
  if (entry.snapSpacing == null) {
    entry.snapSpacing = { x: 0, y: 0 }
  }
  if (entry.gridSpacing == null) {
    entry.gridSpacing = { x: 0, y: 0 }
  }
  if (entry.viewDirectionFromTarget == null) {
    entry.viewDirectionFromTarget = { x: 0, y: 0, z: 1 }
  }
  if (entry.viewTarget == null) {
    entry.viewTarget = { x: 0, y: 0, z: 0 }
  }
}
