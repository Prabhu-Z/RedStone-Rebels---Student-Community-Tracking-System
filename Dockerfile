# ==============================================================================
# SCTS UNIFIED PRODUCTION DOCKERFILE FOR RENDER DEPLOYMENT
# ==============================================================================

# STAGE 1: Build React Vite Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# STAGE 2: Build Spring Boot Backend with Embedded Frontend Static Assets
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# STAGE 3: Production Runtime Container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/scts-backend-1.0.0.jar /app/scts-backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/scts-backend.jar"]
