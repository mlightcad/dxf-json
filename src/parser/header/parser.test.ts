import { describe, expect, test } from 'vitest'
import { DxfArrayScanner } from '../DxfArrayScanner.ts'
import { parseHeader } from './parser.ts'

function parseHeaderFromLines(lines: string[]) {
  const scanner = new DxfArrayScanner(lines)
  const curr = scanner.next()
  return parseHeader(curr, scanner)
}

describe('HEADER parser', () => {
  test('parses CMLSTYLE header variable', () => {
    const header = parseHeaderFromLines([
      '9',
      '$CMLSTYLE',
      '2',
      'FILL',
      '0',
      'ENDSEC',
      '0',
      'EOF',
    ])

    expect(header['$CMLSTYLE']).toBe('FILL')
  })

  test('uses the last value when a header variable appears multiple times', () => {
    const header = parseHeaderFromLines([
      '9',
      '$CMLSTYLE',
      '2',
      'FILL',
      '9',
      '$CMLSTYLE',
      '2',
      'Standard',
      '0',
      'ENDSEC',
      '0',
      'EOF',
    ])

    expect(header['$CMLSTYLE']).toBe('Standard')
  })
})
