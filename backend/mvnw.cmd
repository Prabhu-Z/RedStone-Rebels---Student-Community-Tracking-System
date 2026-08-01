@REM ----------------------------------------------------------------------------
@REM Universal Portable Maven Wrapper Batch Script for SCTS Backend
@REM Designed for evaluators & developers: works on any computer & user profile.
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

@REM 3. Check local project maven wrapper jar if present
@IF EXIST "%~dp0.mvn\wrapper\maven-wrapper.jar" (
  @java -jar "%~dp0.mvn\wrapper\maven-wrapper.jar" %*
  @EXIT /B %ERRORLEVEL%
)

@REM 4. Fallback execution attempt
@mvn %*
@IF %ERRORLEVEL% NEQ 0 (
  @echo.
  @echo =========================================================================
  @echo  [SCTS SETUP NOTICE] Maven executable 'mvn' was not found on system PATH.
  @echo  Please install Apache Maven or add it to System PATH:
  @echo  Download Link: https://maven.apache.org/download.cgi
  @echo =========================================================================
  @echo.
)
