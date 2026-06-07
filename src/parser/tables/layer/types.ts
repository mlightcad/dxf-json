import type { DxfColor } from '../../../types/color.ts'
import type { CommonDxfTableEntry } from '../types.ts'

export interface LayerTableEntry extends CommonDxfTableEntry {
  subclassMarker: 'AcDbLayerTableRecord'
  name: string
  standardFlag: number
  color: DxfColor
  lineType: string
  isPlotting: boolean
  lineweight: number
  plotStyleNameObjectId?: string
  materialObjectId?: string
}
