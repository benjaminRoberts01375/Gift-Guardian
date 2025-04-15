FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    curl \
    git \
    unzip \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Create Go directory with proper permissions
RUN mkdir -p /go/bin /go/src /go/pkg && chown -R vscode:vscode /go

# Install Go 1.24.2
RUN curl -sSL https://go.dev/dl/go1.24.2.linux-amd64.tar.gz | tar -C /usr/local -xzf - \
    && export PATH=$PATH:/usr/local/go/bin \
    && go version

# Add Go to PATH
ENV PATH=$PATH:/usr/local/go/bin:/go/bin
ENV GOPATH=/go

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash \
    && echo 'export BUN_INSTALL="$HOME/.bun"' >> /etc/bash.bashrc \
    && echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> /etc/bash.bashrc

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get update && apt-get install -y nodejs \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install PostgreSQL client tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends postgresql-client \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# The base image already has a 'vscode' user with UID 1000
# Set up Go environment for the user
RUN echo 'export GOPATH=/go' >> /home/vscode/.bashrc \
    && echo 'export PATH=$PATH:/go/bin' >> /home/vscode/.bashrc

# Set the working directory
WORKDIR /workspace