# Test Execution Strategy and Configuration

## Test Grouping and Prioritization

### 🔥 Critical Tests (@critical @smoke)
**Purpose**: Essential functionality that must work for basic system operation
**Frequency**: Run on every build/deployment
**Execution Time**: ~3-5 minutes

```bash
# Run only critical tests (normal execution)
npx playwright test --grep "@critical"

# Run smoke tests (subset of critical)
npx playwright test --grep "@smoke"
```

**Tests Included**:
- Navigation to Users Info page
- Core user creation with Factory pattern
- Email domain validation (@digitalmesh.com)

### 🧪 Regression Tests (@regression)
**Purpose**: Department-specific and feature validation tests
**Frequency**: Run during feature development and release cycles
**Execution Time**: ~10-15 minutes

```bash
# Run regression test suite
npx playwright test --grep "@regression"

# Run department-specific tests
npx playwright test --grep "@department"
```

**Tests Included**:
- IT department user creation
- Commercial department user creation
- Static test data validation

### 🔬 Extended Tests (@extended)
**Purpose**: Edge cases, UI validations, and comprehensive testing
**Frequency**: Run during full test cycles and before major releases
**Execution Time**: ~20-30 minutes

```bash
# Run extended test suite
npx playwright test --grep "@extended"

# Run checkbox-specific tests
npx playwright test --grep "@checkbox"
```

**Tests Included**:
- Checkbox validation
- Form validation edge cases
- Complex user scenarios

## Execution Patterns

### 1. Developer Workflow (Daily)
```bash
# Quick validation during development
npx playwright test --grep "@critical" --project=chromium
```

### 2. Pull Request Validation
```bash
# Standard PR validation
npx playwright test --grep "@critical|@regression" --project=chromium
```

### 3. Nightly Build
```bash
# Comprehensive testing
npx playwright test --grep "@critical|@regression|@extended"
```

### 4. Release Validation
```bash
# Full test suite across all browsers
npx playwright test
```

## Tag Strategy

### Priority Tags
- `@critical` - Must pass for basic functionality
- `@smoke` - Quick validation of core features
- `@regression` - Feature-specific validation
- `@extended` - Comprehensive edge case testing

### Feature Tags
- `@navigation` - Navigation functionality
- `@factory` - Factory pattern tests
- `@email` - Email domain validation
- `@department` - Department-specific tests
- `@checkbox` - Form checkbox validation

### Component Tags
- `@user-management` - User management module
- `@login` - Authentication tests
- `@data-validation` - Test data validation

## Best Practices

1. **Normal Execution**: Run only `@critical` tests
2. **CI/CD Integration**: Use different tag combinations for different pipeline stages
3. **Performance**: Critical tests should complete in under 5 minutes
4. **Maintainability**: Each tag group should be independently runnable
5. **Coverage**: Ensure critical path coverage with minimal test count
