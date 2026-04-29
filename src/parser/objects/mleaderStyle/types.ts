import type { Point3D } from '../../../types/shared.ts'
import type { CommonDXFObject } from '../types.ts'

export interface MLeaderStyleDXFObject extends CommonDXFObject {
  subclassMarker: 'AcDbMLeaderStyle'
  /**
   * Undocumented group code 179, observed in AutoCAD-generated MLEADERSTYLE
   * objects.
   */
  unknown1?: number
  contentType?: number
  drawMLeaderOrderType?: number
  drawLeaderOrderType?: number
  maxLeaderSegmentPoints?: number
  firstSegmentAngleConstraint?: number
  secondSegmentAngleConstraint?: number
  leaderLineType?: number
  leaderLineColor?: number
  leaderLineTypeId?: string
  leaderLineWeight?: number
  landingEnabled?: boolean
  landingGap?: number
  doglegEnabled?: boolean
  doglegLength?: number
  description?: string
  arrowheadId?: string
  arrowheadSize?: number
  defaultMTextContents?: string
  textStyleId?: string
  textLeftAttachmentType?: number
  textAngleType?: number
  textAlignmentType?: number
  textRightAttachmentType?: number
  textColor?: number
  textHeight?: number
  textFrameEnabled?: boolean
  textAlignAlwaysLeft?: boolean
  alignSpace?: number
  blockContentId?: string
  blockContentColor?: number
  blockContentScale?: Point3D
  blockContentScaleEnabled?: boolean
  blockContentRotation?: number
  blockContentRotationEnabled?: boolean
  blockContentConnectionType?: number
  scale?: number
  overwritePropertyValue?: boolean
  annotative?: boolean
  breakGapSize?: number
  textAttachmentDirection?: number
  bottomTextAttachmentDirection?: number
  topTextAttachmentDirection?: number
  /**
   * Undocumented group code 298, observed in AutoCAD-generated MLEADERSTYLE
   * objects.
   */
  unknown2?: boolean
}
