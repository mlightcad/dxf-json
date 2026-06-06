import { describe, expect, it } from 'vitest'

import { applyVPortTableEntryDefaults } from './defaults.ts'

describe('applyVPortTableEntryDefaults', () => {
  it('fills missing VPORT points used by CAD consumers', () => {
    const entry: Record<string, unknown> = { name: '*Active' }
    applyVPortTableEntryDefaults(entry)
    expect(entry.center).toEqual({ x: 0, y: 0 })
    expect(entry.lowerLeftCorner).toEqual({ x: 0, y: 0 })
    expect(entry.upperRightCorner).toEqual({ x: 1, y: 1 })
    expect(entry.viewDirectionFromTarget).toEqual({ x: 0, y: 0, z: 1 })
    expect(entry.viewTarget).toEqual({ x: 0, y: 0, z: 0 })
    expect(entry.snapBasePoint).toEqual({ x: 0, y: 0 })
    expect(entry.snapSpacing).toEqual({ x: 0, y: 0 })
    expect(entry.gridSpacing).toEqual({ x: 0, y: 0 })
  })

  it('does not overwrite parsed values', () => {
    const entry: Record<string, unknown> = {
      center: { x: 3, y: 4 },
      viewTarget: { x: 1, y: 2, z: 3 },
    }
    applyVPortTableEntryDefaults(entry)
    expect(entry.center).toEqual({ x: 3, y: 4 })
    expect(entry.viewTarget).toEqual({ x: 1, y: 2, z: 3 })
    expect(entry.viewDirectionFromTarget).toEqual({ x: 0, y: 0, z: 1 })
  })
})
