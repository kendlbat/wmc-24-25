# ANSWERS

## Container Vulnerabilities

-   Misconfigurations
-   Hard-coded secrets
-   Vulnerable application code
-   Vulnerable dependencies (images, libraries, etc.)

Container security scanning is used to identify vulnerabilities in container images. Files, packages and dependencies are scanned and containers activity is monitored for unusual behavior.

Some tools are:

-   `ggshield`
-   `SecretScanner`
-   `trivy`

## `trivy` - Tool

`trivy` is a container vulnerability scanner. Some ways trivy can be used:

-   Vulnerability Scanning
    Container images and dependencies are scanned for known vulnerabilities.

-   Configuration Scanning
    Dockerfiles, Kubernetes Manifests, etc. are scanned for security issues and misconfigurations.

-   Infrastructure as Code Scanning
    IaC configurations such as Terraform can be scanned for infrastructure configuration issues.

-   File System Scanning
    File systems can be scanned for vulnerabilities and malware.

-   Git Repository Scanning
    Git repositories can be scanned for secrets, insecure dependencies, etc.

The following top vulnerabilities from the OWASP top 10 can be mitigated by using `trivy`:

-   A01 - Broken Access Control
    by finding configuration issues that allow unauthorized access.
-   A02 - Cryptographic Failures
    by detecting outdated or insecure cryptographic libraries or configurations.
-   A03 - Injection
    by finding vulnerable dependencies that can be exploited.
-   A04 - Insecure Design
-   A05 - Security Misconfiguration
-   A06 - Vulnerable and Outdated Components

## Software Bill of Materials (SBOM)

A bill of materials describes all dependencies and components of the application. This can be used to track and manage vulnerable dependencies across the entire software supply chain.
