# 🗄️ Database Schema & Seed Data - SCTS

**Database Engine:** MySQL 8.0+ / H2 In-Memory Database (`jdbc:h2:mem:sctsdb`)  
**Database Name:** `scts_db`  
**Character Set:** `utf8mb4`  

---

## 📑 Table of Contents
1. [1. Complete SQL Schema (DDL)](#1-complete-sql-schema-ddl)
2. [2. Complete Sample Seed Data (DML)](#2-complete-sample-seed-data-dml)

---

## 1. Complete SQL Schema (DDL)

```sql
-- ============================================================================
-- STUDENT COMMUNITY TRACKING SYSTEM (SCTS) - DATABASE SCHEMA
-- ============================================================================

CREATE DATABASE IF NOT EXISTS scts_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scts_db;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. STUDENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    student_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    semester INT NOT NULL,
    contact VARCHAR(50) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    profile_image_url VARCHAR(500) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_code (student_code),
    INDEX idx_student_name (name),
    INDEX idx_student_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. COMMUNITIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS communities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    faculty_coordinator_name VARCHAR(255) DEFAULT NULL,
    student_coordinator_name VARCHAR(255) DEFAULT NULL,
    coordinator_user_id BIGINT DEFAULT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    banner_url VARCHAR(500) DEFAULT NULL,
    logo_url VARCHAR(500) DEFAULT NULL,
    created_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_community_category (category),
    INDEX idx_community_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. MEMBERSHIPS TABLE (Student <-> Community M:N)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    community_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    joined_date DATE DEFAULT NULL,
    left_date DATE DEFAULT NULL,
    request_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_membership_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_membership_community FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    CONSTRAINT uq_student_community UNIQUE (student_id, community_id, status),
    INDEX idx_membership_status (status),
    INDEX idx_membership_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. EVENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    community_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) DEFAULT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_scope VARCHAR(50) NOT NULL DEFAULT 'GLOBAL_EVENT',
    event_status VARCHAR(50) NOT NULL DEFAULT 'UPCOMING',
    event_date DATETIME NOT NULL,
    end_date DATETIME DEFAULT NULL,
    registration_deadline DATETIME DEFAULT NULL,
    max_capacity INT NOT NULL DEFAULT 100,
    current_registrations INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_community FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    INDEX idx_event_date (event_date),
    INDEX idx_event_type (event_type),
    INDEX idx_event_scope (event_scope),
    INDEX idx_event_status (event_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. EVENT REGISTRATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_registration_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_registration_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uq_event_student UNIQUE (event_id, student_id),
    INDEX idx_registration_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. TASK ASSIGNMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    community_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_year VARCHAR(50) NOT NULL DEFAULT 'ALL',
    deadline DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED',
    task_type VARCHAR(50) NOT NULL DEFAULT 'DAILY_TASK',
    assigned_by_faculty_name VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_community FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    INDEX idx_task_type (task_type),
    INDEX idx_task_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. TASK SUBMISSIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_assignment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    proof_link VARCHAR(500) DEFAULT NULL,
    proof_file_name VARCHAR(255) DEFAULT NULL,
    proof_file_url VARCHAR(500) DEFAULT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT DEFAULT NULL,
    submitted_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_submission_task FOREIGN KEY (task_assignment_id) REFERENCES task_assignments(id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_submission_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. ACTIVITY REQUESTS TABLE (Individual Achievement Claims)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    community_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    proof_link VARCHAR(500) DEFAULT NULL,
    proof_file_name VARCHAR(255) DEFAULT NULL,
    requested_points INT NOT NULL DEFAULT 5,
    granted_points INT DEFAULT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    coordinator_feedback TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_actreq_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_actreq_community FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    INDEX idx_actreq_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. ATTENDANCE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PRESENT',
    marked_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uq_attendance_event_student UNIQUE (event_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 2. Complete Sample Seed Data (DML)

```sql
-- ============================================================================
-- STUDENT COMMUNITY TRACKING SYSTEM (SCTS) - SEED DATA
-- ============================================================================

USE scts_db;

-- 1. USERS
INSERT INTO users (id, email, password, role, status, created_at) VALUES
(1, 'student@scts.edu', '$2a$10$E2B6H5.xLMg0jV4mPzK3/eB5QzS3tV0Y3L5Y6K7J8I9H0G1F2E3D4', 'ROLE_STUDENT', 'ACTIVE', NOW()),
(2, 'coordinator@scts.edu', '$2a$10$E2B6H5.xLMg0jV4mPzK3/eB5QzS3tV0Y3L5Y6K7J8I9H0G1F2E3D4', 'ROLE_COMMUNITY_COORDINATOR', 'ACTIVE', NOW()),
(3, 'faculty@scts.edu', '$2a$10$E2B6H5.xLMg0jV4mPzK3/eB5QzS3tV0Y3L5Y6K7J8I9H0G1F2E3D4', 'ROLE_FACULTY', 'ACTIVE', NOW());

-- 2. STUDENTS
INSERT INTO students (id, user_id, student_code, name, department, degree, year, semester, contact, created_at) VALUES
(1, 1, 'REG2026001', 'Arun Kumar', 'Computer Science & Engineering', 'B.Tech CSE', 3, 6, '+91 9876543210', NOW());

-- 3. COMMUNITIES (Sample Top Communities)
INSERT INTO communities (id, name, description, category, faculty_coordinator_name, student_coordinator_name, status, created_date, created_at) VALUES
(1, 'Algorithms & Competitive Coding Club', 'Fostering algorithmic problem solving and LeetCode sprints.', 'TECHNICAL', 'Dr. Ramesh Sharma', 'Arun Kumar', 'ACTIVE', '2023-01-15', NOW()),
(2, 'Web Development Chapter', 'Building full-stack web applications and UI/UX design workshops.', 'TECHNICAL', 'Prof. Sunita Rao', 'Priya Nair', 'ACTIVE', '2023-02-10', NOW()),
(3, 'AI & Data Science Society', 'Exploring machine learning, neural networks, and Kaggle competitions.', 'TECHNICAL', 'Dr. K. V. Subramanian', 'Rahul Verma', 'ACTIVE', '2023-03-01', NOW()),
(4, 'NSS Green Warriors', 'Eco-drives, afforestation, and green campus initiatives.', 'SOCIAL_SERVICE', 'Prof. Meenakshi Sundaram', 'Sanya Gupta', 'ACTIVE', '2022-08-15', NOW());

-- 4. MEMBERSHIPS
INSERT INTO memberships (id, student_id, community_id, role, status, joined_date, request_date, remarks) VALUES
(1, 1, 1, 'SECRETARY', 'APPROVED', '2023-08-01', '2023-07-25 10:00:00', 'Active Student Coordinator'),
(2, 1, 2, 'MEMBER', 'APPROVED', '2023-09-10', '2023-09-01 14:30:00', 'Full Stack Developer'),
(3, 1, 3, 'VOLUNTEER', 'APPROVED', '2024-01-15', '2024-01-10 11:20:00', 'AI Workshop Organizer');

-- 5. EVENTS
INSERT INTO events (id, community_id, title, description, location, event_type, event_scope, event_status, event_date, end_date, max_capacity, current_registrations, created_at) VALUES
(1, 1, 'National Algorithmic Hackathon 2026', '24-Hour competitive programming sprint.', 'Main Auditorium & CS Lab 3', 'COMPETITION', 'GLOBAL_EVENT', 'UPCOMING', '2026-08-15 09:00:00', '2026-08-16 09:00:00', 150, 42, NOW()),
(2, 2, 'Full-Stack React & Spring Boot Bootcamp', 'Hands-on workshop building REST APIs.', 'Seminar Hall B', 'WORKSHOP', 'COMMUNITY_EVENT', 'UPCOMING', '2026-08-20 14:00:00', '2026-08-20 18:00:00', 80, 65, NOW());

-- 6. EVENT REGISTRATIONS
INSERT INTO event_registrations (id, event_id, student_id, registration_date, status) VALUES
(1, 1, 1, '2026-07-28 10:30:00', 'CONFIRMED'),
(2, 2, 1, '2026-07-29 11:15:00', 'CONFIRMED');

-- 7. TASK ASSIGNMENTS
INSERT INTO task_assignments (id, community_id, title, description, target_year, deadline, status, task_type, assigned_by_faculty_name, created_at) VALUES
(1, 1, 'Dynamic Programming & Graph Challenge', 'Solve 5 DP medium problems on LeetCode.', 'ALL', '2026-08-10', 'ASSIGNED', 'COMMUNITY_TASK', 'Dr. Ramesh Sharma', NOW()),
(2, 1, 'Daily Code Review & Unit Test Practice', 'Submit link to GitHub PR with JUnit tests.', 'ALL', '2026-08-05', 'ASSIGNED', 'DAILY_TASK', NULL, NOW());

-- 8. TASK SUBMISSIONS
INSERT INTO task_submissions (id, task_assignment_id, student_id, proof_link, proof_file_name, status, submitted_at, created_at) VALUES
(1, 1, 1, 'https://github.com/arunkumar/dp-challenge', 'dp_solutions.zip', 'VERIFIED', NOW(), NOW());

-- 9. ACTIVITY REQUESTS
INSERT INTO activity_requests (id, student_id, community_id, title, category, description, proof_link, requested_points, granted_points, status, coordinator_feedback, created_at) VALUES
(1, 1, 1, '1st Place Winner - State Hackathon 2026', 'HACKATHON', 'Won 1st rank in 36-hr AI challenge.', 'https://hackathon.org/winners/arun', 15, 15, 'APPROVED', 'Outstanding achievement! +15 Pts granted.', NOW());
```
