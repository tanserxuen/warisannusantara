# Start with the official Docker image
FROM docker:latest

# Install OpenJDK 11
RUN apk update && apk add --no-cache openjdk11

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"
