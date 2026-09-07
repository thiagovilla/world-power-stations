# Random suffix for unique S3 bucket naming
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3 Bucket for Station Photos & User Uploads (AWS Free Tier: 5 GB Storage)
resource "aws_s3_bucket" "photos" {
  bucket        = "${var.s3_bucket_prefix}-${var.environment}-${random_id.bucket_suffix.hex}"
  force_destroy = false

  tags = {
    Name = "${var.project_name}-${var.environment}-photos"
  }
}

# Block Public Access (Enforce CloudFront Origin Access Control / Presigned URLs)
resource "aws_s3_bucket_public_access_block" "photos" {
  bucket = aws_s3_bucket.photos.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Versioning (Suspended or Enabled for staging/production safety)
resource "aws_s3_bucket_versioning" "photos" {
  bucket = aws_s3_bucket.photos.id

  versioning_configuration {
    status = "Enabled"
  }
}

# CORS Configuration for direct uploads & browser requests
resource "aws_s3_bucket_cors_configuration" "photos" {
  bucket = aws_s3_bucket.photos.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
