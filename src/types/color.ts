import type { ColorCode, UndeterminedBlockColor } from '../consts/color.ts'

export type ColorIndex = ColorCode | number

export type ColorInstance = typeof UndeterminedBlockColor | number

export enum DxfColorMethod {
  BYBLOCK = 'BYBLOCK',
  BYLAYER = 'BYLAYER',
  ACI = 'ACI',
}

export interface DxfColor {
  /**
   * Raw AutoCAD Color Index from group code 62/63.
   *
   * 0 is BYBLOCK, 256 is BYLAYER, and negative values mean that
   * the layer is off while the absolute value remains the color index.
   */
  colorIndex?: ColorIndex
  method?: DxfColorMethod
  /**
   * Raw 24-bit integer from DXF group code 420/421.
   *
   * AutoCAD stores this as 0x00RRGGBB; the lowest byte is blue,
   * the middle byte is green, and the third byte is red.
   */
  trueColor?: number
  name?: string
}
