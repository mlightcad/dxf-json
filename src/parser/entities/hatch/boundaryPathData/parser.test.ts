import { describe, expect, it } from 'vitest'

import { BoundaryPathTypeFlag } from '../../../../consts/hatch.ts'
import { DxfArrayScanner } from '../../../DxfArrayScanner.ts'
import { parseBoundaryPathData } from './parser.ts'

function parseBoundaryAt92(lines: string[]) {
  const scanner = new DxfArrayScanner([...lines, '0', 'EOF'])
  const curr = scanner.next()
  expect(curr.code).toBe(92)
  return parseBoundaryPathData(curr, scanner)
}

describe('parseBoundaryPathData', () => {
  it('parses polyline layout when group 92 omits the polyline bit (hasBulge 0)', () => {
    const boundary = parseBoundaryAt92([
      '92',
      String(BoundaryPathTypeFlag.External),
      '93',
      '3',
      '72',
      '0',
      '10',
      '0',
      '20',
      '0',
      '10',
      '10',
      '20',
      '0',
      '10',
      '10',
      '20',
      '10',
    ])

    expect(boundary).toMatchObject({
      boundaryPathTypeFlag: BoundaryPathTypeFlag.External,
      hasBulge: false,
      numberOfVertices: 3,
      vertices: [
        { x: 0, y: 0, bulge: 0 },
        { x: 10, y: 0, bulge: 0 },
        { x: 10, y: 10, bulge: 0 },
      ],
    })
  })

  it('parses open polyline when group 92 omits the polyline bit (hasBulge 1, no 73)', () => {
    const boundary = parseBoundaryAt92([
      '92',
      String(BoundaryPathTypeFlag.External),
      '93',
      '2',
      '72',
      '1',
      '10',
      '0',
      '20',
      '0',
      '10',
      '10',
      '20',
      '0',
      '42',
      '0.5',
    ])

    expect(boundary).toMatchObject({
      hasBulge: true,
      numberOfVertices: 2,
      vertices: [
        { x: 0, y: 0, bulge: 0 },
        { x: 10, y: 0, bulge: 0.5 },
      ],
    })
    expect(boundary).not.toHaveProperty('edges')
  })

  it('keeps edge layout when the first edge is a line (72=1 then 10→11)', () => {
    const boundary = parseBoundaryAt92([
      '92',
      String(BoundaryPathTypeFlag.External),
      '93',
      '1',
      '72',
      '1',
      '10',
      '0',
      '20',
      '0',
      '11',
      '10',
      '21',
      '0',
    ])

    expect(boundary).toMatchObject({
      numberOfEdges: 1,
      edges: [
        {
          type: 1,
          start: { x: 0, y: 0 },
          end: { x: 10, y: 0 },
        },
      ],
    })
    expect(boundary).not.toHaveProperty('vertices')
  })

  it('uses polyline parser when group 92 includes the polyline bit', () => {
    const flag = BoundaryPathTypeFlag.External | BoundaryPathTypeFlag.Polyline
    const boundary = parseBoundaryAt92([
      '92',
      String(flag),
      '93',
      '1',
      '72',
      '0',
      '10',
      '5',
      '20',
      '6',
    ])

    expect(boundary).toMatchObject({
      boundaryPathTypeFlag: flag,
      numberOfVertices: 1,
      vertices: [{ x: 5, y: 6, bulge: 0 }],
    })
  })
})
