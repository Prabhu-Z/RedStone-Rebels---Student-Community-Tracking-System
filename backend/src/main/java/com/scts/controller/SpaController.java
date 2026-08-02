package com.scts.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class SpaController {

    @GetMapping(value = {
        "/{path:(?!api|h2-console|uploads|assets|favicon\\.ico).*}",
        "/{path1:(?!api|h2-console|uploads|assets).*}/{path2:.*}"
    })
    public String forwardToSpa() {
        return "forward:/index.html";
    }
}
