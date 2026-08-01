# 🚀 How to Run & Open the SCTS Application Easily

> **Evaluator & Zero-Setup Launch Guide for SCTS (Smart Campus Extracurricular System)**

---

## 🛠️ Zero-Setup Improvements Applied

1. **Backend Maven Wrapper (`mvnw.cmd`)**:
   - Fixed `no main manifest attribute` error by invoking `org.apache.maven.wrapper.MavenWrapperMain` via classpath `-classpath .mvn/wrapper/maven-wrapper.jar`.
   - Included physical `maven-wrapper.jar` inside the repository.
   - **No Apache Maven download or PATH setup required!**

2. **Frontend `npm.cmd` & PowerShell ExecutionPolicy Bypass**:
   - Updated `start_app.bat` to call `npm.cmd` explicitly instead of `npm`.
   - This completely bypasses Windows PowerShell `Restricted` ExecutionPolicy (`npm.ps1` script errors).
   - Auto-checks for `node_modules\vite` and runs `npm.cmd install` automatically if missing.

---

## ⚡ Method 1: The Easy 1-Click Launcher (Recommended)

Simply double-click the **`start_app.bat`** file located in the main project folder:

```
scts/
 ├── start_app.bat   <--- 👈 DOUBLE CLICK THIS FILE!
```

### What happens automatically:
1. Automatically checks for frontend dependencies and runs `npm.cmd install` if needed.
2. Automatically launches the **Spring Boot Backend Engine** on `http://localhost:8080`.
3. Automatically launches the **Vite React Frontend UI** on `http://localhost:5173`.
4. Automatically opens your web browser to **`http://localhost:5173`** in 5 seconds!

---

## 💻 Method 2: Manual Terminal Launch

If launching manually via Command Prompt (`cmd`):

### Step 1: Start Backend
```cmd
cd backend
mvnw.cmd spring-boot:run
```

### Step 2: Start Frontend
```cmd
cd frontend
npm.cmd install
npm.cmd run dev
```

---

## 🔑 Evaluator Test Login Credentials

| Role | Username / Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student@scts.edu` | `password` | Joined Communities, Tasks, Events (+1 Pt), Activity Claims, Leaderboard |
| 🛡️ **Coordinator** | `coordinator@scts.edu` | `password` | Coding Club Coordinator Dashboard, Deliverable Verification (+3/+5 Pts), Activity Requests |
| 🏆 **Faculty Admin** | `faculty@scts.edu` | `password` | College Dashboard, Task Governance, 30+ Communities Participation Analytics |
