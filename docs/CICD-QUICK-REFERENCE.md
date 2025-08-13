# 🚀 CI/CD Quick Reference

## Essential Commands

```bash
# Local Development
npm test                    # Run critical tests
npm run test:smoke         # Run smoke tests  
npm run test:regression    # Run regression tests
npm run test:headed        # Run with browser visible
npm run test:debug         # Debug mode
npm run clean              # Clean all reports

# BDD/Cucumber Tests
npm run bdd                # All BDD tests
npm run bdd:smoke          # BDD smoke tests
npm run bdd:critical       # BDD critical tests

# Reports
npm run show-report        # Open HTML report
npm run allure:generate    # Generate Allure report
npm run allure:serve       # Serve Allure report
```

## GitHub Actions Triggers

| Trigger | Tests Run | Duration | Purpose |
|---------|-----------|----------|---------|
| Push to main | Smoke | ~5 min | Fast feedback |
| Pull Request | Smoke + Regression | ~15 min | Code quality |
| Nightly (2 AM) | Full Suite | ~45 min | Comprehensive |
| Manual Dispatch | Custom | Variable | On-demand |

## Pipeline Status Indicators

| Status | Meaning | Action Required |
|--------|---------|----------------|
| ✅ All green | Tests passing | None - good to merge |
| ⚠️ Yellow | Some tests failed | Review failures |
| ❌ Red | Critical failure | Fix before merge |
| 🔄 Blue | Running | Wait for completion |

## Quick Troubleshooting

### Pipeline Fails Locally Works
1. Check environment variables
2. Verify Node.js version (18+)
3. Check browser versions
4. Review timeout settings

### Tests Are Flaky
1. Add explicit waits
2. Improve selectors
3. Handle race conditions
4. Check for data dependencies

### Reports Not Generated
1. Verify GitHub Pages enabled
2. Check artifact uploads
3. Review Allure configuration
4. Confirm permissions

## Test Tags Reference

| Tag | Purpose | When Run |
|-----|---------|----------|
| `@smoke` | Critical paths | Every commit |
| `@critical` | Core functionality | Every commit |
| `@regression` | Full functionality | Pull requests |
| `@extended` | Extended coverage | Nightly |
| `@performance` | Performance tests | Scheduled |

## Environment Setup

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Required variables
BASE_URL=https://your-app-url.com
TEST_USER_USERNAME=your_username
TEST_USER_PASSWORD=your_password

# 3. Install and run
npm install
npm run install:browsers
npm test
```

## GitHub Secrets Required

```
STAGING_BASE_URL          # Staging environment URL
PRODUCTION_BASE_URL       # Production environment URL
TEST_USER_USERNAME        # Test user credentials
TEST_USER_PASSWORD        # Test user password
ADMIN_USERNAME           # Admin credentials
ADMIN_PASSWORD           # Admin password
```

## Report Access

- **Live Reports**: https://dmgithb.github.io/QA_BTL_Automation_Playwright/
- **Build Artifacts**: GitHub Actions → Workflow → Artifacts
- **PR Comments**: Automated summary on pull requests

## Performance Targets

| Metric | Target | Purpose |
|--------|--------|---------|
| Smoke Tests | < 10 min | Fast feedback |
| Regression | < 30 min | Reasonable wait |
| Full Suite | < 60 min | Comprehensive coverage |
| Pass Rate | > 95% | Stable tests |
| Flaky Rate | < 5% | Reliable results |

## Best Practice Checklist

- [ ] Tests have proper tags
- [ ] Environment variables used (no hardcoded values)
- [ ] GitHub Secrets configured
- [ ] GitHub Pages enabled
- [ ] Branch protection rules set
- [ ] Notifications configured
- [ ] Regular dependency updates

## Quick Links

- [Full CI/CD Best Practices](./CICD-BEST-PRACTICES.md)
- [Implementation Guide](./CICD-IMPLEMENTATION-GUIDE.md)
- [Framework FAQ](./FRAMEWORK-FAQ.md)
- [Security Guide](./SECURITY.md)
