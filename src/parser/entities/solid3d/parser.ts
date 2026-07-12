import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
} from '../../shared/parserGenerator.ts'
import { CommonEntitySnippets } from '../shared.ts'
import { createAcisPayloadSnippet } from '../acisPayload.ts'
import type { Solid3DEntity } from './types.ts'

const SolidEntityParserSnippets: DXFParserSnippet[] = [
  {
    code: 350,
    name: 'historyObjectSoftId',
    parser: Identity,
  },
  {
    code: 100, // AcDb3dSolid
    name: 'subclassMarker',
    parser: Identity,
  },
  {
    code: 2,
    name: 'guid',
    parser: Identity,
  },
  {
    code: 290,
    name: 'satCache',
    parser: Identity,
  },
  ...createAcisPayloadSnippet('data'),
  {
    code: 70,
    name: 'version',
    parser: Identity,
  },
  {
    code: 100, // AcDbModelerGeometry
  },
  ...CommonEntitySnippets,
]

export class Solid3DEntityParser {
  static ForEntityName = '3DSOLID'
  private parser = createParser(SolidEntityParserSnippets)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity as Solid3DEntity
  }
}
