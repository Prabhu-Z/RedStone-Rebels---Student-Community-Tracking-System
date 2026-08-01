@REM ----------------------------------------------------------------------------
@REM Zero-Install Universal Maven Wrapper Batch Script for SCTS Backend
@REM Auto-downloads Maven Wrapper if Maven is not installed on the teacher's PC.
@REM ----------------------------------------------------------------------------

@SETLOCAL enableextensions enabledelayedexpansion

@IF "%HOME%" == "" (
  @SET "HOME=%USERPROFILE%"
)

@REM 1. Check if global 'mvn' command exists in system PATH
@where mvn >nul 2>nul
@IF %ERRORLEVEL% EQU 0 (
  @mvn %*
  @EXIT /B %ERRORLEVEL%
)

@REM 2. Check dynamically in current user's %USERPROFILE%\.m2 directory
@IF EXIST "%USERPROFILE%\.m2\wrapper\dists" (
  @FOR /F "tokens=*" %%i IN ('dir /b /s "%USERPROFILE%\.m2\wrapper\dists\mvn.cmd" 2^>nul') DO (
    @IF EXIST "%%i" (
      @"%%i" %*
      @EXIT /B %ERRORLEVEL%
    )
  )
)

@REM 3. Ensure .mvn/wrapper directory exists
@IF NOT EXIST "%~dp0.mvn\wrapper" (
  @mkdir "%~dp0.mvn\wrapper"
)

@REM 4. Auto-download maven-wrapper.jar if not present locally
@IF NOT EXIST "%~dp0.mvn\wrapper\maven-wrapper.jar" (
  @echo.
  @echo =========================================================================
  @echo  [SCTS AUTO-SETUP] Downloading Maven Wrapper for zero-install execution...
  @echo =========================================================================
  @powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%~dp0.mvn\wrapper\maven-wrapper.jar')"
)

@REM 5. Execute Maven via maven-wrapper.jar
@IF EXIST "%~dp0.mvn\wrapper\maven-wrapper.jar" (
  @java -jar "%~dp0.mvn\wrapper\maven-wrapper.jar" %*
  @EXIT /B %ERRORLEVEL%
)

@REM 6. Final Fallback
@mvn %*
