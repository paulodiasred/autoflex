# backend/Dockerfile
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/quarkus-app /app
EXPOSE 8080
CMD ["java", "-jar", "quarkus-run.jar"]