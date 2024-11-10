# Use a base image with Java runtime environment
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Spring Boot JAR file into the container
COPY target/ServerManger-0.0.1-SNAPSHOT.jar app.jar

# Expose the port that your Spring Boot application runs on (default 8080)
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
