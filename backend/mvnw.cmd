@REM ----------------------------------------------------------------------------
@REM Official Apache Maven Wrapper Startup Batch Script for SCTS
@REM ----------------------------------------------------------------------------

@IF "%HOME%" == "" (
  @SET "HOME=%USERPROFILE%"
)

@SETLOCAL

@SET "MAVEN_PROJECTBASEDIR=%~dp0"
@IF "%MAVEN_PROJECTBASEDIR:~-1%"=="\" SET "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

@SET MAVEN_JAVA_EXE=java
@IF NOT "%JAVA_HOME%"=="" (
  @IF EXIST "%JAVA_HOME%\bin\java.exe" (
    @SET MAVEN_JAVA_EXE="%JAVA_HOME%\bin\java.exe"
  )
)

@IF EXIST "%~dp0.mvn\wrapper\maven-wrapper.jar" (
    %MAVEN_JAVA_EXE% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -classpath "%~dp0.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
    @EXIT /B %ERRORLEVEL%
)

@where mvn >nul 2>nul
@IF %ERRORLEVEL% EQU 0 (
    mvn %*
    @EXIT /B %ERRORLEVEL%
)

@echo.
@echo Error: Could not find Maven Wrapper or global mvn. Please ensure Java JDK 21 is installed.
@exit /b 1
