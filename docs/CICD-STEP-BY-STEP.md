# 🚀 Complete CI/CD Setup - From Zero to Hero

## Step 1: Initialize Git Repository

First, let's set up Git for your project:

### 1.1 Initialize Git
```bash
git init
```

### 1.2 Add all files to Git
```bash
git add .
```

### 1.3 Create initial commit
```bash
git commit -m "Initial commit: Playwright automation framework with security"
```

## Step 2: Create GitHub Repository

### 2.1 Go to GitHub
1. Open [github.com](https://github.com) in your browser
2. Sign in (or create account if you don't have one)
3. Click the "+" icon → "New repository"

### 2.2 Repository Settings
- **Repository name**: `btl-playwright-automation`
- **Description**: `Playwright automation framework for Bulktainer Logistics ERP System`
- **Visibility**: Private (recommended for business projects)
- **DO NOT** initialize with README, .gitignore, or license (we already have these)

### 2.3 Connect Local Repository to GitHub
After creating the repository, GitHub will show you commands like:
```bash
git remote add origin https://github.com/YOUR_USERNAME/btl-playwright-automation.git
git branch -M main
git push -u origin main
```

## Step 3: GitHub Actions Setup

### 3.1 Create GitHub Actions Workflow
We'll create a workflow file that runs your tests automatically.

### 3.2 Workflow Features
- ✅ Run tests on every push and pull request
- ✅ Test on multiple browsers (Chromium, Firefox, WebKit)
- ✅ Generate test reports
- ✅ Send notifications on failure
- ✅ Secure credential management

## Step 4: Configure Secrets

### 4.1 Add Repository Secrets
In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value | Description |
|-------------|--------|-------------|
| `TEST_USER_USERNAME` | `jibin` | Your test username |
| `TEST_USER_PASSWORD` | `Jerrin@123` | Your test password |
| `BASE_URL` | `https://training.bt-ms.com/MAIN-STAGE/erp.php` | Application URL |

### 4.2 Why Secrets?
- 🔒 **Security**: Credentials are encrypted and never exposed
- 🔄 **Easy Updates**: Change credentials without touching code
- 👥 **Team Access**: Share access without sharing passwords

---

## Ready to Start? 

Let's begin with Step 1! 🎯
