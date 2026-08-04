package com.scts.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController implements ErrorController {

    @RequestMapping(value = {
        "/",
        "/{path:^(?!api|h2-console|uploads|assets|favicon\\.ico).*}",
        "/{path1:^(?!api|h2-console|uploads|assets).*}/{path2:.*}",
        "/error"
    })
    public String redirect(HttpServletRequest request) {
        String uri = request.getRequestURI();
        // If request is for an API endpoint or static upload/asset file, let backend return error
        if (uri.startsWith("/api") || uri.startsWith("/h2-console") || uri.startsWith("/uploads") || uri.startsWith("/assets")) {
            return "forward:/error";
        }
        // For all React SPA routes, forward to index.html
        return "forward:/index.html";
    }
}
