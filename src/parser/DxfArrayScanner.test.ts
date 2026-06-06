import { describe, expect, it } from 'vitest'

import { DxfArrayScanner, parseGroupValue } from './DxfArrayScanner.ts'

describe('DxfArrayScanner', () => {
  describe('invalid group code lines', () => {
    it('throws on blank code line in next()', () => {
      const scanner = new DxfArrayScanner(['', 'value', '0', 'EOF'])
      expect(() => scanner.next()).toThrow(/Invalid DXF group code line/)
    })

    it('throws on blank code line in peek()', () => {
      const scanner = new DxfArrayScanner(['', 'value', '0', 'EOF'])
      expect(() => scanner.peek()).toThrow(/Invalid DXF group code line/)
    })
  })

  describe('getReadIndex / getLines', () => {
    it('exposes the next code-line index and backing lines', () => {
      const lines = ['10', '1', '20', '2', '0', 'EOF']
      const scanner = new DxfArrayScanner(lines)
      expect(scanner.getReadIndex()).toBe(0)
      expect(scanner.getLines()).toBe(lines)
      scanner.next()
      expect(scanner.getReadIndex()).toBe(2)
    })
  })
})

describe('parseGroupValue booleans (groups 290–299)', () => {
  it.each([
    ['0', false],
    ['1', true],
    ['true', true],
    ['false', false],
    ['', false],
  ] as const)('parses %j as %s', (input, expected) => {
    expect(parseGroupValue(290, input)).toBe(expected)
  })

  it('throws on non-boolean strings', () => {
    expect(() => parseGroupValue(290, 'maybe')).toThrow(/cannot be cast to Boolean/)
  })
})
