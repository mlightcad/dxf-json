import { describe, expect, it } from 'vitest'

import {
  appendAcisPayloadFragment,
  decryptAcisData,
  isEncryptedAcisData,
  joinAcisPayloadLines,
  normalizeAcisData,
} from './decrypt.ts'

describe('decryptAcisData', () => {
  it('decrypts AutoCAD-obfuscated SAT header text', () => {
    expect(decryptAcisData('mngoo jo m nm')).toBe('21800 50 2 12')
  })

  it('preserves whitespace characters', () => {
    expect(decryptAcisData(' ')).toBe(' ')
    expect(decryptAcisData('\n')).toBe('\n')
  })

  it('leaves plain SAT text unchanged via normalizeAcisData', () => {
    const plain = '400 0 1 0\npoint $-1 1 2 3 #'
    expect(isEncryptedAcisData(plain)).toBe(false)
    expect(normalizeAcisData(plain)).toBe(plain)
  })

  it('normalizes encrypted payloads', () => {
    const encrypted = 'mngoo jo m nm'
    expect(isEncryptedAcisData(encrypted)).toBe(true)
    expect(normalizeAcisData(encrypted)).toBe('21800 50 2 12')
  })
})

describe('joinAcisPayloadLines', () => {
  it('decrypts and joins SAT lines with newlines', () => {
    expect(joinAcisPayloadLines(['mngoo jo m nm', 'body $1 $2 $-1 $-1 #'])).toBe(
      '21800 50 2 12\nbody $1 $2 $-1 $-1 #',
    )
  })
})

describe('appendAcisPayloadFragment', () => {
  it('starts a SAT line on group 1 and continues it on group 3', () => {
    const lines: string[] = []
    appendAcisPayloadFragment(lines, 1, 'line-a-')
    appendAcisPayloadFragment(lines, 3, 'continued')
    expect(lines).toEqual(['line-a-continued'])
  })

  it('starts a new SAT line on each group 1', () => {
    const lines: string[] = []
    appendAcisPayloadFragment(lines, 1, 'first')
    appendAcisPayloadFragment(lines, 1, 'second')
    expect(lines).toEqual(['first', 'second'])
  })
})
