output "ec2_public_ip" {
  description = "Public IPv4 address of the EC2 application host"
  value       = aws_instance.app_server.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS hostname of the EC2 application host"
  value       = aws_instance.app_server.public_dns
}

output "rds_endpoint" {
  description = "Connection endpoint for PostgreSQL database"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_address" {
  description = "Hostname of the PostgreSQL RDS instance"
  value       = aws_db_instance.postgres.address
}

output "rds_port" {
  description = "Port number of the PostgreSQL RDS instance"
  value       = aws_db_instance.postgres.port
}

output "rds_db_name" {
  description = "Database name"
  value       = aws_db_instance.postgres.db_name
}

output "rds_username" {
  description = "Master username for PostgreSQL database"
  value       = aws_db_instance.postgres.username
}

output "s3_photos_bucket" {
  description = "Name of the S3 bucket provisioned for station photos"
  value       = aws_s3_bucket.photos.id
}

output "cloudfront_domain_name" {
  description = "Domain name for CloudFront CDN distribution"
  value       = var.enable_cloudfront && length(aws_cloudfront_distribution.cdn) > 0 ? aws_cloudfront_distribution.cdn[0].domain_name : "N/A (CloudFront disabled)"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidations"
  value       = var.enable_cloudfront && length(aws_cloudfront_distribution.cdn) > 0 ? aws_cloudfront_distribution.cdn[0].id : "N/A"
}

output "app_url" {
  description = "Primary URL to access World Power Stations"
  value       = var.enable_cloudfront && length(aws_cloudfront_distribution.cdn) > 0 ? "https://${aws_cloudfront_distribution.cdn[0].domain_name}" : "http://${aws_instance.app_server.public_ip}"
}

output "ssh_connection_command" {
  description = "Example command to connect to EC2 host via SSH (if key provided)"
  value       = "ssh -i <your-key.pem> ubuntu@${aws_instance.app_server.public_ip}"
}
