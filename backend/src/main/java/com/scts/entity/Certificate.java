package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "certificate_type", nullable = false)
    private String certificateType;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "issued_date", nullable = false)
    private LocalDate issuedDate;

    public Certificate() {}

    public Certificate(Long id, Student student, Event event, String certificateType, String fileName, String filePath, LocalDate issuedDate) {
        this.id = id;
        this.student = student;
        this.event = event;
        this.certificateType = certificateType;
        this.fileName = fileName;
        this.filePath = filePath;
        this.issuedDate = issuedDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public String getCertificateType() { return certificateType; }
    public void setCertificateType(String certificateType) { this.certificateType = certificateType; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public LocalDate getIssuedDate() { return issuedDate; }
    public void setIssuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; }

    public static CertificateBuilder builder() { return new CertificateBuilder(); }

    public static class CertificateBuilder {
        private Long id;
        private Student student;
        private Event event;
        private String certificateType;
        private String fileName;
        private String filePath;
        private LocalDate issuedDate;

        public CertificateBuilder id(Long id) { this.id = id; return this; }
        public CertificateBuilder student(Student student) { this.student = student; return this; }
        public CertificateBuilder event(Event event) { this.event = event; return this; }
        public CertificateBuilder certificateType(String certificateType) { this.certificateType = certificateType; return this; }
        public CertificateBuilder fileName(String fileName) { this.fileName = fileName; return this; }
        public CertificateBuilder filePath(String filePath) { this.filePath = filePath; return this; }
        public CertificateBuilder issuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; return this; }

        public Certificate build() {
            return new Certificate(id, student, event, certificateType, fileName, filePath, issuedDate);
        }
    }
}
