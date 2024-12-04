import { describe, it, expect } from 'vitest'
import { DxfParser } from 'dxf-json'
import { join } from 'path'
import { readFileSync } from 'fs'

const dxfContent = readFileSync(join(__dirname, 'tc.dxf'), 'utf-8')

// Helper function to convert hex string to Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  const length = hex.length / 2
  const array = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    array[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return array
}

// Helper function to convert Uint8Array to base64
function uint8ArrayToBase64(array: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < array.length; i++) {
    binary += String.fromCharCode(array[i])
  }
  return btoa(binary)
}

describe('Thumbnail Image Parsing', () => {
  it('should parse thumbnail image as base64 by default', () => {
    const parser = new DxfParser()
    const result = parser.parseSync(dxfContent)
    const expectedBase64 = uint8ArrayToBase64(hexToUint8Array('01020304'))
    expect(result.thumbnailImage?.data).toBe(expectedBase64)
    expect(result.thumbnailImage?.size).toBe(4)
  })

  it('should parse thumbnail image as hex when specified', () => {
    const parser = new DxfParser({ thumbnailImageFormat: 'hex' })
    const result = parser.parseSync(dxfContent)
    expect(result.thumbnailImage?.data).toBe('01020304')
    expect(result.thumbnailImage?.size).toBe(4)
  })
})
