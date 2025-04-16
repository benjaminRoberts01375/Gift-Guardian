# Build stage
FROM golang:alpine AS builder

# Set environment variables
ENV GOPRIVATE=github.com/benjaminRoberts01375

# Install git
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Mount GitHub token at build time
RUN --mount=type=secret,id=env_file \
    if [ -f "/run/secrets/env_file" ]; then \
    TOKEN=$(grep "GITHUB_TOKEN" /run/secrets/env_file | sed 's/GITHUB_TOKEN=//') && \
    git config --global url."https://${TOKEN}@github.com/".insteadOf "https://github.com/"; \
    fi

# Download dependencies
RUN go mod download && go mod tidy

# Copy source code
COPY . .

# Build the application
RUN go build -o main .

# Clean up git config after build
RUN --mount=type=secret,id=env_file \
    if [ -f "/run/secrets/env_file" ]; then \
    TOKEN=$(grep "GITHUB_TOKEN" /run/secrets/env_file | sed 's/GITHUB_TOKEN=//') && \
    git config --global --unset url."https://${TOKEN}@github.com/".insteadOf; \
    fi || true

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
USER appuser
RUN mkdir -p /home/appuser/configs && \
    chown -R appuser:appgroup /home/appuser/configs

# Copy environment variables
COPY --chown=appuser:appgroup .env /home/appuser/configs/

# Run the binary
CMD ["./main"]
