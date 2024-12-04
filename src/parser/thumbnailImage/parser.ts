import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import { isMatched } from '../shared/isMatched.ts'

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

export function parseThumbnailImage(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
  format: 'base64' | 'hex' | 'buffer' = 'base64'
): { size: number; data: string | Uint8Array } {
  let hexString = ''
  let size = 0

  while (!isMatched(curr, 0, 'EOF')) {
    if (isMatched(curr, 0, 'ENDSEC')) {
      break
    }

    if (curr.code === 90) {
      size = curr.value as number
    } else if (curr.code === 310) {
      hexString += curr.value
    }
    curr = scanner.next()
  }

  // Convert hex string to requested format
  let data: string | Uint8Array
  if (format === 'hex') {
    data = hexString
  } else {
    const uint8Array = hexToUint8Array(hexString)
    if (format === 'buffer') {
      data = uint8Array
    } else {
      // Default: base64
      data = uint8ArrayToBase64(uint8Array)
    }
  }

  return {
    size,
    data,
  }
}
