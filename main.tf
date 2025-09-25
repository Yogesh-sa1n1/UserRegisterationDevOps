provider "aws"{
    region= "us-east-1"
}

resource "random_id" "suffix"{
    byte_length = 2
}

resource "aws_security_group" "securityGroup"{
    name= "GithubAction-${random_id.suffix.hex}"
    description = "allow ssh access and tcp"

    # Ingress rules using for_each
  dynamic "ingress" {
    for_each = {
      ssh  = { from = 22, to = 22, protocol = "tcp" }
      http = { from = 80, to = 80, protocol = "tcp" }
      https = { from = 443, to = 443, protocol = "tcp" }
      tcp = {from =3000, to=3000, protocol="tcp"}
    }

    content {
      from_port   = ingress.value.from
      to_port     = ingress.value.to
      protocol    = ingress.value.protocol
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  # Egress - allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "tls_private_key" "KeyPair"{
    algorithm = "RSA"
    rsa_bits = 4096
}

resource "aws_key_pair" "generated_key"{
    key_name = "githubAction-${random_id.suffix.hex}"
    public_key = tls_private_key.KeyPair.public_key_openssh
}

resource "aws_instance" "ec2_instance" {
    ami ="ami-0360c520857e3138f"
    instance_type = "t2.micro"
    key_name = aws_key_pair.generated_key.key_name
    vpc_security_group_ids = [aws_security_group.securityGroup.id]
      user_data = base64encode(templatefile("${path.module}/user_data.sh.tmpl",{}))
    tags = {
        Name ="GitHubAction"
        Team = "Dev"
}
}


