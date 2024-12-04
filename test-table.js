import { DxfParser } from './dist/esm/bundle.mjs';
import fs from 'fs';

// 读取DXF文件
const dxfPath = '/Users/leaf/Downloads/FJP-898E-G-钉柱-V01+1.dxf';
const dxfContent = fs.readFileSync(dxfPath, 'utf8');

// 解析DXF文件
const parser = new DxfParser();
try {
  const result = parser.parseSync(dxfContent);
  console.log('解析成功！');
  
  // 查找表格实体
  const tables = result.entities.filter(entity => entity.type === 'ACAD_TABLE');
  console.log(`找到 ${tables.length} 个表格实体`);
  
  // 输出表格信息
  tables.forEach((table, index) => {
    console.log(`\n表格 ${index + 1}:`);
    console.log(`  类型: ${table.type}`);
    console.log(`  名称: ${table.name}`);
    console.log(`  行数: ${table.rowCount}`);
    console.log(`  列数: ${table.columnCount}`);
    console.log(`  行高数组: ${table.rowHeightArr}`);
    console.log(`  列宽数组: ${table.columnWidthArr}`);
    console.log(`  单元格数量: ${table.cells.length}`);
    
    // 输出前几个单元格的信息
    if (table.cells.length > 0) {
      console.log('  前3个单元格:');
      table.cells.slice(0, 3).forEach((cell, cellIndex) => {
        console.log(`    单元格 ${cellIndex + 1}:`);
        console.log(`      文本: ${cell.text}`);
        console.log(`      单元格类型: ${cell.cellType}`);
        console.log(`      附着点: ${cell.attachmentPoint}`);
      });
    }
  });
} catch (error) {
  console.error('解析失败:', error);
}