package com.scts.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SpaController {

    @GetMapping(value = {
        "/",
        "/{path:^(?!api|h2-console|uploads|assets|favicon\\.ico).*}",
        "/{path1:^(?!api|h2-console|uploads|assets).*}/{path2:.*}",
        "/{path1:^(?!api|h2-console|uploads|assets).*}/{path2:.*}/{path3:.*}"
    }, produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<Resource> serveSpa() {
        Resource resource = new ClassPathResource("static/index.html");
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(resource);
    }
}
