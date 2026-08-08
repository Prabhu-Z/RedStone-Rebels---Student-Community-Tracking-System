package com.scts.service;

import com.scts.dto.BulkImportResultDTO;
import com.scts.entity.*;
import com.scts.exception.ResourceNotFoundException;
import com.scts.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class StudentImportService {

    private final CommunityRepository communityRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public StudentImportService(
            CommunityRepository communityRepository,
            MembershipRepository membershipRepository,
            UserRepository userRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder) {
        this.communityRepository = communityRepository;
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public BulkImportResultDTO importStudentsToCommunity(Long communityId, MultipartFile file) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        int maxSize = community.getMaxSize() != null ? community.getMaxSize() : 100;

        List<Map<String, String>> rows = parseFileToRows(file);

        int importedCount = 0;
        int alreadyMemberCount = 0;
        int skippedCapacityCount = 0;
        int totalProcessedCount = 0;
        List<String> warnings = new ArrayList<>();

        for (int i = 0; i < rows.size(); i++) {
            Map<String, String> row = rows.get(i);
            int rowNum = i + 2; // Row 1 is header

            String rawCode = getFieldValue(row, "code", "student_code", "student code", "register number", "registration number", "reg number", "reg_number", "reg_no", "reg no");
            String rawName = getFieldValue(row, "name", "student_name", "student name", "full name", "full_name");
            String rawEmail = getFieldValue(row, "email", "mail id", "mail_id", "student email", "student_email", "email address", "email_address");
            String rawDept = getFieldValue(row, "department", "dept", "branch");
            String rawYear = getFieldValue(row, "year");

            if ((rawEmail == null || rawEmail.trim().isEmpty()) && (rawCode == null || rawCode.trim().isEmpty())) {
                warnings.add("Row " + rowNum + ": Missing student email and registration code. Skipped.");
                continue;
            }

            totalProcessedCount++;

            String email = rawEmail != null && !rawEmail.trim().isEmpty()
                    ? rawEmail.trim().toLowerCase()
                    : (rawCode.trim().toLowerCase() + "@student.college.edu");
            String studentCode = rawCode != null && !rawCode.trim().isEmpty()
                    ? rawCode.trim().toUpperCase()
                    : ("STU" + System.currentTimeMillis() % 100000);
            String name = rawName != null && !rawName.trim().isEmpty() ? rawName.trim() : "Student " + studentCode;
            String dept = rawDept != null && !rawDept.trim().isEmpty() ? rawDept.trim() : "General";
            int year = 1;
            try {
                if (rawYear != null && !rawYear.trim().isEmpty()) {
                    year = Integer.parseInt(rawYear.trim());
                }
            } catch (NumberFormatException ignored) {}

            // 1. Find or create User
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode("password123"));
                user.setRole(Role.ROLE_STUDENT);
                user.setStatus("ACTIVE");
                user.setCreatedAt(LocalDateTime.now());
                user = userRepository.save(user);
            }

            // 2. Find or create Student profile
            Student student = studentRepository.findByUserId(user.getId()).orElse(null);
            if (student == null) {
                student = studentRepository.findByStudentCode(studentCode).orElse(null);
            }
            if (student == null) {
                student = new Student();
                student.setUser(user);
                student.setStudentCode(studentCode);
                student.setName(name);
                student.setDepartment(dept);
                student.setDegree("B.Tech");
                student.setYear(year);
                student.setSemester((year * 2) - 1);
                student = studentRepository.save(student);
            }

            // 3. Check existing community membership
            Optional<Membership> existingMem = membershipRepository.findByStudentIdAndCommunityId(student.getId(), communityId);
            if (existingMem.isPresent() && existingMem.get().getStatus() == MembershipStatus.APPROVED) {
                alreadyMemberCount++;
                warnings.add("Row " + rowNum + ": Student " + name + " (" + studentCode + ") is already an approved member.");
                continue;
            }

            // 4. Check Community Capacity Limit
            long currentApprovedCount = membershipRepository.countByCommunityIdAndStatus(communityId, MembershipStatus.APPROVED);
            if (currentApprovedCount >= maxSize) {
                skippedCapacityCount++;
                warnings.add("Row " + rowNum + ": Community capacity limit (" + maxSize + ") reached. Skipped " + name + " (" + studentCode + ").");
                continue;
            }

            // 5. Enroll student
            Membership mem = existingMem.orElse(new Membership());
            mem.setStudent(student);
            mem.setCommunity(community);
            mem.setRole(CommunityRole.MEMBER);
            mem.setStatus(MembershipStatus.APPROVED);
            mem.setJoinedDate(LocalDate.now());
            mem.setUpdatedAt(LocalDateTime.now());
            membershipRepository.save(mem);

            importedCount++;
        }

        String summaryMsg = String.format("Successfully processed %d rows. %d imported, %d already members, %d skipped due to capacity limit (%d max).",
                totalProcessedCount, importedCount, alreadyMemberCount, skippedCapacityCount, maxSize);

        return new BulkImportResultDTO(
                true,
                summaryMsg,
                importedCount,
                alreadyMemberCount,
                skippedCapacityCount,
                totalProcessedCount,
                warnings
        );
    }

    private List<Map<String, String>> parseFileToRows(MultipartFile file) {
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
            return parseExcelFile(file);
        } else {
            return parseCsvFile(file);
        }
    }

    private List<Map<String, String>> parseExcelFile(MultipartFile file) {
        List<Map<String, String>> rows = new ArrayList<>();
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            if (!rowIterator.hasNext()) return rows;

            // Header row
            Row headerRow = rowIterator.next();
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(getCellValueAsString(cell).toLowerCase().trim());
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Map<String, String> rowMap = new HashMap<>();
                boolean isEmptyRow = true;

                for (int c = 0; c < headers.size(); c++) {
                    Cell cell = row.getCell(c, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
                    String val = getCellValueAsString(cell).trim();
                    if (!val.isEmpty()) isEmptyRow = false;
                    rowMap.put(headers.get(c), val);
                }

                if (!isEmptyRow) {
                    rows.add(rowMap);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error parsing Excel spreadsheet: " + e.getMessage(), e);
        }
        return rows;
    }

    private List<Map<String, String>> parseCsvFile(MultipartFile file) {
        List<Map<String, String>> rows = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null) return rows;

            String[] headers = parseCsvLine(headerLine);
            for (int i = 0; i < headers.length; i++) {
                headers[i] = headers[i].toLowerCase().trim().replace("\"", "");
            }

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                String[] values = parseCsvLine(line);
                Map<String, String> rowMap = new HashMap<>();
                for (int i = 0; i < headers.length; i++) {
                    String val = (i < values.length) ? values[i].trim().replace("\"", "") : "";
                    rowMap.put(headers[i], val);
                }
                rows.add(rowMap);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error parsing CSV file: " + e.getMessage(), e);
        }
        return rows;
    }

    private String[] parseCsvLine(String line) {
        return line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                double num = cell.getNumericCellValue();
                if (num == (long) num) {
                    return String.valueOf((long) num);
                }
                return String.valueOf(num);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

    private String getFieldValue(Map<String, String> row, String... possibleKeys) {
        for (String key : possibleKeys) {
            for (Map.Entry<String, String> entry : row.entrySet()) {
                String normHeader = entry.getKey().toLowerCase().replaceAll("[_\\-\\s]+", " ");
                String normTarget = key.toLowerCase().replaceAll("[_\\-\\s]+", " ");
                if (normHeader.equals(normTarget) || normHeader.contains(normTarget)) {
                    if (entry.getValue() != null && !entry.getValue().trim().isEmpty()) {
                        return entry.getValue().trim();
                    }
                }
            }
        }
        return null;
    }
}
