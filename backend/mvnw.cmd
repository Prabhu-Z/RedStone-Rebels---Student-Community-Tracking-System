@REM ----------------------------------------------------------------------------
@REM Zero-Install Universal Maven Wrapper Batch Script for SCTS Backend
@REM Auto-downloads Maven Wrapper & executes org.apache.maven.wrapper.MavenWrapperMain
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

@REM 4. Ensure maven-wrapper.properties exists
@IF NOT EXIST "%~dp0.mvn\wrapper\maven-wrapper.properties" (
  @echo distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip> "%~dp0.mvn\wrapper\maven-wrapper.properties"
  @echo wrapperUrl=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar>> "%~dp0.mvn\wrapper\maven-wrapper.properties"
)

@REM 5. Auto-download maven-wrapper.jar if not present
@IF NOT EXIST "%~dp0.mvn\wrapper\maven-wrapper.jar" (
  @echo.
  @echo =========================================================================
  @echo  [SCTS AUTO-SETUP] Downloading Maven Wrapper jar for zero-install...
  @echo =========================================================================
  @powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%~dp0.mvn\wrapper\maven-wrapper.jar')"
)

@REM 6. Execute Maven Wrapper via Main Class
@IF EXIST "%~dp0.mvn\wrapper\maven-wrapper.jar" (
  @java "-Dmaven.multiModuleProjectDirectory=%~dp0." -classpath "%~dp0.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
  @EXIT /B %ERRORLEVEL%
)

@REM 7. Final Fallback
@mvn %*
