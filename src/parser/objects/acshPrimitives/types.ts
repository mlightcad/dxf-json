import type { CommonDXFObject } from '../types.ts'
import type { AcshHistoryNodeFields } from '../acshShared.ts'

/** DXF OBJECT entry `ACSH_CYLINDER_CLASS` (AcDbShCylinder primitive). */
export interface AcshCylinderDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_CYLINDER_CLASS'
  /** Top / major radius (group 40). */
  majorRadius?: number
  /** Base radius (group 41). */
  minorRadius?: number
  /** Height (group 42). */
  height?: number
  /** Alternate top radius (group 43). */
  topMajorRadius?: number
}

/** DXF OBJECT entry `ACSH_CONE_CLASS` (AcDbShCone primitive). */
export interface AcshConeDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_CONE_CLASS'
  /** Top radius (group 40 under AcDbShCone). */
  topRadius?: number
  /** Base radius (group 41 under AcDbShCone). */
  baseRadius?: number
  /** Height (group 42). */
  height?: number
  /** Minor radius (group 43). */
  minorRadius?: number
  /** Major radius from shared cylinder fields (group 40 under AcDbShCylinder). */
  majorRadius?: number
  /** Top major radius from shared cylinder fields (group 43). */
  topMajorRadius?: number
}

/** DXF OBJECT entry `ACSH_WEDGE_CLASS` (AcDbShWedge primitive). */
export interface AcshWedgeDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_WEDGE_CLASS'
  /** Wedge length along local X (group 40). */
  length?: number
  /** Wedge width along local Y (group 41). */
  width?: number
  /** Wedge height along local Z (group 42). */
  height?: number
}

/** DXF OBJECT entry `ACSH_SWEEP_CLASS` (AcDbShSweep; ACIS payload only). */
export interface AcshSweepDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_SWEEP_CLASS'
}

/** DXF OBJECT entry `ACSH_BREP_CLASS` (AcDbShBrep; ACIS payload only). */
export interface AcshBrepDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_BREP_CLASS'
}

/** DXF OBJECT entry `ACSH_EXTRUSION_CLASS` (AcDbShExtrusion; ACIS payload only). */
export interface AcshExtrusionDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_EXTRUSION_CLASS'
}

/** DXF OBJECT entry `ACSH_BOOLEAN_CLASS` (AcDbShBoolean union/intersection node). */
export interface AcshBooleanDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_BOOLEAN_CLASS'
}

/** DXF OBJECT entry `ACSH_FILLET_CLASS` (AcDbShFillet primitive). */
export interface AcshFilletDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_FILLET_CLASS'
  /** Fillet radius (group 41). */
  radius?: number
}

/** DXF OBJECT entry `ACSH_REVOLVE_CLASS` (AcDbShRevolve; ACIS payload only). */
export interface AcshRevolveDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_REVOLVE_CLASS'
}

/** DXF OBJECT entry `ACSH_LOFT_CLASS` (AcDbShLoft; ACIS payload only). */
export interface AcshLoftDXFObject extends CommonDXFObject, AcshHistoryNodeFields {
  name: 'ACSH_LOFT_CLASS'
}

/** Union of parsed ACSH solid-history primitive OBJECT entries. */
export type AcshPrimitiveDXFObject =
  | import('../acshBox/types.ts').AcshBoxDXFObject
  | AcshCylinderDXFObject
  | AcshConeDXFObject
  | AcshWedgeDXFObject
  | AcshSweepDXFObject
  | AcshBrepDXFObject
  | AcshExtrusionDXFObject
  | AcshBooleanDXFObject
  | AcshFilletDXFObject
