import { describe, expect, it } from 'vitest'

import { parseAcdsData, getAcdsDataByOwnerHandle } from './parser.ts'
import { DxfArrayScanner } from '../DxfArrayScanner.ts'

function parseSection(lines: string[]) {
  const scanner = new DxfArrayScanner(lines)
  let curr = scanner.next()
  while (!(curr.code === 2 && curr.value === 'ACDSDATA')) {
    if (curr.code === 0 && curr.value === 'EOF') {
      throw new Error('ACDSDATA section not found')
    }
    curr = scanner.next()
  }
  curr = scanner.next()
  return parseAcdsData(curr, scanner)
}

describe('parseAcdsData', () => {
  it('indexes ASM_Data payloads by owner handle', () => {
    const lines = [
      '0',
      'SECTION',
      '2',
      'ACDSDATA',
      '0',
      'ACDSRECORD',
      '90',
      '0',
      '2',
      'AcDbDs::ID',
      '280',
      '10',
      '320',
      '7E9',
      '2',
      'ASM_Data',
      '280',
      '15',
      '94',
      '20',
      '310',
      '414349532042696E61727946696C65',
      '0',
      'ENDSEC',
    ]

    const result = parseSection(lines)
    expect(result.byOwnerHandle['7E9']).toBeDefined()
    expect(result.byOwnerHandle['7E9']!.length).toBeGreaterThan(10)
    expect(String.fromCharCode(result.byOwnerHandle['7E9']![0]!)).toBe('A')
    expect(getAcdsDataByOwnerHandle(result, '7e9')).toEqual(
      result.byOwnerHandle['7E9'],
    )
  })

  it('collects ASM_Data 310 chunks after intermediate group 2 entries', () => {
    const lines = [
      '0',
      'SECTION',
      '2',
      'ACDSDATA',
      '0',
      'ACDSRECORD',
      '320',
      '7E9',
      '2',
      'AcDbDs::ID',
      '280',
      '10',
      '2',
      'ASM_Data',
      '280',
      '15',
      '310',
      '4143',
      '310',
      '4953',
      '0',
      'ENDSEC',
    ]

    const result = parseSection(lines)
    expect(result.byOwnerHandle['7E9']).toBeDefined()
    expect(result.byOwnerHandle['7E9']!.length).toBe(4)
    expect(String.fromCharCode(...result.byOwnerHandle['7E9']!)).toBe('ACIS')
  })

  it('ignores non-ASM_Data records', () => {
    const lines = [
      '0',
      'SECTION',
      '2',
      'ACDSDATA',
      '0',
      'ACDSRECORD',
      '320',
      '22',
      '2',
      'Thumbnail_Data',
      '310',
      '89504E47',
      '0',
      'ENDSEC',
    ]

    const result = parseSection(lines)
    expect(Object.keys(result.byOwnerHandle)).toHaveLength(0)
  })
})
