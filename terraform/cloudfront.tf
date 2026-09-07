# CloudFront Origin Access Control (OAC) for S3 Photos Bucket
resource "aws_cloudfront_origin_access_control" "s3_oac" {
  count                             = var.enable_cloudfront ? 1 : 0
  name                              = "${var.project_name}-${var.environment}-s3-oac"
  description                       = "Origin Access Control for WPS Photos S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution (Always Free Tier: 1 TB data transfer / 10M requests)
resource "aws_cloudfront_distribution" "cdn" {
  count   = var.enable_cloudfront ? 1 : 0
  enabled = true
  comment = "World Power Stations CloudFront Edge Distribution"

  # Origin 1: EC2 Application Origin (Port 80)
  origin {
    domain_name = aws_instance.app_server.public_dns != "" ? aws_instance.app_server.public_dns : aws_instance.app_server.public_ip
    origin_id   = "EC2-${aws_instance.app_server.id}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Origin 2: S3 Photo Storage Origin
  origin {
    domain_name              = aws_s3_bucket.photos.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.photos.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac[0].id
  }

  # Default Cache Behavior (Routes to Remix SSR / EC2 Gateway)
  default_cache_behavior {
    target_origin_id       = "EC2-${aws_instance.app_server.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]

    # Forward all headers, cookies, and query strings required by Remix dynamic SSR
    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 86400
    compress    = true
  }

  # Ordered Cache Behavior for Static / Uploaded Photos (/photos/*)
  ordered_cache_behavior {
    path_pattern           = "/photos/*"
    target_origin_id       = "S3-${aws_s3_bucket.photos.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]

      cookies {
        forward = "none"
      }
    }

    min_ttl     = 3600
    default_ttl = 86400
    max_ttl     = 31536000
    compress    = true
  }

  price_class = "PriceClass_100" # NA and Europe (Standard Free Tier coverage)

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-cloudfront"
  }
}

# S3 Bucket Policy allowing CloudFront OAC access
resource "aws_s3_bucket_policy" "allow_cloudfront" {
  count  = var.enable_cloudfront ? 1 : 0
  bucket = aws_s3_bucket.photos.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipalReadOnly"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.photos.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn[0].arn
          }
        }
      }
    ]
  })
}
