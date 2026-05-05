import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import type { DxfColor } from '../../../types/color.ts'
import { parseColor } from '../../shared/parseColor.ts'

export interface HatchGradientColor {
  reservedField: number
  color?: DxfColor
}

/**
 * Parse gradient colors data
 * DXF format:
 *   463 - reserved data for future use
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
): HatchGradientColor[] {
  const colors: HatchGradientColor[] = []

  // Start from 463 and process each color definition
  while (curr.code === 463) {
    const color: any = {
      reservedField: curr.value,
    }

    // Read next
    curr = scanner.next()

    // Handle 63 (color index - ACI)
    if (curr.code === 63) {
      color.color = parseColor(curr, color.color)
      curr = scanner.next()
    }

    // Handle 421 (RGB color)
    if (curr.code === 421) {
      color.color = parseColor(curr, color.color)
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
