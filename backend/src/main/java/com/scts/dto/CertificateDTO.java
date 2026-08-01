package com.scts.dto;

import java.time.LocalDate;

public class CertificateDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long eventId;
    private String eventTitle;
    private String certificateType;
    private String fileName;
    private String fileUrl;
    private LocalDate issuedDate;

    public CertificateDTO() {}

    public CertificateDTO(Long id, Long studentId, String studentName, Long eventId, String eventTitle, String certificateType, String fileName, String fileUrl, LocalDate issuedDate) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.certificateType = certificateType;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.issuedDate = issuedDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getCertificateType() { return certificateType; }
    public void setCertificateType(String certificateType) { this.certificateType = certificateType; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public LocalDate getIssuedDate() { return issuedDate; }
    public void setIssuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; }

    public static CertificateDTOBuilder builder() { return new CertificateDTOBuilder(); }

    public static class CertificateDTOBuilder {
        private Long id;
        private Long studentId;
        private String studentName;
        private Long eventId;
        private String eventTitle;
        private String certificateType;
        private String fileName;
        private String fileUrl;
        private LocalDate issuedDate;

        public CertificateDTOBuilder id(Long id) { this.id = id; return this; }
        public CertificateDTOBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public CertificateDTOBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public CertificateDTOBuilder eventId(Long eventId) { this.eventId = eventId; return this; }
        public CertificateDTOBuilder eventTitle(String eventTitle) { this.eventTitle = eventTitle; return this; }
        public CertificateDTOBuilder certificateType(String certificateType) { this.certificateType = certificateType; return this; }
        public CertificateDTOBuilder fileName(String fileName) { this.fileName = fileName; return this; }
        public CertificateDTOBuilder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
        public CertificateDTOBuilder issuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; return this; }

        public CertificateDTO build() {
            return new CertificateDTO(id, studentId, studentName, eventId, eventTitle, certificateType, fileName, fileUrl, issuedDate);
        }
    }
}
