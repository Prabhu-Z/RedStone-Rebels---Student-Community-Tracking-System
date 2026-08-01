package com.scts.controller;

import com.scts.dto.CertificateDTO;
import com.scts.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    @Autowired
    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CertificateDTO>> getStudentCertificates(@PathVariable Long studentId) {
        return ResponseEntity.ok(certificateService.getStudentCertificates(studentId));
    }

    @PostMapping("/upload")
    public ResponseEntity<CertificateDTO> uploadCertificate(
            @RequestParam Long studentId,
            @RequestParam(required = false) Long eventId,
            @RequestParam String certificateType,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(certificateService.uploadCertificate(studentId, eventId, certificateType, file));
    }
}
