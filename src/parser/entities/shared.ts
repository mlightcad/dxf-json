import { parseExtensions } from '../shared/extensions/parser.ts'
import {
  type DXFParserSnippet,
  Identity,
  ToBoolean,
} from '../shared/parserGenerator.ts'
import { XDataParserSnippets } from '../shared/xdata/parser.ts'

export type { CommonDxfEntity } from './common.ts'
export { ShadowMode } from './common.ts'

// 이게 top에 와야함. 우선순위가 더 높다.
export const CommonEntitySnippets: DXFParserSnippet[] = [
  ...XDataParserSnippets,
  {
    code: 284,
    name: 'shadowMode',
    parser: Identity,
  },
  {
    code: 390,
    name: 'plotStyleHardId',
    parser: Identity,
  },
  {
    code: 380,
    name: 'plotStyleType',
    parser: Identity,
  },
  {
    code: 440,
    name: 'transparency',
    parser: Identity,
  },
  {
    code: 430,
    name: 'colorName',
    parser: Identity,
  },
  {
    code: 420,
    name: 'color',
    parser: Identity,
  },
  {
    code: 310,
    name: 'proxyEntity',
    isMultiple: true,
    isReducible: true,
    parser: (curr, _, entity) => (entity.proxyEntity ?? '') + curr.value,
  },
  {
    code: [92, 160],
    name: 'proxyByte',
    parser: Identity,
  },
  {
    code: 60,
    name: 'isVisible',
    parser: ToBoolean,
  },
  {
    code: 48,
    name: 'lineTypeScale',
    parser: Identity,
  },
  {
    code: 370,
    name: 'lineweight',
    parser: Identity,
  },
  {
    code: 62,
    name: 'colorIndex',
    parser: Identity,
  },
  {
    code: 347,
    name: 'materialObjectHardId',
    parser: Identity,
  },
  {
    code: 6,
    name: 'lineType',
    parser: Identity,
  },
  {
    code: 8,
    name: 'layer',
    parser: Identity,
  },
  {
    code: 410,
    name: 'layoutTabName',
    parser: Identity,
  },
  {
    code: 67,
    name: 'isInPaperSpace',
    parser: ToBoolean,
  },
  {
    code: 100, // AcDbEntity를 소모시키기 위함
  },
  {
    code: 330,
    name: 'ownerBlockRecordSoftId',
    parser: Identity,
  },
  {
    code: 102, // {ACAD_XDICTIONARY
    parser: parseExtensions,
  },
  {
    code: 102, // {ACAD_REACTORS
    parser: parseExtensions,
  },
  {
    code: 102, // {application_name
    parser: parseExtensions,
  },
  {
    code: 5,
    name: 'handle',
    parser: Identity,
  },
]

/**
 * This embeds the text separated in mulitple code 1 and code 3.
 * Note that this inject _code3text to ensure the order,
 * and this shouldn't be used for public.
 *
 * @internal
 */
export function createLongStringSnippet(fieldName: string): DXFParserSnippet[] {
  return [
    {
      code: 3,
      name: fieldName,
      parser(curr, _, entity) {
        entity._code3text = (entity._code3text ?? '') + curr.value
        return entity._code3text + (entity._code1text ?? '')
      },
      isMultiple: true,
      isReducible: true,
    },
    {
      code: 1,
      name: fieldName,
      parser(curr, _, entity) {
        entity._code1text = curr.value
        return (entity._code3text ?? '') + entity._code1text
      },
    },
  ]
}
