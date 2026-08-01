# 🚀 How to Run & Open the SCTS Application Easily

> **Evaluator Startup Guide & Direct 1-Click Installer Links for SCTS (Smart Campus Extracurricular System)**

---

## 🛠️ Repository Fix Applied (Universal `mvnw.cmd`)

✅ **FIXED:** The `mvnw.cmd` script in the repository has been updated to remove the hardcoded developer path (`C:\Users\prabh\...`). It now dynamically resolves `%USERPROFILE%` and system `%PATH%` so `start_app.bat` and `mvnw.cmd` work seamlessly on **ANY evaluator's computer**.

---

## 📥 Direct 1-Click Download Links for Evaluators & Staff

If your machine needs Java, Node.js, or Apache Maven installed, click the **Direct Download Links** below:

### 1️⃣ **Java JDK 21 (Java Development Kit)**
* 🔗 **Direct Windows 64-Bit Installer (.exe):**  
  [👉 Click Here to Download Java JDK 21 Direct Installer (.exe)](https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.exe)
* 🌐 **Official Page:** [Oracle JDK 21 Downloads](https://www.oracle.com/java/technologies/downloads/#java21)

---

### 2️⃣ **Node.js LTS (v20.x)**
* 🔗 **Direct Windows 64-Bit Installer (.msi):**  
  [👉 Click Here to Download Node.js LTS Direct Installer (.msi)](https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi)
* 🌐 **Official Page:** [Node.js Official Downloads](https://nodejs.org/en/download/)

---

### 3️⃣ **Apache Maven (Direct ZIP Download & Manual Setup)**
* 🔗 **Direct Apache Maven Binary Zip Download (.zip):**  
  [👉 Click Here to Download Apache Maven 3.9.6 Zip Package (.zip)](https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip)
* 🌐 **Official Page:** [Apache Maven Download Page](https://maven.apache.org/download.cgi)

#### **Quick 3-Step Apache Maven Setup for Evaluators:**
1. Download the ZIP file from the direct link above.
2. Extract it to `C:\Program Files\Apache\Maven`.
3. Add `C:\Program Files\Apache\Maven\bin` to your **System PATH** environment variable.
4. Verify by opening a new Command Prompt and running: `mvn -version`

---

## ⚡ Method 1: The Easy 1-Click Launcher (Recommended)

Simply double-click the **`start_app.bat`** file located in the main project folder:

```
scts/
 ├── start_app.bat   <--- 👈 DOUBLE CLICK THIS FILE!
```

### What happens automatically:
1. It automatically launches the **Spring Boot Backend Engine** on `http://localhost:8080`.
2. It automatically launches the **Vite React Frontend UI** on `http://localhost:5173`.
3. It automatically opens your web browser to **`http://localhost:5173`** in 5 seconds!

---

## 🔑 Evaluator Test Login Credentials

| Role | Username / Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student@scts.edu` | `password` | Joined Communities, Tasks, Events (+1 Pt), Activity Claims, Leaderboard |
| 🛡️ **Coordinator** | `coordinator@scts.edu` | `password` | Coding Club Coordinator Dashboard, Deliverable Verification (+3/+5 Pts), Activity Requests |
| 🏆 **Faculty Admin** | `faculty@scts.edu` | `password` | College Dashboard, Task Governance, 30+ Communities Participation Analytics |
