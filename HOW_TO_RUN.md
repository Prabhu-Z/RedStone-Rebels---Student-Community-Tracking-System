# 🚀 How to Run & Open the SCTS Application Easily

> **Evaluator Startup Guide & Zero-Install Instructions for SCTS (Smart Campus Extracurricular System)**

---

## ⚡ Zero-Install Setup for Teachers & Evaluators

🎉 **NO MAVEN INSTALLATION REQUIRED!**  
The project's **`mvnw.cmd`** script includes an automated 1-click PowerShell downloader. The evaluating teacher or staff member does **NOT** need to install Apache Maven or set any PATH environment variables. 

Simply double-click **`start_app.bat`** and the system handles Maven automatically!

---

## 📥 Direct 1-Click Download Links (If Java JDK 21 or Node.js is needed)

If your machine needs Java JDK 21 or Node.js, click the **Direct Download Links** below:

### 1️⃣ **Java JDK 21 (Java Development Kit)**
* 🔗 **Direct Windows 64-Bit Installer (.exe):**  
  [👉 Click Here to Download Java JDK 21 Direct Installer (.exe)](https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.exe)

---

### 2️⃣ **Node.js LTS (v20.x)**
* 🔗 **Direct Windows 64-Bit Installer (.msi):**  
  [👉 Click Here to Download Node.js LTS Direct Installer (.msi)](https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi)

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
