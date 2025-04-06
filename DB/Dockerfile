# Build stage
FROM golang:alpine AS builder

# Set environment variables
ENV GOPRIVATE=github.com/benjaminRoberts01375

# Accept GitHub token as build argument
ARG GITHUB_TOKEN

# Install git
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Configure git to use the GitHub token
RUN git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"

# Download dependencies
RUN go mod download && go mod tidy

# Copy source code
COPY . .

# Build the application
RUN go build -o main .

# Clean up git config after build
RUN git config --global --unset url."https://${GITHUB_TOKEN}@github.com/".insteadOf

# Final stage - not too picky about the exact version of alpine
FROM alpine:3

# System group && system user as a part of the system group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set working directory
WORKDIR /home/appuser

# Copy the binary from builder
COPY --from=builder --chown=appuser:appgroup /app/main /home/appuser/main

# Create configs directory and set permissions
# USER root
USER appuser
RUN mkdir -p /home/appuser/configs && \
    chown -R appuser:appgroup /home/appuser/configs
#USER appuser

# Copy environment variables
COPY --chown=appuser:appgroup .env /home/appuser/configs/

# Run the binary
CMD ["./main"]