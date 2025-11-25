# Terraform + AWS setting
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.3.0"
}

provider "aws" {
  region = "ap-northeast-1"
}

# S3
resource "aws_s3_bucket" "frontend" {
  bucket        = "hccg-hotel-dashboard-frontend"
  force_destroy = true
}

# 開啟 Static Website Hosting，index.html 當首頁
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "frontend_public" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowPublicRead"
        Effect    = "Allow"
        Principal = "*"
        Action    = [ "s3:GetObject" ]
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

output "s3_website_url" {
  description = "S3 portal URL"
  value       = aws_s3_bucket.frontend.website_endpoint
}