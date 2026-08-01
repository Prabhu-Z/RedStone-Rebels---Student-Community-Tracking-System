package com.scts.service;

import com.scts.dto.CertificateDTO;
import com.scts.entity.Certificate;
import com.scts.entity.Event;
import com.scts.entity.Student;
import com.scts.exception.ResourceNotFoundException;
import com.scts.repository.CertificateRepository;
import com.scts.repository.EventRepository;
import com.scts.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;

    @Value("${file.upload-dir:uploads/certificates}")
    private String uploadDir;

    @Autowired
    public CertificateService(CertificateRepository certificateRepository, StudentRepository studentRepository, EventRepository eventRepository) {
        this.certificateRepository = certificateRepository;
        this.studentRepository = studentRepository;
        this.eventRepository = eventRepository;
    }

    public List<CertificateDTO> getStudentCertificates(Long studentId) {
        return certificateRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CertificateDTO uploadCertificate(Long studentId, Long eventId, String certificateType, MultipartFile file) throws IOException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        Event event = null;
        if (eventId != null) {
            event = eventRepository.findById(eventId).orElse(null);
        }

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = Paths.get(uploadDir, storedFileName);

        Files.copy(file.getInputStream(), filePath);

        Certificate certificate = Certificate.builder()
                .student(student)
                .event(event)
                .certificateType(certificateType)
                .fileName(originalFilename)
                .filePath(filePath.toString())
                .issuedDate(LocalDate.now())
                .build();

        Certificate saved = certificateRepository.save(certificate);
        return mapToDTO(saved);
    }

    private CertificateDTO mapToDTO(Certificate c) {
        return CertificateDTO.builder()
                .id(c.getId())
                .studentId(c.getStudent().getId())
                .studentName(c.getStudent().getName())
                .eventId(c.getEvent() != null ? c.getEvent().getId() : null)
                .eventTitle(c.getEvent() != null ? c.getEvent().getTitle() : null)
                .certificateType(c.getCertificateType())
                .fileName(c.getFileName())
                .fileUrl("/uploads/certificates/" + new File(c.getFilePath()).getName())
                .issuedDate(c.getIssuedDate())
                .build();
    }
}
