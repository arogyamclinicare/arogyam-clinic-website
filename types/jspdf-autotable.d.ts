// Type declarations for jspdf-autotable
declare module 'jspdf-autotable' {
  interface AutoTableColumn {
    header?: string;
    key?: string;
    dataKey?: string;
    width?: number;
    cellWidth?: number | 'auto' | 'wrap';
  }

  interface AutoTableOptions {
    head?: (string | number)[][];
    body?: (string | number)[][];
    columns?: AutoTableColumn[];
    startY?: number;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    pageBreak?: 'auto' | 'avoid' | 'always';
    theme?: 'striped' | 'grid' | 'plain';
    styles?: {
      fontSize?: number;
      font?: string;
      fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
      textColor?: number | [number, number, number];
      fillColor?: number | [number, number, number] | false;
      cellPadding?: number;
      lineColor?: number | [number, number, number];
      lineWidth?: number;
      cellWidth?: number | 'auto' | 'wrap';
      minCellHeight?: number;
      halign?: 'left' | 'center' | 'right';
      valign?: 'top' | 'middle' | 'bottom';
      overflow?: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
    };
    headStyles?: {
      fontSize?: number;
      font?: string;
      fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
      textColor?: number | [number, number, number];
      fillColor?: number | [number, number, number] | false;
      cellPadding?: number;
      lineColor?: number | [number, number, number];
      lineWidth?: number;
      cellWidth?: number | 'auto' | 'wrap';
      minCellHeight?: number;
      halign?: 'left' | 'center' | 'right';
      valign?: 'top' | 'middle' | 'bottom';
      overflow?: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
    };
    bodyStyles?: {
      fontSize?: number;
      font?: string;
      fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
      textColor?: number | [number, number, number];
      fillColor?: number | [number, number, number] | false;
      cellPadding?: number;
      lineColor?: number | [number, number, number];
      lineWidth?: number;
      cellWidth?: number | 'auto' | 'wrap';
      minCellHeight?: number;
      halign?: 'left' | 'center' | 'right';
      valign?: 'top' | 'middle' | 'bottom';
      overflow?: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
    };
    columnStyles?: {
      [key: number]: {
        fontSize?: number;
        font?: string;
        fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
        textColor?: number | [number, number, number];
        fillColor?: number | [number, number, number] | false;
        cellPadding?: number;
        lineColor?: number | [number, number, number];
        lineWidth?: number;
        cellWidth?: number | 'auto' | 'wrap';
        minCellHeight?: number;
        halign?: 'left' | 'center' | 'right';
        valign?: 'top' | 'middle' | 'bottom';
        overflow?: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
      };
    };
    tableWidth?: number | 'auto' | 'wrap';
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    didDrawPage?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    didParseCell?: (data: any) => void;
  }

  function autoTable(doc: any, options: AutoTableOptions): void;
  export default autoTable;
}