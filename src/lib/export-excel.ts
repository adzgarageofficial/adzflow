// SpreadsheetML (Excel 2003 XML) export — opens natively in Excel, no library needed.

type CellValue = string | number | null | undefined;

interface SheetOptions {
  headers?: boolean; // if true, first row is bolded as header
  currency?: number[]; // 0-based column indices to format as Philippine Peso
  filename?: string;
}

function escapeXml(v: CellValue): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cellXml(value: CellValue, rowIdx: number, colIdx: number, opts: SheetOptions): string {
  const isHeader = opts.headers && rowIdx === 0;
  const isCurrency = opts.currency?.includes(colIdx);
  const isNum = typeof value === "number" && !isHeader;

  const styleId = isHeader ? ` ss:StyleID="h"` : isCurrency && isNum ? ` ss:StyleID="p"` : isNum ? ` ss:StyleID="n"` : "";
  const type = isNum ? "Number" : "String";
  return `<Cell${styleId}><Data ss:Type="${type}">${isNum ? (value as number) : escapeXml(value)}</Data></Cell>`;
}

export function downloadExcel(filename: string, sheetName: string, rows: CellValue[][], opts: SheetOptions = {}) {
  const xmlRows = rows
    .map((row, rIdx) =>
      `<Row>${row.map((cell, cIdx) => cellXml(cell, rIdx, cIdx, opts)).join("")}</Row>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:x="urn:schemas-microsoft-com:office:excel">
  <Styles>
    <Style ss:ID="h">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#F3F4F6" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="n">
      <NumberFormat ss:Format="0.00"/>
    </Style>
    <Style ss:ID="p">
      <NumberFormat ss:Format="&quot;₱&quot;#,##0.00"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${escapeXml(sheetName)}">
    <Table>
${xmlRows}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}
