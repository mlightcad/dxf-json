import { describe, expect, it } from 'vitest'

import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseAcshBoxObject } from './parser.ts'

function scanObject(lines: string[]) {
  const scanner = new DxfArrayScanner(lines)
  let curr = scanner.next()
  while (!(curr.code === 0 && curr.value === 'ACSH_BOX_CLASS')) {
    curr = scanner.next()
  }
  return parseAcshBoxObject(curr, scanner)
}

describe('parseAcshBoxObject', () => {
  it('parses transform matrix and box dimensions', () => {
    const object = scanObject([
      '0',
      'ACSH_BOX_CLASS',
      '5',
      '155',
      '330',
      '156',
      '100',
      'AcDbShHistoryNode',
      '40',
      '1.0',
      '41',
      '0.0',
      '42',
      '0.0',
      '43',
      '10.0',
      '44',
      '0.0',
      '45',
      '1.0',
      '46',
      '0.0',
      '47',
      '20.0',
      '48',
      '0.0',
      '49',
      '0.0',
      '50',
      '1.0',
      '51',
      '30.0',
      '52',
      '0.0',
      '53',
      '0.0',
      '54',
      '0.0',
      '55',
      '1.0',
      '100',
      'AcDbShBox',
      '40',
      '4.0',
      '41',
      '6.0',
      '42',
      '8.0',
      '0',
      'EOF',
    ])

    expect(object.handle).toBe('155')
    expect(object.ownerObjectId).toBe('156')
    expect(object.transform).toEqual([
      1, 0, 0, 10, 0, 1, 0, 20, 0, 0, 1, 30, 0, 0, 0, 1,
    ])
    expect(object.length).toBe(4)
    expect(object.width).toBe(6)
    expect(object.height).toBe(8)
  })
})
