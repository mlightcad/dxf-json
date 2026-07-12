import type { DXFParserSnippet } from '../shared/parserGenerator.ts'
import {
  appendAcisPayloadFragment,
  joinAcisPayloadLines,
} from '../acis/decrypt.ts'

/**
 * Collects DXF group codes 1/3 for ACIS-backed entities (3DSOLID/REGION/BODY).
 *
 * Group 1 starts a SAT line; group 3 continues the previous line (255-char
 * splits). Each logical line is decrypted before lines are joined with `\n`.
 *
 * @param fieldName Entity property that receives the joined SAT string (e.g. `"data"`).
 */
export function createAcisPayloadSnippet(fieldName: string): DXFParserSnippet[] {
  return [
    {
      code: 3,
      name: fieldName,
      parser(curr, _, entity) {
        const lines =
          entity._acisPayloadLines ??
          (entity._acisPayloadLines = [] as string[])
        appendAcisPayloadFragment(lines, 3, String(curr.value))
        entity[fieldName] = joinAcisPayloadLines(lines)
        return entity[fieldName]
      },
      isMultiple: true,
      isReducible: true,
    },
    {
      code: 1,
      name: fieldName,
      parser(curr, _, entity) {
        const lines =
          entity._acisPayloadLines ??
          (entity._acisPayloadLines = [] as string[])
        appendAcisPayloadFragment(lines, 1, String(curr.value))
        entity[fieldName] = joinAcisPayloadLines(lines)
        return entity[fieldName]
      },
      isMultiple: true,
      isReducible: true,
    },
  ]
}
