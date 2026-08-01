@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script for SCTS Backend
@REM ----------------------------------------------------------------------------

@IF "%HOME%" == "" (
  @SET "HOME=%USERPROFILE%"
)

@SET MAVEN_CMD="C:\Users\prabh\.m2\wrapper\dists\apache-maven-3.9.11\03d7e36a140982eea48e22c1dcac01d8862b2550b2939e09a0809bbc5182a5bc\bin\mvn.cmd"

@IF EXIST %MAVEN_CMD% (
  %MAVEN_CMD% %*
) ELSE (
  mvn %*
)
