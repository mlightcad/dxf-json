import {
    DXFParserSnippet,
    Identity,
} from '../shared/parserGenerator';
import { isMatched } from '../shared';

export const CommonTableEntryParserSnippets: DXFParserSnippet[] = [
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
        // Many table records include multiple subclass markers (e.g. AcDbObject,
        // AcDbSymbolTableRecord, AcDbViewportTableRecord). Allow repeated 100s
        // and keep the last one.
        isMultiple: true,
        isReducible: true,
    },
    {
        code: 330,
        name: 'ownerObjectId',
        parser: Identity,
    },
    {
        code: 102,
        parser(curr, scanner) {
            while (!isMatched(curr, 0, 'EOF') && !isMatched(curr, 102, '}')) {
                curr = scanner.next();
            }
        },
    },
    {
        // DIMSTYLE만 예외적으로 미적용
        code: 5,
        name: 'handle',
        parser: Identity,
    },
];
