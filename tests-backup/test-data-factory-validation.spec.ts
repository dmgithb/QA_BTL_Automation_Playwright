import { test, expect } from '../src/fixtures/test-fixtures';
import { TestDataFactory } from '../src/utils/test-data-factory';
import { TestDataManager } from '../src/utils/test-data-manager';

test.describe('TestDataFactory Validation - Best Practices Implementation', () => {
  
  test('Verify departments are loaded from test data (not hardcoded)', async ({ logger }) => {
    logger.step('Testing department data source validation');
    
    // Load departments directly from JSON
    const testData = await TestDataManager.readJsonData('user-management-data');
    const expectedDepartments = testData.departments;
    
    // Get departments from factory
    const factoryDepartments = await TestDataFactory.getValidDepartments();
    
    // Verify they match exactly
    expect(factoryDepartments).toEqual(expectedDepartments);
    expect(factoryDepartments.length).toBe(expectedDepartments.length);
    
    logger.step(`✓ Factory uses test data departments: ${factoryDepartments.length} departments loaded`);
  });

  test('Verify random department selection uses valid departments', async ({ logger }) => {
    logger.step('Testing random department selection');
    
    const validDepartments = await TestDataFactory.getValidDepartments();
    
    // Test multiple random selections
    for (let i = 0; i < 10; i++) {
      const randomDept = await TestDataFactory.getRandomDepartment();
      
      expect(validDepartments).toContain(randomDept);
      logger.step(`✓ Random department ${i + 1}: ${randomDept} is valid`);
    }
  });

  test('Verify generateUserData uses departments from test data', async ({ logger }) => {
    logger.step('Testing user data generation with test data departments');
    
    const validDepartments = await TestDataFactory.getValidDepartments();
    
    // Generate multiple users
    for (let i = 0; i < 5; i++) {
      const userData = await TestDataFactory.generateUserData();
      
      expect(validDepartments).toContain(userData.department);
      expect(userData.email).toMatch(/@digitalmesh\.com$/);
      expect(userData.sendingInstructionsEmail).toMatch(/@digitalmesh\.com$/);
      
      logger.step(`✓ User ${i + 1}: Department '${userData.department}' is valid`);
    }
  });

  test('Verify department-specific user generation', async ({ logger }) => {
    logger.step('Testing department-specific user generation');
    
    const validDepartments = await TestDataFactory.getValidDepartments();
    
    // Test each department
    for (const department of validDepartments.slice(0, 3)) { // Test first 3 departments
      const userData = await TestDataFactory.generateUserForDepartment(department);
      
      expect(userData.department).toBe(department);
      expect(userData.email).toMatch(/@digitalmesh\.com$/);
      
      logger.step(`✓ Generated user for department: ${department}`);
    }
  });

  test('Verify invalid department handling', async ({ logger }) => {
    logger.step('Testing invalid department error handling');
    
    const invalidDepartment = 'InvalidDept123';
    
    // Should throw error for invalid department
    await expect(async () => {
      await TestDataFactory.generateUserForDepartment(invalidDepartment);
    }).rejects.toThrow(`Invalid department: ${invalidDepartment}`);
    
    logger.step('✓ Invalid department properly rejected');
  });

  test('Verify multiple user generation with random departments', async ({ logger }) => {
    logger.step('Testing multiple user generation');
    
    const userCount = 5;
    const users = await TestDataFactory.generateMultipleUsers(userCount);
    const validDepartments = await TestDataFactory.getValidDepartments();
    
    expect(users).toHaveLength(userCount);
    
    for (const user of users) {
      expect(validDepartments).toContain(user.department);
      expect(user.email).toMatch(/@digitalmesh\.com$/);
      expect(user.username).toBeDefined();
      expect(user.password).toBeDefined();
      expect(user.confirmPassword).toBe(user.password);
    }
    
    logger.step(`✓ Generated ${userCount} users with valid departments`);
  });

  test('Verify user data validation function', async ({ logger }) => {
    logger.step('Testing user data validation');
    
    // Test valid user data
    const validUser = await TestDataFactory.generateUserData();
    const validResult = await TestDataFactory.validateUserData(validUser);
    
    expect(validResult.isValid).toBeTruthy();
    expect(validResult.errors).toHaveLength(0);
    
    // Test invalid user data
    const invalidUser = {
      fullName: '',
      username: '',
      email: 'invalid@wrongdomain.com',
      department: 'InvalidDepartment',
      password: ''
    };
    
    const invalidResult = await TestDataFactory.validateUserData(invalidUser);
    
    expect(invalidResult.isValid).toBeFalsy();
    expect(invalidResult.errors.length).toBeGreaterThan(0);
    
    logger.step('✓ User data validation working correctly');
  });

  test('Verify email domain compliance (@digitalmesh.com)', async ({ logger }) => {
    logger.step('Testing @digitalmesh.com email domain compliance');
    
    // Generate multiple users and verify all use correct domain
    for (let i = 0; i < 10; i++) {
      const userData = await TestDataFactory.generateUserData();
      
      expect(userData.email).toMatch(/@digitalmesh\.com$/);
      expect(userData.sendingInstructionsEmail).toMatch(/@digitalmesh\.com$/);
      
      // Verify validation catches wrong domains
      const validation = await TestDataFactory.validateUserData({
        ...userData,
        email: 'test@wrongdomain.com'
      });
      
      expect(validation.isValid).toBeFalsy();
      expect(validation.errors).toContain('Email must use @digitalmesh.com domain: test@wrongdomain.com');
    }
    
    logger.step('✓ Email domain compliance verified');
  });

  test('Verify validation test data integration', async ({ logger }) => {
    logger.step('Testing validation test data integration');
    
    // Test loading validation test cases
    const missingFieldsTest = await TestDataFactory.generateValidationTestData('Missing required fields');
    expect(missingFieldsTest.testCase).toBe('Missing required fields');
    expect(missingFieldsTest.expectedResult).toBe('validation_error');
    
    const invalidEmailTest = await TestDataFactory.generateValidationTestData('Invalid email format');
    expect(invalidEmailTest.testCase).toBe('Invalid email format');
    
    const passwordMismatchTest = await TestDataFactory.generateValidationTestData('Password mismatch');
    expect(passwordMismatchTest.testCase).toBe('Password mismatch');
    
    logger.step('✓ Validation test data integration working');
  });

  test('Verify department validation function', async ({ logger }) => {
    logger.step('Testing department validation function');
    
    const validDepartments = await TestDataFactory.getValidDepartments();
    
    // Test valid departments
    for (const dept of validDepartments.slice(0, 3)) {
      const isValid = await TestDataFactory.isValidDepartment(dept);
      expect(isValid).toBeTruthy();
    }
    
    // Test invalid department
    const isInvalid = await TestDataFactory.isValidDepartment('InvalidDept');
    expect(isInvalid).toBeFalsy();
    
    logger.step('✓ Department validation function working correctly');
  });

  test('Verify access permissions integration', async ({ logger }) => {
    logger.step('Testing access permissions integration');
    
    const permissions = await TestDataFactory.getValidAccessPermissions();
    expect(permissions).toContain('Full Access');
    
    const userData = await TestDataFactory.generateUserData();
    expect(permissions).toContain(userData.accessPermission);
    
    logger.step('✓ Access permissions integration working');
  });
});
