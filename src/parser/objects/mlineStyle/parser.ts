import type { DXFParserSnippet } from '../../shared/parserGenerator.ts'
import { Identity } from '../../shared/parserGenerator.ts'
import { CommonObjectSnippets } from '../shared.ts'
import type { MLineStyleDXFObject } from './types.ts'
import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'

function parseMLineStyleColor(
  { value }: ScannerGroup,
  _: DxfArrayScanner,
  object: Partial<MLineStyleDXFObject>,
) {
  const hasElementSection =
    object.elementCount !== undefined ||
    !!object.elementOffsets?.length ||
    !!object.elementColors?.length ||
    !!object.elementLineTypes?.length

  // DXF group code 62 is overloaded in MLINESTYLE:
  // first usage is fillColor, repeated usages are elementColors.
  if (!hasElementSection && object.fillColor === undefined) {
    object.fillColor = value
    return
  }

  if (!object.elementColors) {
    object.elementColors = []
  }
  object.elementColors.push(value)
}

export const MLineStyleSnippets: DXFParserSnippet[] = [
  {
    code: 6,
    name: 'elementLineTypes',
    parser: Identity,
    isMultiple: true,
  },
  {
    code: 62,
    parser: parseMLineStyleColor,
    isMultiple: true,
  },
  {
    code: 49,
    name: 'elementOffsets',
    parser: Identity,
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
