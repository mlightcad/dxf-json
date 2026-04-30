import type { CommonDXFObject } from '../types.ts'

/**
 * MLINESTYLE object fields mapped from AutoCAD DXF group codes.
 *
 * Reference:
 * https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-DXF/files/GUID-3EC12E5B-F5F6-484D-880F-D69EBE186D79.htm
 */
export interface MLineStyleDXFObject extends CommonDXFObject {
  /**
   * Group code 100: subclass marker for this object.
   * Expected value: `AcDbMlineStyle`.
   */
  subclassMarker: 'AcDbMlineStyle'

  /**
   * Group code 2: MLINE style name.
   *
   * This is redundant with the dictionary key (group code 3 in the
   * MLINESTYLE dictionary entry) and should be treated as read-only.
   */
  styleName?: string

  /**
   * Group code 70: style flags (bit-coded).
   *
   * Bit values:
   * - 1: fill on
   * - 2: display miters
   * - 16: start square end (line) cap
   * - 32: start inner arcs cap
   * - 64: start round (outer arcs) cap
   * - 256: end square (line) cap
   * - 512: end inner arcs cap
   * - 1024: end round (outer arcs) cap
   */
  flags?: number

  /**
   * Group code 3: style description string.
   * Maximum length is 255 characters in DXF spec.
   */
  description?: string

  /**
   * Group code 62: fill color.
   * Default in spec is 256 (BYLAYER).
   */
  fillColor?: number

  /**
   * Group code 51: start angle.
   * DXF writes angle values in degrees.
   */
  startAngle?: number

  /**
   * Group code 52: end angle.
   * DXF writes angle values in degrees.
   */
  endAngle?: number

  /**
   * Group code 71: number of line elements in this style.
   */
  elementCount?: number

  /**
   * Group code 49 (repeated): element offsets.
   * One entry per style element.
   */
  elementOffsets?: number[]

  /**
   * Group code 62 (repeated after element definitions): element colors.
   * One entry per style element.
   */
  elementColors?: number[]

  /**
   * Group code 6 (repeated): element linetype names.
   * One entry per style element.
   */
  elementLineTypes?: string[]
}
