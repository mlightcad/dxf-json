import type { CommonDXFObject } from '../types.ts'

/** DXF OBJECT entry `ACSH_BOX_CLASS` (AcDbShBox primitive). */
export interface AcshBoxDXFObject extends CommonDXFObject {
  name: 'ACSH_BOX_CLASS'
  /**
   * Row-major 4×4 transform from `AcDbShHistoryNode` groups 40–55.
   * Positions the box primitive in WCS.
   */
  transform?: number[]
  /** Box length along local X (group 40 under AcDbShBox). */
  length?: number
  /** Box width along local Y (group 41 under AcDbShBox). */
  width?: number
  /** Box height along local Z (group 42 under AcDbShBox). */
  height?: number
}
