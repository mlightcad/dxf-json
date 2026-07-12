import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import { createParser, DXFParserSnippet } from '../shared/parserGenerator.ts'
import { classify } from '../../utlis.ts'
import { AcshObjectParsers, buildObjectByHandle } from './acshPrimitives/parser.ts'
import { DimAssocSnippets } from './dimassoc/parser.ts'
import { DictionarySnippets } from './dictionary/parser.ts'
import { GroupSnippets } from './group/parser.ts'
import { ImageDefSnippets } from './imageDef/parser.ts'
import { LayerFilterSnippets } from './layer_filter/parser.ts'
import { LayerIndexSnippets } from './layer_index/parser.ts'
import { LayoutSnippets } from './layout/parser.ts'
import { MLeaderStyleSnippets } from './mleaderStyle/parser.ts'
import { MLineStyleSnippets } from './mlineStyle/parser.ts'
import { PlotSettingsSnippets } from './plotSettings/parser.ts'
import { SpatialFilterSnippets } from './spatial_filter/parser.ts'
import { skipUnknownDxfObject } from './skipUnknownDxfObject.ts'
import type { CommonDXFObject } from './types.ts'

export { buildObjectByHandle }

const ObjectSchemas: Record<string, DXFParserSnippet[]> = {
  LAYOUT: LayoutSnippets,
  PLOTSETTINGS: PlotSettingsSnippets,
  DICTIONARY: DictionarySnippets,
  SPATIAL_FILTER: SpatialFilterSnippets,
  IMAGEDEF: ImageDefSnippets,
  MLEADERSTYLE: MLeaderStyleSnippets,
  MLINESTYLE: MLineStyleSnippets,
  GROUP: GroupSnippets,
  LAYER_FILTER: LayerFilterSnippets,
  LAYER_INDEX: LayerIndexSnippets,
  DIMASSOC: DimAssocSnippets,
}

export function parseObjects(curr: ScannerGroup, scanner: DxfArrayScanner) {
  const result = [] as CommonDXFObject[]

  while (curr.code !== 0 || !['EOF', 'ENDSEC'].includes(String(curr.value))) {
    const objectName = String(curr.value)
    const snippets = ObjectSchemas[objectName]
    const acshParser = AcshObjectParsers[objectName]

    if (curr.code === 0 && acshParser) {
      result.push(acshParser(curr, scanner))
      curr = scanner.lastReadGroup
    } else if (curr.code === 0 && snippets?.length) {
      const parser = createParser(snippets)
      const parsedObject = { name: objectName } as CommonDXFObject

      curr = scanner.next()

      if (parser(curr, scanner, parsedObject)) {
        result.push(parsedObject)
        curr = scanner.peek()
      } else {
        curr = scanner.next()
      }
    } else if (curr.code === 0) {
      curr = skipUnknownDxfObject(curr, scanner)
    } else {
      curr = scanner.next()
    }
  }

  const byName = classify(result, ({ name }) => name)
  return {
    byName,
    byHandle: buildObjectByHandle(byName),
  }
}
