import type { DXFParserSnippet } from '../../shared/parserGenerator.ts'
import { Identity } from '../../shared/parserGenerator.ts'
import { CommonObjectSnippets } from '../shared.ts'
import type { MLineStyleDXFObject, MLineStyleElement } from './types.ts'
import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { canMergeColor, parseColor } from '../../shared/parseColor.ts'
import type { DxfColor } from '../../../types/color.ts'

const MLINE_STYLE_COLOR_CODES = [62, 420, 430]

/**
 * Assign a parsed element-level field into `object.elements`.
 *
 * MLINESTYLE stores per-element data as repeated scalar group codes
 * (49/62/420/6) instead of explicit element blocks. This helper
 * reconstructs element objects by filling the first element that does
 * not yet have the target field, then creating a new element when all
 * existing ones already contain that field.
 *
 * Example parse order:
 * - offset(49), offset(49), color(420), color(420)
 * - becomes:
 *   [{ offset: ... , color: ... }, { offset: ... , color: ... }]
 */
function assignElementField<K extends keyof MLineStyleElement>(
  object: Partial<MLineStyleDXFObject>,
  field: K,
  value: NonNullable<MLineStyleElement[K]>,
  canMerge?: (value: MLineStyleElement[K] | undefined) => boolean,
  merge?: (value: MLineStyleElement[K] | undefined) => MLineStyleElement[K],
): MLineStyleElement {
  if (!object.elements) {
    object.elements = []
  }

  const target = object.elements.find((element) =>
    canMerge ? canMerge(element[field]) : element[field] === undefined,
  )
  if (target) {
    target[field] = merge ? merge(target[field]) : value
    return target
  }

  const element = {
    [field]: merge ? merge(undefined) : value,
  } as MLineStyleElement
  object.elements.push(element)
  return element
}

/**
 * Parse group code 6 (element line type name).
 *
 * This value belongs to an MLINESTYLE element definition, not the style
 * root object, so it is merged into `object.elements`.
 */
function parseMLineStyleLineType(
  { value }: ScannerGroup,
  _: DxfArrayScanner,
  object: Partial<MLineStyleDXFObject>,
) {
  assignElementField(object, 'lineType', value)
}

/**
 * Parse group code 49 (element offset).
 *
 * Offsets are per-element distances from the MLINE centerline and are
 * stored alongside the matching color/linetype fields in `elements`.
 */
function parseMLineStyleOffset(
  { value }: ScannerGroup,
  _: DxfArrayScanner,
  object: Partial<MLineStyleDXFObject>,
) {
  assignElementField(object, 'offset', value)
}

/**
 * Parse group code 62 (ACI color index).
 *
 * In MLINESTYLE, code 62 is overloaded:
 * - first occurrence before any element data => style `fillColor`
 * - subsequent occurrences => element `color`
 *
 * We decide by checking whether fill color has been assigned and whether
 * any element parsing has started.
 */
function parseMLineStyleColorGroup(
  curr: ScannerGroup,
  _: DxfArrayScanner,
  object: Partial<MLineStyleDXFObject>,
) {
  if (!object.elements?.length && canMergeColor(curr, object.fillColor)) {
    object.fillColor = parseColor(curr, object.fillColor)
    return
  }

  assignElementField(
    object,
    'color',
    parseColor(curr) as DxfColor,
    (color) => canMergeColor(curr, color),
    (color) => parseColor(curr, color) as DxfColor,
  )
}

/**
 * Parser snippets for the AcDbMlineStyle object.
 *
 * Repeated element-related group codes are marked `isMultiple: true`
 * so the parser invokes the handlers for every occurrence and allows us
 * to rebuild the full `elements` array.
 */
export const MLineStyleSnippets: DXFParserSnippet[] = [
  {
    code: 6,
    parser: parseMLineStyleLineType,
    isMultiple: true,
  },
  {
    code: MLINE_STYLE_COLOR_CODES,
    parser: parseMLineStyleColorGroup,
    isMultiple: true,
  },
  {
    code: 49,
    parser: parseMLineStyleOffset,
    isMultiple: true,
  },
  {
    code: 71,
    name: 'elementCount',
    parser: Identity,
  },
  {
    code: 52,
    name: 'endAngle',
    parser: Identity,
  },
  {
    code: 51,
    name: 'startAngle',
    parser: Identity,
  },
  {
    code: 3,
    name: 'description',
    parser: Identity,
  },
  {
    code: 70,
    name: 'flags',
    parser: Identity,
  },
  {
    code: 2,
    name: 'styleName',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonObjectSnippets,
]
