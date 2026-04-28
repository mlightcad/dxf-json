import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'

/**
 * Parse gradient colors data
 * DXF format:
 *   463 - color tint value
 *   63 - color index (ACI)
 *   421 - RGB color value
 * 
 * This group repeats numberOfColors times
 * 
 * @param curr Current scanner group (should point to 463)
 * @param scanner DXF scanner
 * @returns Array of color objects containing rgb and tint information
 */
export function parseGradientColors(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): Array<{ tint: number; rgb: number; colorIndex?: number }> {
  const colors: Array<{ tint: number; rgb: number; colorIndex?: number }> = []

  // Start from 463 and process each color definition
  while (curr.code === 463) {
    const color: any = {
      tint: curr.value,
    }

    // Read next
    curr = scanner.next()

    // Handle 63 (color index - ACI)
    if (curr.code === 63) {
      color.colorIndex = curr.value
      curr = scanner.next()
    }

    // Handle 421 (RGB color)
    if (curr.code === 421) {
      color.rgb = curr.value
      colors.push(color)
      curr = scanner.next()
    } else {
      // If 421 is missing, rewind the scanner
      scanner.rewind()
      break
    }
  }

  // If the last next() read a non-463 code, rewind
  if (curr.code !== 463 && colors.length > 0) {
    scanner.rewind()
  }

  return colors
}