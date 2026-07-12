import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { parseAcadEvalGraphObject } from '../acadEvalGraph/parser.ts'
import { parseAcshHistoryObject } from '../acshHistory/parser.ts'
import { parseAcshHistoryNodeObject } from '../acshShared.ts'
import type { AcshBoxDXFObject } from '../acshBox/types.ts'
import type {
  AcshBooleanDXFObject,
  AcshBrepDXFObject,
  AcshConeDXFObject,
  AcshCylinderDXFObject,
  AcshExtrusionDXFObject,
  AcshFilletDXFObject,
  AcshRevolveDXFObject,
  AcshLoftDXFObject,
  AcshSweepDXFObject,
  AcshWedgeDXFObject,
} from './types.ts'
import type { CommonDXFObject, DxfObjectByHandle } from '../types.ts'

/**
 * Builds a handle lookup map from {@link parseObjects}'s `byName` index.
 * Handles are normalized to uppercase hexadecimal strings.
 */
export function buildObjectByHandle(
  byName: Record<string, CommonDXFObject[]>,
): DxfObjectByHandle {
  const byHandle: DxfObjectByHandle = {}
  for (const objects of Object.values(byName)) {
    for (const object of objects) {
      if (object.handle) {
        byHandle[String(object.handle).toUpperCase()] = object
      }
    }
  }
  return byHandle
}

function parseBoxPrimitive(code: number, value: number, object: AcshBoxDXFObject) {
  if (code === 40) object.length = value
  else if (code === 41) object.width = value
  else if (code === 42) object.height = value
}

function parseCylinderFields(
  code: number,
  value: number,
  object: AcshCylinderDXFObject | AcshConeDXFObject,
) {
  if (code === 40) object.majorRadius = value
  else if (code === 41) object.minorRadius = value
  else if (code === 42) object.height = value
  else if (code === 43) object.topMajorRadius = value
}

function parseCylinderPrimitive(
  code: number,
  value: number,
  object: AcshCylinderDXFObject,
) {
  parseCylinderFields(code, value, object)
}

function parseConePrimitive(code: number, value: number, object: AcshConeDXFObject) {
  if (code === 40) object.topRadius = value
  else if (code === 41) object.baseRadius = value
  else if (code === 42) object.height = value
  else if (code === 43) object.minorRadius = value
}

function parseWedgePrimitive(code: number, value: number, object: AcshWedgeDXFObject) {
  if (code === 40) object.length = value
  else if (code === 41) object.width = value
  else if (code === 42) object.height = value
}

function parseFilletPrimitive(code: number, value: number, object: AcshFilletDXFObject) {
  if (code === 41) object.radius = value
}

/** Parses an `ACSH_BOX_CLASS` object. */
export function parseAcshBoxObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshBoxDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_BOX_CLASS', handle: '', ownerObjectId: '0' }),
    parseBoxPrimitive,
  )
}

/** Parses an `ACSH_CYLINDER_CLASS` object. */
export function parseAcshCylinderObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshCylinderDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_CYLINDER_CLASS', handle: '', ownerObjectId: '0' }),
    parseCylinderPrimitive,
  )
}

/** Parses an `ACSH_CONE_CLASS` object. */
export function parseAcshConeObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshConeDXFObject {
  let conePhase = false
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_CONE_CLASS', handle: '', ownerObjectId: '0' }),
    (code, value, object) => {
      if (conePhase) {
        parseConePrimitive(code, value, object)
      } else {
        parseCylinderFields(code, value, object)
      }
    },
    false,
    subclass => {
      if (subclass === 'AcDbShCone') {
        conePhase = true
      }
    },
  )
}

/** Parses an `ACSH_WEDGE_CLASS` object. */
export function parseAcshWedgeObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshWedgeDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_WEDGE_CLASS', handle: '', ownerObjectId: '0' }),
    parseWedgePrimitive,
  )
}

/** Parses an `ACSH_SWEEP_CLASS` object. */
export function parseAcshSweepObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshSweepDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_SWEEP_CLASS', handle: '', ownerObjectId: '0' }),
    undefined,
    true,
  )
}

/** Parses an `ACSH_BREP_CLASS` object. */
export function parseAcshBrepObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshBrepDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_BREP_CLASS', handle: '', ownerObjectId: '0' }),
    undefined,
    true,
  )
}

/** Parses an `ACSH_EXTRUSION_CLASS` object. */
export function parseAcshExtrusionObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshExtrusionDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_EXTRUSION_CLASS', handle: '', ownerObjectId: '0' }),
    undefined,
    true,
  )
}

/** Parses an `ACSH_BOOLEAN_CLASS` object. */
export function parseAcshBooleanObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshBooleanDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_BOOLEAN_CLASS', handle: '', ownerObjectId: '0' }),
  )
}

/** Parses an `ACSH_FILLET_CLASS` object. */
export function parseAcshFilletObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshFilletDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_FILLET_CLASS', handle: '', ownerObjectId: '0' }),
    parseFilletPrimitive,
  )
}

/** Parses an `ACSH_REVOLVE_CLASS` object. */
export function parseAcshRevolveObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshRevolveDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_REVOLVE_CLASS', handle: '', ownerObjectId: '0' }),
    undefined,
    true,
  )
}

/** Parses an `ACSH_LOFT_CLASS` object. */
export function parseAcshLoftObject(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): AcshLoftDXFObject {
  return parseAcshHistoryNodeObject(
    curr,
    scanner,
    () => ({ name: 'ACSH_LOFT_CLASS', handle: '', ownerObjectId: '0' }),
    undefined,
    true,
  )
}

/** OBJECT name → parser for ACSH solid-history related entries. */
export const AcshObjectParsers: Record<
  string,
  (curr: ScannerGroup, scanner: DxfArrayScanner) => CommonDXFObject
> = {
  ACSH_HISTORY_CLASS: parseAcshHistoryObject,
  ACAD_EVALUATION_GRAPH: parseAcadEvalGraphObject,
  ACSH_BOX_CLASS: parseAcshBoxObject,
  ACSH_CYLINDER_CLASS: parseAcshCylinderObject,
  ACSH_CONE_CLASS: parseAcshConeObject,
  ACSH_WEDGE_CLASS: parseAcshWedgeObject,
  ACSH_SWEEP_CLASS: parseAcshSweepObject,
  ACSH_BREP_CLASS: parseAcshBrepObject,
  ACSH_EXTRUSION_CLASS: parseAcshExtrusionObject,
  ACSH_BOOLEAN_CLASS: parseAcshBooleanObject,
  ACSH_FILLET_CLASS: parseAcshFilletObject,
  ACSH_REVOLVE_CLASS: parseAcshRevolveObject,
  ACSH_LOFT_CLASS: parseAcshLoftObject,
}
