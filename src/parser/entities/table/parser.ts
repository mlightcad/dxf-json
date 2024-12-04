import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts';
import {
  createParser,
  DXFParserSnippet,
  Identity,
  PointParser,
} from '../../shared/parserGenerator.ts';
import { CommonEntitySnippets } from '../shared.ts';
import { ensurePoint3D } from '../../../utlis.ts';
import type { TableEntity, TableCell } from './types.ts';

const DefaultTableEntity = {
  rowHeightArr: [],
  columnWidthArr: [],
  cells: [],
  bmpPreview: '',
};

const TableEntityParserSnippets: DXFParserSnippet[] = [
  {
    code: 310,
    name: 'bmpPreview',
    isMultiple: true,
    parser: (curr: ScannerGroup, scanner: DxfArrayScanner, entity: any) => {
      // 累积二进制数据
      entity.bmpPreview = (entity.bmpPreview ?? '') + curr.value;
      // 继续解析，直到遇到非310代码
      let next = scanner.next();
      while (next.code === 310 && !scanner.isEOF()) {
        entity.bmpPreview += next.value;
        next = scanner.next();
      }
      // 回退一个位置，让解析器处理下一个非310代码
      scanner.rewind();
      return entity.bmpPreview;
    },
  },
  {
    code: 91,
    name: 'rowCount',
    isMultiple: true,
    parser: Identity,
  },
  {
    code: 92,
    name: 'columnCount',
    isMultiple: true,
    parser: Identity,
  },
  {
    code: 171,
    name: 'cells',
    isMultiple: true,
    parser: (curr: ScannerGroup, scanner: DxfArrayScanner, entity: any) => {
      entity.cells ??= [];
      entity.cells.push(parserTableCell(scanner, curr));
      return entity.cells;
    },
  },
  {
    code: 141,
    name: 'rowHeightArr',
    isMultiple: true,
    parser: (curr: ScannerGroup, _: any, entity: any) => {
      entity.rowHeightArr ??= [];
      entity.rowHeightArr.push(curr.value);
      return entity.rowHeightArr;
    },
  },
  {
    code: 142,
    name: 'columnWidthArr',
    isMultiple: true,
    parser: (curr: ScannerGroup, _: any, entity: any) => {
      entity.columnWidthArr ??= [];
      entity.columnWidthArr.push(curr.value);
      return entity.columnWidthArr;
    },
  },
  {
    code: 90,
    name: 'tableValue',
    parser: Identity,
  },
  {
    code: 91,
    name: 'rowCount',
    parser: Identity,
  },
  {
    code: 92,
    name: 'columnCount',
    parser: Identity,
  },
  {
    code: 93,
    name: 'overrideFlag',
    parser: Identity,
  },
  {
    code: 94,
    name: 'borderColorOverrideFlag',
    parser: Identity,
  },
  {
    code: 95,
    name: 'borderLineWeightOverrideFlag',
    parser: Identity,
  },
  {
    code: 96,
    name: 'borderVisibilityOverrideFlag',
    parser: Identity,
  },
  {
    code: 280,
    name: 'version',
    parser: Identity,
  },
  {
    code: 170,
    name: 'attachmentPoint',
    parser: Identity,
  },
  {
    code: 330,
    name: 'ownerDictionaryId',
    parser: Identity,
  },
  {
    code: 342,
    name: 'tableStyleId',
    parser: Identity,
  },
  {
    code: 343,
    name: 'blockRecordHandle',
    parser: Identity,
  },
  {
    code: 2,
    name: 'name',
    parser: Identity,
  },
  {
    code: 10,
    name: 'startPoint',
    parser: (curr: ScannerGroup, scanner: DxfArrayScanner) => ensurePoint3D(PointParser(curr, scanner)),
  },
  {
    code: 11,
    name: 'directionVector',
    parser: (curr: ScannerGroup, scanner: DxfArrayScanner) => ensurePoint3D(PointParser(curr, scanner)),
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonEntitySnippets,
];

export class TableEntityParser {
  static ForEntityName = 'ACAD_TABLE';

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity: TableEntity = {
      type: 'ACAD_TABLE',
      handle: '',
      layer: '0',
      subclassMarker: 'AcDbTable',
      name: '',
      startPoint: { x: 0, y: 0, z: 0 },
      directionVector: { x: 0, y: 0, z: 0 },
      tableValue: 0,
      rowCount: 0,
      columnCount: 0,
      overrideFlag: 0,
      borderColorOverrideFlag: 0,
      borderLineWeightOverrideFlag: 0,
      borderVisibilityOverrideFlag: 0,
      rowHeightArr: [],
      columnWidthArr: [],
      version: 0,
      bmpPreview: '',
      ownerDictionaryId: '',
      tableStyleId: '',
      blockRecordHandle: '',
      attachmentPoint: 1, // TopLeft
      cells: [],
    };

    // 解析表格实体的所有属性
    while (!scanner.isEOF()) {
      if (curr.code === 0) {
        // 遇到新的实体，停止解析
        scanner.rewind();
        break;
      }

      switch (curr.code) {
        case 5:
          entity.handle = curr.value as string;
          break;
        case 8:
          entity.layer = curr.value as string;
          break;
        case 2:
          entity.name = curr.value as string;
          break;
        case 10:
          // 解析起点
          entity.startPoint = ensurePoint3D(PointParser(curr, scanner));
          break;
        case 11:
          // 解析方向向量
          entity.directionVector = ensurePoint3D(PointParser(curr, scanner));
          break;
        case 90:
          entity.tableValue = curr.value as number;
          break;
        case 91:
          entity.rowCount = curr.value as number;
          break;
        case 92:
          entity.columnCount = curr.value as number;
          break;
        case 93:
          entity.overrideFlag = curr.value as number;
          break;
        case 94:
          entity.borderColorOverrideFlag = curr.value as number;
          break;
        case 95:
          entity.borderLineWeightOverrideFlag = curr.value as number;
          break;
        case 96:
          entity.borderVisibilityOverrideFlag = curr.value as number;
          break;
        case 141:
          entity.rowHeightArr.push(curr.value as number);
          break;
        case 142:
          entity.columnWidthArr.push(curr.value as number);
          break;
        case 280:
          entity.version = curr.value as number;
          break;
        case 310:
          // 处理二进制数据
          let bmpPreview = curr.value as string;
          let next = scanner.next();
          while (next.code === 310 && !scanner.isEOF()) {
            bmpPreview += next.value;
            next = scanner.next();
          }
          entity.bmpPreview = bmpPreview;
          scanner.rewind();
          break;
        case 330:
          entity.ownerDictionaryId = curr.value as string;
          break;
        case 342:
          entity.tableStyleId = curr.value as string;
          break;
        case 343:
          entity.blockRecordHandle = curr.value as string;
          break;
        case 170:
          entity.attachmentPoint = curr.value as number;
          break;
        case 171:
          // 解析单元格
          entity.cells.push(parserTableCell(scanner, curr));
          break;
        default:
          // 跳过未知代码
          break;
      }

      // 移动到下一个代码
      curr = scanner.next();
    }

    return entity;
  }
}

function parserTableCell(scanner: DxfArrayScanner, curr: ScannerGroup): TableCell {
  let cellIsStarted = false;
  let cellIsFinished = false;

  const cell: TableCell = {
    text: '',
    attachmentPoint: 1, // TopLeft
    cellType: 0,
    topBorderVisibility: true,
    bottomBorderVisibility: true,
    leftBorderVisibility: true,
    rightBorderVisibility: true,
    textHeight: 0,
  };
  
  while (!scanner.isEOF()) {
    if (curr.code === 0 || cellIsFinished) {
      break;
    }
    switch (curr.code) {
      case 171:
        if (cellIsStarted) {
          cellIsFinished = true;
          curr = scanner.next();
          continue;
        }
        cell.cellType = curr.value as number;
        cellIsStarted = true;
        curr = scanner.next();
        break;
      case 172:
        cell.flagValue = curr.value as number;
        curr = scanner.next();
        break;
      case 173:
        cell.mergedValue = curr.value as number;
        curr = scanner.next();
        break;
      case 174:
        cell.autoFit = curr.value as number;
        curr = scanner.next();
        break;
      case 175:
        cell.borderWidth = curr.value as number;
        curr = scanner.next();
        break;
      case 176:
        cell.borderHeight = curr.value as number;
        curr = scanner.next();
        break;
      case 91:
        cell.overrideFlag = curr.value as number;
        curr = scanner.next();
        break;
      case 178:
        cell.virtualEdgeFlag = curr.value as number;
        curr = scanner.next();
        break;
      case 145:
        cell.rotation = curr.value as number;
        curr = scanner.next();
        break;
      case 345:
        cell.fieldObjetId = curr.value as string;
        curr = scanner.next();
        break;
      case 340:
        cell.blockTableRecordId = curr.value as string;
        curr = scanner.next();
        break;
      case 146:
        cell.blockScale = curr.value as number;
        curr = scanner.next();
        break;
      case 177:
        cell.blockAttrNum = curr.value as number;
        curr = scanner.next();
        break;
      case 7:
        cell.textStyle = curr.value as string;
        curr = scanner.next();
        break;
      case 140:
        cell.textHeight = curr.value as number;
        curr = scanner.next();
        break;
      case 170:
        cell.attachmentPoint = curr.value as number;
        curr = scanner.next();
        break;
      case 92:
        cell.extendedCellFlags = curr.value as number;
        curr = scanner.next();
        break;
      case 285:
        cell.rightBorderVisibility = !!(curr.value ?? true);
        curr = scanner.next();
        break;
      case 286:
        cell.bottomBorderVisibility = !!(curr.value ?? true);
        curr = scanner.next();
        break;
      case 288:
        cell.leftBorderVisibility = !!(curr.value ?? true);
        curr = scanner.next();
        break;
      case 289:
        cell.topBorderVisibility = !!(curr.value ?? true);
        curr = scanner.next();
        break;
      case 301:
        parserCellValue(cell, scanner, curr);
        curr = scanner.next();
        break;
      default:
        curr = scanner.next();
        break;
    }
  }

  return cell;
}

function parserCellValue(cell: TableCell, scanner: DxfArrayScanner, curr: ScannerGroup) {
  while (curr.code !== 304 && !scanner.isEOF()) {
    switch (curr.code) {
      case 301:
        curr = scanner.next();
        break;
      case 93:
        curr = scanner.next();
        break;
      case 90:
        curr = scanner.next();
        break;
      case 1:
        cell.text = curr.value as string;
        curr = scanner.next();
        break;
      case 94:
        curr = scanner.next();
        break;
      case 300:
        cell.attrText = curr.value as string;
        curr = scanner.next();
        break;
      case 302:
        cell.text = curr.value ? (curr.value as string) : cell.text;
        curr = scanner.next();
        break;
      default:
        console.log(`Ignore code: ${curr.code}, value: ${curr.value}`);
        curr = scanner.next();
        break;
    }
  }
  return;
}
