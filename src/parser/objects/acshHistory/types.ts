import type { CommonDXFObject } from '../types.ts'

/** DXF OBJECT entry `ACSH_HISTORY_CLASS` (AcDbShHistory). */
export interface AcshHistoryDXFObject extends CommonDXFObject {
  name: 'ACSH_HISTORY_CLASS'
  subclassMarker?: 'AcDbShHistory'
  /** Group code 360: hard-pointer to the ACAD_EVALUATION_GRAPH object. */
  evalGraphHardId?: string
}
