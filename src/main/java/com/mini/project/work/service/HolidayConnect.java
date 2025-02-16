package com.mini.project.work.service;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;

@RequiredArgsConstructor
public class HolidayConnect {
    private final RestTemplate restTemplate;

    String key = "qw44vTsBFKL6OpXTgZGedqoMVCS4Llze2eikoWugv9VkYlvyRJtGpSAxNDKYFlDvTt08EbhTtwFYtswOoMvW3w==";

    public JSONObject connect(String year, String month) throws IOException {
        URI uri = UriComponentsBuilder
                .fromUriString("http://apis.data.go.kr")
                .path("/B090041/openapi/service/SpcdeInfoService/getRestDeInfo")
                .queryParam("serviceKey", key)
                .queryParam("solYear", year)
                .queryParam("solMonth", month)
                .encode()
                .build()
                .toUri();

        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
        String body = response.getBody();
        JSONObject json = new JSONObject(body);

        return json.getJSONObject("response").getJSONObject("body").get("items").toString().isEmpty() ? null : json.getJSONObject("response").getJSONObject("body").getJSONObject("items");
    }
}
