# Security Best Practices for Credential Management

## Overview
This document outlines the security best practices implemented in the Playwright automation framework for secure credential management and test data handling.

## Environment Variables Setup

### 1. Environment File Configuration
Copy the `.env.template` file to `.env` and fill in your actual credentials:

```bash
cp .env.template .env
```

### 2. Required Environment Variables
Ensure the following environment variables are set in your `.env` file:

```env
# Primary test credentials
TEST_USER_USERNAME=your_username_here
TEST_USER_PASSWORD=your_password_here

# Role-specific credentials (optional)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
MANAGER_USERNAME=your_manager_username
MANAGER_PASSWORD=your_manager_password
REGULAR_USER_USERNAME=your_regular_user_username
REGULAR_USER_PASSWORD=your_regular_user_password

# Application configuration
BASE_URL=https://training.bt-ms.com/MAIN-STAGE/erp.php
DEFAULT_EMAIL_DOMAIN=digitalmesh.com
```

## Security Implementation

### 1. Credential Storage
- ✅ **Secure**: Credentials stored in environment variables
- ❌ **Insecure**: Hardcoded credentials in test files
- ❌ **Insecure**: Credentials committed to version control

### 2. Environment Variable Usage
The framework automatically loads credentials from environment variables using:

```typescript
// Get credentials securely
const credentials = TestDataManager.getSecureCredentials('admin');
const { username, password } = credentials;

// Get credentials through configuration
const config = EnvironmentConfig.getInstance();
const testCredentials = config.getCredentials('test');
```

### 3. Test Data Files
Test data files now use environment variable placeholders:

```json
{
  "validUsers": [
    {
      "username": "${TEST_USER_USERNAME}",
      "password": "${TEST_USER_PASSWORD}",
      "role": "administrator"
    }
  ]
}
```

## CI/CD Security

### 1. Environment Variable Setup in CI/CD
Set the following secrets/environment variables in your CI/CD pipeline:

**GitHub Actions:**
```yaml
env:
  TEST_USER_USERNAME: ${{ secrets.TEST_USER_USERNAME }}
  TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
  BASE_URL: ${{ secrets.BASE_URL }}
  DEFAULT_EMAIL_DOMAIN: digitalmesh.com
```

**Azure DevOps:**
```yaml
variables:
  - name: TEST_USER_USERNAME
    value: $(TEST_USER_USERNAME)
  - name: TEST_USER_PASSWORD
    value: $(TEST_USER_PASSWORD)
```

### 2. Pipeline Configuration
Ensure your pipeline loads environment variables before running tests:

```yaml
- name: Run Tests
  run: |
    export TEST_USER_USERNAME="${{ secrets.TEST_USER_USERNAME }}"
    export TEST_USER_PASSWORD="${{ secrets.TEST_USER_PASSWORD }}"
    npm test
```

## Local Development Security

### 1. .env File Management
- ✅ Never commit `.env` files to version control
- ✅ Use `.env.template` for sharing required variables
- ✅ Add `.env` to `.gitignore`

### 2. Credential Rotation
Regularly rotate test credentials and update:
- Local `.env` files
- CI/CD pipeline secrets
- Shared team credential stores

## Framework Usage

### 1. Getting Credentials in Tests
```typescript
import { TestDataManager } from '../src/utils/test-data-manager';
import { EnvironmentConfig } from '../src/utils/environment-config';

// Method 1: Direct from TestDataManager
const credentials = TestDataManager.getSecureCredentials('admin');

// Method 2: Through EnvironmentConfig
const config = EnvironmentConfig.getInstance();
const testCreds = config.getCredentials('test');

// Method 3: Secure test data with substitution
const loginData = await TestDataManager.getSecureTestData('login-data', 'validUsers');
```

### 2. Validation
Validate environment configuration before running tests:

```typescript
const validation = TestDataManager.validateEnvironmentConfig();
if (!validation.isValid) {
  throw new Error(`Missing environment variables: ${validation.missingVars.join(', ')}`);
}
```

## Security Checklist

### Before Committing Code
- [ ] No hardcoded credentials in test files
- [ ] Environment variables used for sensitive data
- [ ] `.env` file added to `.gitignore`
- [ ] Only `.env.template` committed to repository

### Setting Up New Environment
- [ ] Copy `.env.template` to `.env`
- [ ] Fill in actual credential values
- [ ] Validate environment configuration
- [ ] Test credential loading before running tests

### CI/CD Setup
- [ ] All required secrets configured in pipeline
- [ ] Environment variables loaded in pipeline steps
- [ ] No credentials exposed in logs
- [ ] Secure credential rotation process in place

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```
   Error: Credentials not found for user type: test
   ```
   **Solution**: Ensure `TEST_USER_USERNAME` and `TEST_USER_PASSWORD` are set in `.env`

2. **Environment File Not Loading**
   ```
   Error: Environment variable ${TEST_USER_USERNAME} not found
   ```
   **Solution**: Check that `.env` file exists and `dotenv.config()` is called

3. **CI/CD Pipeline Failures**
   ```
   Error: Missing environment variables: TEST_USER_USERNAME, TEST_USER_PASSWORD
   ```
   **Solution**: Configure secrets in your CI/CD platform

### Debug Commands
```bash
# Check if environment variables are loaded
node -e "require('dotenv').config(); console.log(process.env.TEST_USER_USERNAME)"

# Validate environment configuration
npm run test:config-validation
```

## Security Contact
For security-related questions or to report vulnerabilities, contact the development team.

---

**Remember**: Security is everyone's responsibility. Always follow these practices to keep our test environment secure.
