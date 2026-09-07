#!/bin/bash
set -euo pipefail

echo "========================================="
echo "Starting WPS Cloud-Init Setup on AWS Free Tier"
echo "========================================="

export DEBIAN_FRONTEND=noninteractive

# 1. Configure 2 GB Swap Memory (Essential for 1 GB RAM EC2 Free Tier instance)
if [ ! -f /swapfile ]; then
  echo "--> Setting up 2GB Swap Memory..."
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  
  # Configure swappiness and cache pressure for memory efficiency
  sysctl vm.swappiness=10
  sysctl vm.vfs_cache_pressure=50
  echo 'vm.swappiness=10' >> /etc/sysctl.d/99-wps-memory.conf
  echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.d/99-wps-memory.conf
  echo "--> Swap setup completed successfully."
fi

# 2. Update packages and install dependencies
echo "--> Installing baseline utilities..."
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release git jq unzip

# Install AWS CLI v2 if missing
if ! command -v aws &> /dev/null; then
  echo "--> Installing AWS CLI v2..."
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
  unzip -q /tmp/awscliv2.zip -d /tmp
  /tmp/aws/install
  rm -rf /tmp/aws /tmp/awscliv2.zip
fi

# 3. Install Docker CE & Docker Compose Plugin
echo "--> Installing Docker Engine & Compose..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu

# 4. Create WPS Application Directory
echo "--> Initializing WPS application environment in /opt/wps..."
mkdir -p /opt/wps/nginx /opt/wps/logs
chown -R ubuntu:ubuntu /opt/wps

# 5. Populate Production Environment File
cat <<'EOF' > /opt/wps/.env
# World Power Stations - AWS Production Environment
ENVIRONMENT=${environment}
AWS_REGION=${aws_region}

# Database Connection (RDS PostgreSQL)
DB_HOST=${db_host}
DB_PORT=${db_port}
DB_NAME=${db_name}
DB_USER=${db_username}
DB_PASS=${db_password}
SPRING_DATASOURCE_URL=jdbc:postgresql://${db_host}:${db_port}/${db_name}
SPRING_DATASOURCE_USERNAME=${db_username}
SPRING_DATASOURCE_PASSWORD=${db_password}

# JVM Tuning for Free Tier 1GB Instance
JAVA_TOOL_OPTIONS=-Xms192m -Xmx256m -XX:+UseSerialGC -XX:TieredStopAtLevel=1

# Storage & Assets
S3_BUCKET_NAME=${s3_bucket_name}
CLOUDFRONT_DOMAIN=${cloudfront_domain}

# Networking
PORT=3000
SERVER_PORT=8080
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://${ec2_public_ip},https://${cloudfront_domain}
BACKEND_INTERNAL_URL=http://backend:8080
BACKEND_URL=http://backend:8080
EOF

# 6. Deploy Production Nginx Gateway Configuration
cat <<'EOF' > /opt/wps/nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout 65;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    upstream backend_upstream {
        server backend:8080;
    }

    upstream frontend_upstream {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name _;

        client_max_body_size 25M;

        # Healthcheck endpoint
        location /healthz {
            return 200 'OK';
            add_header Content-Type text/plain;
        }

        # Backend API Routing
        location /api/ {
            proxy_pass http://backend_upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 10s;
            proxy_read_timeout 60s;
        }

        # Spring Boot Actuator Monitoring
        location /actuator/ {
            proxy_pass http://backend_upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Frontend Remix Routing (SSR + Static Assets)
        location / {
            proxy_pass http://frontend_upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
EOF

# 7. Create Production Docker Compose Configuration
cat <<'EOF' > /opt/wps/docker-compose.yml
services:
  backend:
    image: world-power-stations-backend:latest
    container_name: wps-backend
    restart: unless-stopped
    env_file:
      - .env
    environment:
      SERVER_PORT: 8080
      JAVA_TOOL_OPTIONS: $${JAVA_TOOL_OPTIONS}
      SPRING_DATASOURCE_URL: $${SPRING_DATASOURCE_URL}
      SPRING_DATASOURCE_USERNAME: $${SPRING_DATASOURCE_USERNAME}
      SPRING_DATASOURCE_PASSWORD: $${SPRING_DATASOURCE_PASSWORD}
      APP_CORS_ALLOWED_ORIGINS: $${APP_CORS_ALLOWED_ORIGINS}
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 400M

  frontend:
    image: world-power-stations-frontend:latest
    container_name: wps-frontend
    restart: unless-stopped
    env_file:
      - .env
    environment:
      PORT: 3000
      NODE_ENV: production
      BACKEND_INTERNAL_URL: http://backend:8080
      BACKEND_URL: http://backend:8080
    depends_on:
      backend:
        condition: service_healthy
    deploy:
      resources:
        limits:
          memory: 300M

  gateway:
    image: nginx:1.27-alpine
    container_name: wps-gateway
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
    deploy:
      resources:
        limits:
          memory: 64M
EOF

# 8. Create Deployment Helper Script
cat <<'EOF' > /opt/wps/deploy.sh
#!/bin/bash
set -euo pipefail
cd /opt/wps

echo "--> Pulling latest container images..."
docker compose pull || true

echo "--> Recreating application services..."
docker compose up -d --remove-orphans

echo "--> Pruning dangling images..."
docker image prune -f

echo "--> WPS Stack successfully deployed!"
EOF
chmod +x /opt/wps/deploy.sh

chown -R ubuntu:ubuntu /opt/wps

echo "========================================="
echo "WPS Cloud-Init Setup Completed Successfully!"
echo "========================================="
