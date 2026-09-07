variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name (e.g., staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name identifier used for resource naming"
  type        = string
  default     = "world-power-stations"
}

variable "vpc_cidr" {
  description = "CIDR block for the Virtual Private Cloud (VPC)"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (EC2, CloudFront routing)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (RDS PostgreSQL database)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "instance_type" {
  description = "EC2 compute instance type (AWS Free Tier: t3.micro or t2.micro)"
  type        = string
  default     = "t3.micro"
}

variable "ec2_root_volume_size" {
  description = "Root EBS storage volume size in GB (AWS Free Tier allows up to 30 GB total EBS)"
  type        = number
  default     = 20
}

variable "ssh_public_key" {
  description = "Optional SSH public key for direct EC2 SSH access. If empty, access via AWS Systems Manager (SSM) is recommended."
  type        = string
  default     = ""
}

variable "allowed_ssh_cidr" {
  description = "CIDR blocks permitted to connect via SSH (port 22)"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "world_power_stations"
}

variable "db_username" {
  description = "Master username for PostgreSQL database"
  type        = string
  default     = "wps_admin"
}

variable "db_password" {
  description = "Master password for PostgreSQL database. If left empty, a secure random password will be auto-generated."
  type        = string
  default     = ""
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class (AWS Free Tier: db.t3.micro or db.t4g.micro)"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS database in GB (AWS Free Tier limit: 20 GB)"
  type        = number
  default     = 20
}

variable "s3_bucket_prefix" {
  description = "Prefix for the S3 bucket storing station photos and user uploads"
  type        = string
  default     = "wps-photos"
}

variable "enable_cloudfront" {
  description = "Whether to provision CloudFront CDN distribution for edge caching and SSL offloading"
  type        = bool
  default     = true
}
