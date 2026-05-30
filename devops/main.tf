terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "production"
}

# ==========================================
# VPC Networking Infrastructure
# ==========================================
resource "aws_vpc" "amdox_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name        = "amdox-vpc-${var.environment}"
    Environment = var.environment
  }
}

# Subnets
resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.amdox_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"
  tags = {
    Name = "amdox-public-1"
  }
}

resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.amdox_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"
  tags = {
    Name = "amdox-private-1"
  }
}

# ==========================================
# Amazon RDS PostgreSQL Database
# ==========================================
resource "aws_db_subnet_group" "db_subnet" {
  name       = "amdox-db-subnet"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.public_1.id] # Simplification for example
}

resource "aws_db_instance" "postgres" {
  identifier             = "amdox-db"
  allocated_storage      = 20
  max_allocated_storage  = 100
  db_name                = "amdox_erp"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = "db.t4g.micro"
  username               = "amdox_admin"
  password               = "SuperSecretPassword123"
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name
  skip_final_snapshot    = true
}

# ==========================================
# AWS ElastiCache Redis
# ==========================================
resource "aws_elasticache_subnet_group" "redis_subnet" {
  name       = "amdox-redis-subnet"
  subnet_ids = [aws_subnet.private_1.id]
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "amdox-redis"
  engine               = "redis"
  node_type            = "cache.t4g.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet.name
  port                 = 6379
}

# ==========================================
# Amazon S3 for Storage
# ==========================================
resource "aws_s3_bucket" "storage" {
  bucket        = "amdox-erp-assets-bucket-${var.environment}"
  force_destroy = true
}

# ==========================================
# Amazon EKS Cluster (Kubernetes Engine)
# ==========================================
resource "aws_iam_role" "eks_cluster_role" {
  name = "amdox-eks-cluster-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}

resource "aws_eks_cluster" "eks" {
  name     = "amdox-eks-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.public_1.id, aws_subnet.private_1.id]
  }
}
