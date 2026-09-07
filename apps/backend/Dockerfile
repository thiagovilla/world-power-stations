# Build stage
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app

# Copy gradle wrapper and config files first for caching
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle

# Download dependencies
RUN ./gradlew dependencies --no-daemon || true

# Copy source code and build
COPY src ./src
RUN ./gradlew bootJar --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:21-jre-jammy AS runner
WORKDIR /app

# TODO: why we need curl?
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r wpsgroup && useradd -r -g wpsgroup wpsuser

COPY --from=builder /app/build/libs/*.jar app.jar
RUN chown -R wpsuser:wpsgroup /app

USER wpsuser

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
