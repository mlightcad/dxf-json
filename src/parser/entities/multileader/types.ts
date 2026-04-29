import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

export interface MultiLeaderEntity extends CommonDxfEntity {
  type: 'MULTILEADER'
  subclassMarker?: 'AcDbMLeader'
  version?: number

  leaderStyleId?: string
  propertyOverrideFlag?: number
  leaderLineType?: number
  leaderLineColor?: number
  leaderLineTypeId?: string
  leaderLineWeight?: number
  landingEnabled?: boolean
  doglegEnabled?: boolean
  doglegLength?: number
  arrowheadId?: string
  arrowheadSize?: number
  contentType?: number
  textStyleId?: string
  textLeftAttachmentType?: number
  textRightAttachmentType?: number
  textAngleType?: number
  textAlignmentType?: number
  textColor?: number
  textFrameEnabled?: boolean
  landingGap?: number
  textAttachment?: number
  textFlowDirection?: number
  blockContentId?: string
  blockContentColor?: number
  blockContentScale?: Point3D
  blockContentRotation?: number
  blockContentConnectionType?: number
  annotativeScaleEnabled?: boolean
  arrowheadOverrides?: MultiLeaderIndexedHandle[]
  blockAttributes?: MultiLeaderBlockAttribute[]
  textDirectionNegative?: boolean
  textAlignInIPE?: number
  textAttachmentPoint?: number
  textAttachmentDirection?: number
  bottomTextAttachmentDirection?: number
  topTextAttachmentDirection?: number

  contentScale?: number
  contentBasePosition?: Point3D
  normal?: Point3D
  textHeight?: number
  textRotation?: number
  textWidth?: number
  textLineSpacingFactor?: number
  textLineSpacingStyle?: number
  textAnchor?: Point3D
  textDirection?: Point3D
  textBackgroundColor?: number
  textBackgroundScaleFactor?: number
  textBackgroundTransparency?: number
  textBackgroundColorOn?: boolean
  textFillOn?: boolean
  textColumnType?: number
  textUseAutoHeight?: boolean
  textColumnWidth?: number
  textColumnGutterWidth?: number
  textColumnFlowReversed?: boolean
  textColumnHeight?: number
  textUseWordBreak?: boolean
  textContent?: string
  hasMText?: boolean
  hasBlock?: boolean
  blockContent?: {
    blockContentId?: string
    normal?: Point3D
    position?: Point3D
    scale?: Point3D
    rotation?: number
    color?: number
    transformationMatrix?: number[]
  }
  planeOrigin?: Point3D
  planeXAxisDirection?: Point3D
  planeYAxisDirection?: Point3D
  planeNormalReversed?: boolean
  leaderSections?: MultiLeaderLeaderSection[]
}

export interface MultiLeaderLeaderSection {
  lastLeaderLinePoint?: Point3D
  lastLeaderLinePointSet?: boolean
  doglegVector?: Point3D
  doglegVectorSet?: boolean
  doglegLength?: number
  breaks?: MultiLeaderBreak[]
  leaderBranchIndex?: number
  leaderLines: MultiLeaderLeaderLine[]
}

export interface MultiLeaderLeaderLine {
  vertices: Point3D[]
  breakPointIndexes?: number[]
  leaderLineIndex?: number
  breaks?: MultiLeaderBreak[]
}

export interface MultiLeaderBreak {
  index?: number
  start: Point3D
  end: Point3D
}

export interface MultiLeaderIndexedHandle {
  index: number
  handle: string
}

export interface MultiLeaderBlockAttribute {
  id?: string
  index?: number
  width?: number
  text?: string
}
