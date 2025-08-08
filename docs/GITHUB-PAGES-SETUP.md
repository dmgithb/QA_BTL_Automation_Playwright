# 🚀 GitHub Pages Deployment Setup Guide

## 🔧 **Fix for GitHub Pages Deployment Error**

If you're seeing this error:
```
remote: Write access to repository not granted.
fatal: unable to access 'https://github.com/jibinjoyqa/btl-playwright-automation.git/': The requested URL returned error: 403
Error: Action failed with "The process '/usr/bin/git' failed with exit code 128"
```

This guide will help you fix the GitHub Pages deployment permissions.

---

## 🛠️ **Step 1: Repository Settings Configuration**

### Enable GitHub Pages in Repository Settings

1. **Go to your repository**: `https://github.com/jibinjoyqa/btl-playwright-automation`

2. **Navigate to Settings**:
   - Click on the "Settings" tab in your repository
   - Scroll down to the "Pages" section in the left sidebar

3. **Configure Pages Source**:
   ```
   Source: GitHub Actions
   ```
   - Select "GitHub Actions" instead of "Deploy from a branch"
   - This enables the new GitHub Pages deployment method

4. **Save the configuration**

---

## 🔒 **Step 2: Workflow Permissions Setup**

### Configure Repository Actions Permissions

1. **Go to Settings → Actions → General**

2. **Set Workflow Permissions**:
   ```
   ✅ Read and write permissions
   ✅ Allow GitHub Actions to create and approve pull requests
   ```

3. **Alternative: Use Token Permissions** (Recommended)
   - Keep "Read repository contents permission" 
   - The updated workflow now uses proper permissions tokens

---

## 📝 **Step 3: Updated Workflow Configuration**

The workflow has been updated to use the new GitHub Pages deployment method:

### Key Changes Made:

```yaml
report:
  permissions:
    contents: read      # Read repository contents
    pages: write       # Write to GitHub Pages
    id-token: write    # Write ID tokens

  steps:
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload Pages artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./allure-report
        
    - name: Deploy to GitHub Pages
      uses: actions/deploy-pages@v4
```

### Benefits of New Approach:
- ✅ **More Secure**: Uses OIDC tokens instead of personal access tokens
- ✅ **Better Permissions**: Granular permissions for specific actions
- ✅ **Automatic Setup**: No manual token creation required
- ✅ **Official Method**: GitHub's recommended approach

---

## 🚀 **Step 4: Verify Deployment**

### Test the Fixed Pipeline

1. **Trigger a new workflow run**:
   ```bash
   # Make a small change and push
   git add .
   git commit -m "fix: update GitHub Pages deployment configuration"
   git push origin main
   ```

2. **Monitor the workflow**:
   - Go to Actions tab in your repository
   - Watch the "Playwright Tests" workflow
   - Check the "report" job specifically

3. **Verify Pages deployment**:
   - After successful run, go to Settings → Pages
   - Your site URL will be displayed: `https://jibinjoyqa.github.io/btl-playwright-automation/`

---

## 📊 **Step 5: Access Your Test Reports**

Once deployed successfully, you can access:

### 🎯 **Live Test Reports**
- **Main URL**: `https://jibinjoyqa.github.io/btl-playwright-automation/`
- **Direct Allure Report**: `https://jibinjoyqa.github.io/btl-playwright-automation/index.html`

### 📈 **What You'll See**
- **📊 Test Execution Summary**: Pass/fail rates, execution times
- **🔍 Detailed Test Results**: Step-by-step test execution
- **📸 Screenshots**: Failure screenshots for debugging
- **📹 Videos**: Test execution recordings
- **📝 Logs**: Detailed execution logs
- **📈 Trends**: Test execution trends over time

---

## 🔧 **Troubleshooting**

### 🚨 **404 Error Fix - Step by Step**

If you're seeing a 404 error when accessing `https://jibinjoyqa.github.io/btl-playwright-automation/`, follow these steps:

#### **Step 1: Check GitHub Pages Settings** 🔍
1. Go to: `https://github.com/jibinjoyqa/btl-playwright-automation/settings/pages`
2. **Verify Source is set to "GitHub Actions"**
3. **Check deployment status** - should show recent deployment

#### **Step 2: Enable GitHub Pages** ⚙️
If Pages is not enabled:
```
✅ Source: Select "GitHub Actions" (NOT "Deploy from a branch")
✅ Click "Save"
✅ Wait for the green checkmark
```

#### **Step 3: Check Workflow Permissions** 🔒
1. Go to: `Settings → Actions → General`
2. **Set Workflow permissions**:
   ```
   ✅ Read and write permissions
   ✅ Allow GitHub Actions to create and approve pull requests
   ```
3. Click "Save"

#### **Step 4: Trigger a Test Run** 🚀
```bash
# Create a small change to trigger workflow
git add .
git commit -m "trigger GitHub Pages deployment"
git push origin main
```

#### **Step 5: Monitor Deployment** 👀
1. Go to: `https://github.com/jibinjoyqa/btl-playwright-automation/actions`
2. **Look for "Playwright Tests" workflow**
3. **Check if "report" job completed successfully**
4. **Look for "pages build and deployment" workflow** (this should appear automatically)

### Common Issues and Solutions

#### Issue 1: "Pages build and deployment" workflow not found
**Solution**: 
```yaml
# Ensure this is in your workflow file
permissions:
  contents: read
  pages: write
  id-token: write
```

#### Issue 2: 404 error when accessing pages ⚠️ **YOUR CURRENT ISSUE**
**Root Causes & Solutions**: 

**A) GitHub Pages Not Enabled**
```bash
# Check: Go to Settings → Pages
# Fix: Set Source to "GitHub Actions"
# Wait: 5-10 minutes for activation
```

**B) No Successful Deployment Yet**
```bash
# Check: Actions tab for successful "report" job
# Fix: Ensure workflow completes without errors
# Verify: Look for green checkmark in workflow
```

**C) Content Not Generated**
```bash
# Check: Workflow logs for "Generate Allure report" step
# Fix: Ensure tests are running and generating results
# Debug: Look for allure-report folder in artifacts
```

**D) DNS Propagation Delay**
```bash
# Wait: 10-15 minutes after first successful deployment
# Try: Hard refresh (Ctrl+F5) or incognito mode
# Alternative: Try https://jibinjoyqa.github.io/btl-playwright-automation/index.html
```

#### Issue 3: Deployment succeeds but no content
**Solution**: 
```bash
# Check if allure-report directory has content
- name: Debug report generation
  run: |
    ls -la allure-report/
    find allure-report -type f -name "*.html" | head -5
```

#### Issue 4: Permissions still denied
**Solution**: 
1. Go to Settings → Actions → General
2. Set "Workflow permissions" to "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"

### 🔬 **Debug Your Specific 404 Issue**

#### **Immediate Checks** (Do these now):

1. **Verify Pages Status**:
   ```
   URL: https://github.com/jibinjoyqa/btl-playwright-automation/settings/pages
   
   Should Show:
   ✅ "Your site is published at https://jibinjoyqa.github.io/btl-playwright-automation/"
   ✅ Source: GitHub Actions
   ✅ Recent deployment timestamp
   ```

2. **Check Latest Workflow**:
   ```
   URL: https://github.com/jibinjoyqa/btl-playwright-automation/actions
   
   Look For:
   ✅ "Playwright Tests" workflow with green checkmark
   ✅ "pages build and deployment" workflow
   ✅ Recent successful run
   ```

3. **Verify Deployment Artifacts**:
   ```
   In workflow artifacts, look for:
   ✅ allure-report folder
   ✅ index.html file
   ✅ Non-empty report content
   ```

#### **Force Deployment** (Try this):

```bash
# Method 1: Push empty commit to trigger workflow
git commit --allow-empty -m "force GitHub Pages deployment"
git push origin main

# Method 2: Modify a file to trigger
echo "# Updated $(date)" >> README.md
git add README.md
git commit -m "trigger deployment - fix 404"
git push origin main
```

#### **Alternative Access Methods** (While fixing):

```bash
# Try these URLs:
1. https://jibinjoyqa.github.io/btl-playwright-automation/
2. https://jibinjoyqa.github.io/btl-playwright-automation/index.html

# If still 404, use GitHub Actions artifacts:
1. Go to Actions → Latest run → Artifacts
2. Download "playwright-report-*" 
3. Extract and open index.html locally
```

---

## 🎯 **Alternative: Manual Token Method** (If needed)

If the automatic method doesn't work, you can use a personal access token:

### Create Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with these permissions:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)

### Add Token to Repository Secrets
1. Go to repository Settings → Secrets and variables → Actions
2. Add new secret:
   - Name: `GITHUB_TOKEN_CUSTOM`
   - Value: Your personal access token

### Update Workflow (if using custom token)
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  if: github.ref == 'refs/heads/main'
  with:
    github_token: ${{ secrets.GITHUB_TOKEN_CUSTOM }}
    publish_dir: ./allure-report
```

---

## 📚 **Additional Resources**

- **GitHub Pages Documentation**: [docs.github.com/pages](https://docs.github.com/en/pages)
- **GitHub Actions Permissions**: [docs.github.com/actions/security](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- **Allure Reporting**: [allurereport.org](https://allurereport.org/)

---

## ✅ **Success Checklist**

After following this guide, you should have:

- ✅ GitHub Pages enabled with "GitHub Actions" source
- ✅ Proper workflow permissions configured
- ✅ Updated workflow file with new deployment method
- ✅ Successful workflow execution without permission errors
- ✅ Live test reports accessible at your GitHub Pages URL
- ✅ Automatic deployment on every push to main branch

Your test reports will now be automatically deployed and accessible to your team! 🎉

---

**Need Help?** Check the [Framework FAQ](./FRAMEWORK-FAQ.md) or create an issue in the repository.
