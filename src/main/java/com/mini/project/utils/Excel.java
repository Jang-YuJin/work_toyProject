package com.mini.project.utils;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

public class Excel {
    private static final int ROW_START_INDEX = 0;

    private SXSSFWorkbook wb;
    private Sheet sheet;
    Cell cell;

    public Excel(String[] header, String[] realHeader, List<Map<String, Object>> data, HttpServletResponse res) throws IOException {
        this.wb = new SXSSFWorkbook();
        renderExcel(header, realHeader, data);

        res.setContentType("ms-vnd/excel");
        res.setHeader("Content-Disposition", "attachment;filename=example.xlsx");

        wb.write(res.getOutputStream());
        wb.close();
    }

    private void renderExcel(String[] header, String[] realHeader, List<Map<String, Object>> data) {
        sheet = wb.createSheet();

        renderHeader(sheet, header);
        renderBody(sheet, realHeader, data);
    }

    private void renderBody(Sheet sheet, String[] realHeader, List<Map<String, Object>> data) {
        CellStyle style = wb.createCellStyle();

        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setFillForegroundColor(HSSFColor.HSSFColorPredefined.WHITE.getIndex());

        for (int rowIndex = 0; rowIndex < data.size(); rowIndex++) {
            Row row = sheet.createRow(ROW_START_INDEX + 1 + rowIndex);
            Map<String, Object> rowData = data.get(rowIndex);

            for (int colIndex = 0; colIndex < realHeader.length; colIndex++) {
                Cell cell = row.createCell(colIndex);
                cell.setCellStyle(style);
                // null 체크 등 추가할 수도 있음
                Object value = rowData.get(realHeader[colIndex]);
                cell.setCellValue(value != null ? value.toString() : "");
            }
        }

    }

    private void renderHeader(Sheet sheet, String[] header) {
        CellStyle style = wb.createCellStyle();

        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);

        Row row = sheet.createRow(ROW_START_INDEX);
        for(int i = 0; i < header.length; i++) {
            cell = row.createCell(i);
            cell.setCellStyle(style);
            cell.setCellValue(header[i]);
        }
    }
}
