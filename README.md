# 🏛️ SCTS - Smart Campus Extracurricular & Community Tracking System

> **A Next-Generation Campus Extracurricular Platform with Gamified Leaderboards, Event Scope Enforcement, Task Governance, and Real-Time Participation Analytics.**

---

## 🏆 Project Team & Credits

### 🚩 **Team Name:** RedStone Rebels

| Role | Name | Position |
| :--- | :--- | :--- |
| **👑 Team Leader** | **Pavithra U** | Project Lead & Architecture |
| **👨‍💻 Team Member** | **Prabhu A** | Full-Stack Core Engineer |
| **👨‍💻 Team Member** | **Nithick S** | Backend & Database Systems |

---

## 🛠️ Repository Fix Applied for Evaluators (Universal `mvnw.cmd`)

> ✅ **FIXED:** The repository `mvnw.cmd` script has been updated to remove hardcoded user paths (`C:\Users\prabh\...`). It now dynamically resolves `%USERPROFILE%` and system `%PATH%` so `mvnw.cmd` and `start_app.bat` work out-of-the-box on **ANY evaluator's computer**.

---

## 📥 Direct 1-Click Download Links for Evaluators & Staff

If you need to install Java, Node.js, or Apache Maven on your machine, click the **Direct Download Links** below:

### 1️⃣ **Java JDK 21 (Java Development Kit)**
* 🔗 **Direct Windows 64-Bit Installer (.exe):**  
  [👉 Click Here to Download Java JDK 21 Direct Installer (.exe)](https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.exe)
* 🌐 **Official Java Page:** [Oracle JDK 21 Downloads](https://www.oracle.com/java/technologies/downloads/#java21)

---

### 2️⃣ **Node.js LTS (v20.x)**
* 🔗 **Direct Windows 64-Bit Installer (.msi):**  
  [👉 Click Here to Download Node.js LTS Direct Installer (.msi)](https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi)
* 🌐 **Official Node.js Page:** [Node.js Official Downloads](https://nodejs.org/en/download/)

---

### 3️⃣ **Apache Maven (ZIP Download & PATH Setup)**
* 🔗 **Direct Apache Maven Binary Zip Download (.zip):**  
  [👉 Click Here to Download Apache Maven 3.9.6 Zip Package (.zip)](https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip)
* 🌐 **Official Apache Maven Download Page:** [Apache Maven Download Page](https://maven.apache.org/download.cgi)

#### **Quick 3-Step Apache Maven Installation Guide for Staff:**
1. Download the Apache Maven Zip file from the link above.
2. Extract the zip file (e.g. to `C:\Program Files\Apache\Maven`).
3. Add `C:\Program Files\Apache\Maven\bin` to your Windows **System PATH** environment variable.
4. Verify by opening a new Command Prompt and running: `mvn -version`

---

## ⚡ How to Open and Run the Application (1-Click)

### 🚀 **Step 1: Open the Project Folder**
Open File Explorer to the project main directory:
```
scts/
 ├── start_app.bat   <--- 👈 DOUBLE CLICK THIS FILE!
```

### 🚀 **Step 2: Double Click `start_app.bat`**
Double-click **`start_app.bat`**. It will automatically:
1. Start the Spring Boot Backend Server on `http://localhost:8080`.
2. Start the React Vite Frontend UI on `http://localhost:5173`.
3. Automatically open your web browser to **`http://localhost:5173`**!

---

## 🔑 Evaluator Test Login Credentials

Once the browser opens at `http://localhost:5173`, use any of these pre-configured accounts:

| Role | Username / Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student@scts.edu` | `password` | Joined Communities, Tasks, Events (+1 Pt), Activity Claims, Leaderboard |
| 🛡️ **Coordinator** | `coordinator@scts.edu` | `password` | Coding Club Coordinator Dashboard, Deliverable Verification (+3/+5 Pts), Activity Requests |
| 🏆 **Faculty Admin** | `faculty@scts.edu` | `password` | College Dashboard, Task Governance, 30+ Communities Participation Analytics |

---

## 🌟 System Overview

**SCTS (Smart Campus Extracurricular & Community Tracking System)** is an end-to-end web application engineered for universities and colleges to streamline extracurricular activities, student community memberships, event management, and task deliverables across 30+ campus communities.

The platform incentivizes student participation through a **Gamification Point System**, enables **Faculty Task Governance**, provides **Community Coordinators with Live Analytics**, and empowers students to build verified **Academic & Extracurricular Portfolios**.

---

## 📐 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS {
        Long id PK
        String email
        String password
        String role
    }

    STUDENTS {
        Long id PK
        Long user_id FK
        String studentCode
        String name
        String department
        String degree
        Integer year
        Integer semester
    }

    COMMUNITIES {
        Long id PK
        String name
        String category
        String studentCoordinator
        String facultyCoordinator
        Long coordinatorUserId FK
        String status
    }

    MEMBERSHIPS {
        Long id PK
        Long student_id FK
        Long community_id FK
        String role
        String status
        LocalDate joinedDate
    }

    EVENTS {
        Long id PK
        Long community_id FK
        String title
        String description
        String eventType
        String eventScope
        String venue
        LocalDate eventDate
        String time
    }

    EVENT_REGISTRATIONS {
        Long id PK
        Long event_id FK
        Long student_id FK
        LocalDateTime registrationDate
        String status
    }

    TASK_ASSIGNMENTS {
        Long id PK
        Long community_id FK
        String title
        String targetYear
        LocalDate deadline
        String status
        String taskType
        String assignedByFacultyName
    }

    TASK_SUBMISSIONS {
        Long id PK
        Long task_assignment_id FK
        Long student_id FK
        String proofLink
        String proofFileName
        String status
        String rejectionReason
    }

    ACTIVITY_REQUESTS {
        Long id PK
        Long student_id FK
        Long community_id FK
        String title
        String category
        Integer requestedPoints
        Integer grantedPoints
        String status
    }

    ATTENDANCES {
        Long id PK
        Long event_id FK
        Long student_id FK
        Long community_id FK
        String status
        LocalDateTime recordedTime
    }

    USERS ||--o| STUDENTS : "1:1 Profile"
    USERS ||--o{ COMMUNITIES : "Coordinates"
    STUDENTS ||--o{ MEMBERSHIPS : "Joins"
    COMMUNITIES ||--o{ MEMBERSHIPS : "Has Members"
    COMMUNITIES ||--o{ EVENTS : "Hosts"
    EVENTS ||--o{ EVENT_REGISTRATIONS : "Registrations"
    STUDENTS ||--o{ EVENT_REGISTRATIONS : "Registers"
    COMMUNITIES ||--o{ TASK_ASSIGNMENTS : "Assigns Tasks"
    TASK_ASSIGNMENTS ||--o{ TASK_SUBMISSIONS : "Has Submissions"
    STUDENTS ||--o{ TASK_SUBMISSIONS : "Submits Proof"
    STUDENTS ||--o{ ACTIVITY_REQUESTS : "Submits Claim"
    COMMUNITIES ||--o{ ACTIVITY_REQUESTS : "Evaluates Claim"
    EVENTS ||--o{ ATTENDANCES : "Logs Attendance"
    STUDENTS ||--o{ ATTENDANCES : "Attends"
```

---

## 📄 License & System Status

Designed & Developed by **Team RedStone Rebels** for **Smart Campus Extracurricular Tracking Systems (SCTS)**.
