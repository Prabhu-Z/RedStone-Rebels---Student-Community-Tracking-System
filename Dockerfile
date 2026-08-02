# ==============================================================================
# SCTS MULTI-STAGE DOCKERFILE FOR RENDER PRODUCTION DEPLOYMENT
# ==============================================================================

# STAGE 1: Build Spring Boot Backend JAR using Pre-Installed Maven 3.9 & JDK 21
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/ .
RUN mvn clean package -DskipTests

# STAGE 2: Build React Vite Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# STAGE 3: Production Runtime Container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy Backend JAR
COPY --from=backend-builder /app/backend/target/scts-backend-1.0.0.jar /app/scts-backend.jar

# Expose Port 8080
EXPOSE 8080

# Run Spring Boot Application
ENTRYPOINT ["java", "-jar", "/app/scts-backend.jar"]
