import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
} from '../../shared/parserGenerator.ts'
import { CommonEntitySnippets } from '../shared.ts'
import { createAcisPayloadSnippet } from '../acisPayload.ts'
import type { BodyEntity } from './types.ts'

const BodyEntityParserSnippets: DXFParserSnippet[] = [
  ...createAcisPayloadSnippet('data'),
  {
    code: 70,
    name: 'version',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonEntitySnippets,
]

export class BodyEntityParser {
  static ForEntityName = 'BODY'
  private parser = createParser(BodyEntityParserSnippets)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity as BodyEntity
  }
}
