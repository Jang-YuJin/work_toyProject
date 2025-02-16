package com.mini.project.work.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mini.project.utils.Excel;
import com.mini.project.work.dto.OverTimeDto;
import com.mini.project.work.dto.OverTimeExcelDto;
import com.mini.project.work.service.WorkService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class WorkController {
    private final WorkService service;

    @GetMapping("/work")
    public Page<OverTimeDto> findOverWork(@RequestParam String year, @RequestParam String month, @PageableDefault(page = 0, size = 10) Pageable pageable) throws IOException {
        return service.findOverWork(year, month, pageable);
    }

    @GetMapping("/work/exceldownload")
    public void exceldownload(@RequestParam String year, @RequestParam String month, HttpServletResponse res) throws IOException {
        System.out.println(year);
        System.out.println(month);

        List<OverTimeExcelDto> list = service.findOverWorkExcel(year, month);

        String[] header = {"이름", "팀 이름", "초과근무(분)", "근무시간(분)"};
        String[] realHead = {"employeeName", "teamName", "overTimeMin", "workMin"};

        new Excel(header, realHead, convertVOListToMapList(list), res);
    }

    public List<Map<String, Object>> convertVOListToMapList(List<? extends Object> voList) {
        List<Map<String, Object>> mapList = new ArrayList<>();
        for (Object vo : voList) {
            Map<String, Object> map = new HashMap<>();
            Field[] fields = vo.getClass().getDeclaredFields();
            for (Field field : fields) {
                field.setAccessible(true);
                try {
                    map.put(field.getName(), field.get(vo));
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
            mapList.add(map);
        }
        return mapList;
    }
}
