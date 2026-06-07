import type { ScannerGroup } from '../DxfArrayScanner.ts'
import {
  DxfColorMethod,
  type ColorIndex,
  type DxfColor,
} from '../../types/color.ts'

export const ENTITY_COLOR_CODES = [
  62,
  ...Array.from({ length: 20 }, (_, index) => 420 + index),
]

export const ACI_TRUE_COLOR_NAME_CODES = [
  63,
  ...Array.from({ length: 20 }, (_, index) => 420 + index),
]

export const ACI_TRUE_COLOR_NAME_SINGLE_CODES = [63, 421, 431]

export function colorMethodFromIndex(index: ColorIndex): DxfColorMethod {
  const visibleIndex = Math.abs(index)

  if (visibleIndex === 0) return DxfColorMethod.BYBLOCK
  if (visibleIndex === 256) return DxfColorMethod.BYLAYER
  return DxfColorMethod.ACI
}

export function colorFromIndex(index: ColorIndex): DxfColor {
  return {
    colorIndex: index,
    method: colorMethodFromIndex(index),
  }
}

export function parseColor(
  curr: ScannerGroup,
  color?: DxfColor,
): DxfColor | undefined {
  if (isColorIndexCode(curr.code)) {
    return {
      ...color,
      ...colorFromIndex(curr.value),
    }
  }

  if (isTrueColorCode(curr.code)) {
    return {
      ...color,
      trueColor: curr.value,
    }
  }

  if (isColorNameCode(curr.code)) {
    return {
      ...color,
      name: curr.value,
    }
  }

  return color
}

export function canMergeColor(curr: ScannerGroup, color?: DxfColor): boolean {
  if (!color) return true
  if (isColorIndexCode(curr.code)) {
    return color.colorIndex === undefined
  }
  if (isTrueColorCode(curr.code)) {
    return color.trueColor === undefined
  }
  if (isColorNameCode(curr.code)) {
    return color.name === undefined
  }
  return false
}

export function isColorCode(code: number): boolean {
  return (
    isColorIndexCode(code) || isTrueColorCode(code) || isColorNameCode(code)
  )
}

function isColorIndexCode(code: number): boolean {
  return code === 62 || code === 63
}

function isTrueColorCode(code: number): boolean {
  return code >= 420 && code <= 429
}

function isColorNameCode(code: number): boolean {
  return code >= 430 && code <= 439
}
