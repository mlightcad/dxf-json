import type { CommonDXFObject } from '../types.ts'

/** DXF OBJECT entry `ACAD_EVALUATION_GRAPH` (AcDbEvalGraph). */
export interface AcadEvalGraphDXFObject extends CommonDXFObject {
  name: 'ACAD_EVALUATION_GRAPH'
  subclassMarker?: 'AcDbEvalGraph'
  /**
   * Group code 360 (repeated): hard pointers to ACSH primitive / history nodes
   * referenced by this evaluation graph.
   */
  nodeObjectHardIds?: string[]
}
