# RDS Subnet Group (encompassing isolated private subnets)
resource "aws_db_subnet_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-subnet-group"
  description = "Database subnet group across private subnets"
  subnet_ids  = aws_subnet.private[*].id

  tags = {
    Name = "${var.project_name}-${var.environment}-rds-subnet-group"
  }
}

# Auto-generate secure database password if not supplied in variables
resource "random_password" "db_password" {
  length           = 24
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

locals {
  db_password = var.db_password != "" ? var.db_password : random_password.db_password.result
}

# Parameter Group for PostgreSQL 16
resource "aws_db_parameter_group" "postgres16" {
  name        = "${var.project_name}-${var.environment}-pg16-params"
  family      = "postgres16"
  description = "Custom parameter group for PostgreSQL 16"

  parameter {
    name  = "rds.force_ssl"
    value = "0"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-pg16-params"
  }
}

# Amazon RDS PostgreSQL 16 Instance (AWS Free Tier: db.t3.micro, 20GB Storage)
resource "aws_db_instance" "postgres" {
  identifier                  = "${var.project_name}-${var.environment}-postgres"
  engine                      = "postgres"
  engine_version              = "16.3"
  instance_class              = var.db_instance_class
  allocated_storage           = var.db_allocated_storage
  max_allocated_storage       = var.db_allocated_storage # Free Tier safety: prevents billing surprises
  storage_type                = "gp2"
  db_name                     = var.db_name
  username                    = var.db_username
  password                    = local.db_password
  db_subnet_group_name        = aws_db_subnet_group.rds.name
  vpc_security_group_ids      = [aws_security_group.rds_sg.id]
  parameter_group_name        = aws_db_parameter_group.postgres16.name
  publicly_accessible         = false
  multi_az                    = false # Free Tier requirement
  skip_final_snapshot         = true
  deletion_protection         = false
  backup_retention_period     = 1
  auto_minor_version_upgrade  = true
  allow_major_version_upgrade = false

  tags = {
    Name = "${var.project_name}-${var.environment}-postgres"
  }
}
