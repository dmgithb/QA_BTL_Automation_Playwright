import { TestDataManager } from './test-data-manager';

/**
 * Data Factory for generating test data dynamically
 * Follows the Factory Pattern for better test data management
 * Uses test data from JSON files as single source of truth
 */
export class TestDataFactory {
  /**
   * Generate random user data for testing
   * @param overrides - Optional field overrides
   * @returns User data object with valid department from test data
   */
  static async generateUserData(overrides: Partial<any> = {}): Promise<any> {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    
    const defaultUser = {
      fullName: `Test User ${randomId}`,
      company: `Test Company ${randomId}`,
      telephone: `+44 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      department: overrides.department || await this.getRandomDepartment(),
      accessPermission: "Full Access",
      username: `user${randomId}_${timestamp}`,
      email: `user${randomId}@digitalmesh.com`,
      sendingInstructionsEmail: `user${randomId}@digitalmesh.com`,
      password: this.generateCompliantPassword(),
      confirmPassword: "", // Will be set to same as password
      status: "Active",
      allowSystemGeneratedHBLs: "No",
      description: `Auto-generated test user ${randomId}`
    };

    // Set confirm password to match password
    defaultUser.confirmPassword = defaultUser.password;

    // Apply any overrides
    return { ...defaultUser, ...overrides };
  }

  /**
   * Generate password that complies with policy
   * - 8+ characters
   * - Upper and lowercase letters
   * - Numbers
   * - Special characters
   * - No consecutive special characters
   */
  static generateCompliantPassword(): string {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specials = '!@#$%^&*';
    
    // Ensure at least one of each required type
    let password = '';
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specials[Math.floor(Math.random() * specials.length)];
    
    // Add remaining characters (minimum 4 more to reach 8)
    const allChars = upperCase + lowerCase + numbers;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password to avoid predictable patterns
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  /**
   * Get random department from test data (follows single source of truth principle)
   * @returns Promise<string> - Random valid department from user-management-data.json
   */
  static async getRandomDepartment(): Promise<string> {
    try {
      const userManagementData = await TestDataManager.readJsonData('user-management-data');
      const departments = userManagementData.departments;
      
      if (!departments || departments.length === 0) {
        throw new Error('No departments found in user-management-data.json');
      }
      
      return departments[Math.floor(Math.random() * departments.length)];
    } catch (error) {
      console.error('Error loading departments from test data:', error);
      throw new Error('Failed to load departments from test data. Please check user-management-data.json file.');
    }
  }

  /**
   * Get all valid departments from test data
   * @returns Promise<string[]> - Array of all valid departments
   */
  static async getValidDepartments(): Promise<string[]> {
    try {
      const userManagementData = await TestDataManager.readJsonData('user-management-data');
      return userManagementData.departments || [];
    } catch (error) {
      console.error('Error loading departments from test data:', error);
      throw new Error('Failed to load departments from test data');
    }
  }

  /**
   * Generate user for specific department with validation
   * @param departmentName - Specific department name
   * @returns Promise<any> - User data for specified department
   */
  static async generateUserForDepartment(departmentName: string): Promise<any> {
    const validDepartments = await this.getValidDepartments();
    
    if (!validDepartments.includes(departmentName)) {
      throw new Error(
        `Invalid department: ${departmentName}. Valid departments: ${validDepartments.join(', ')}`
      );
    }
    
    return await this.generateUserData({ department: departmentName });
  }

  /**
   * Generate multiple users with random departments
   * @param count - Number of users to generate
   * @returns Promise<any[]> - Array of user data objects
   */
  static async generateMultipleUsers(count: number): Promise<any[]> {
    const users: any[] = [];
    for (let i = 0; i < count; i++) {
      const userData = await this.generateUserData();
      users.push(userData);
    }
    return users;
  }

  /**
   * Validate if department exists in test data
   * @param departmentName - Department name to validate
   * @returns Promise<boolean> - True if department is valid
   */
  static async isValidDepartment(departmentName: string): Promise<boolean> {
    const validDepartments = await this.getValidDepartments();
    return validDepartments.includes(departmentName);
  }

  /**
   * Generate invalid user data for negative testing
   * @param type - Type of invalid data to generate
   * @returns Promise<any> - Invalid user data for testing
   */
  static async generateInvalidUserData(type: 'missingRequired' | 'invalidEmail' | 'passwordMismatch'): Promise<any> {
    const baseUser = await this.generateUserData();
    
    switch (type) {
      case 'missingRequired':
        return {
          ...baseUser,
          fullName: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        };
      
      case 'invalidEmail':
        return {
          ...baseUser,
          email: 'invalid-email-format'
        };
      
      case 'passwordMismatch':
        return {
          ...baseUser,
          confirmPassword: 'DifferentPassword123!'
        };
      
      default:
        return baseUser;
    }
  }

  /**
   * Generate login test data
   * @param type - Type of login data to generate
   * @returns Login credentials object
   */
  static generateLoginData(type: 'valid' | 'invalid' = 'valid'): any {
    if (type === 'valid') {
      return {
        username: 'jibin',
        password: 'Jerrin@123',
        role: 'administrator',
        description: 'Valid admin user'
      };
    } else {
      return {
        username: `invalid_${Date.now()}`,
        password: 'wrong_password',
        expectedError: 'Invalid credentials',
        description: 'Invalid username and password'
      };
    }
  }

  /**
   * Generate user data with department validation from test data
   * @param departmentOverride - Specific department or random if not provided
   * @returns Promise<any> - Validated user data
   */
  static async generateValidatedUserData(departmentOverride?: string): Promise<any> {
    let department: string;
    
    if (departmentOverride) {
      const isValid = await this.isValidDepartment(departmentOverride);
      if (!isValid) {
        throw new Error(`Invalid department: ${departmentOverride}`);
      }
      department = departmentOverride;
    } else {
      department = await this.getRandomDepartment();
    }
    
    return await this.generateUserData({ department });
  }

  /**
   * Get access permissions from test data
   * @returns Promise<string[]> - Array of valid access permissions
   */
  static async getValidAccessPermissions(): Promise<string[]> {
    try {
      const userManagementData = await TestDataManager.readJsonData('user-management-data');
      return userManagementData.accessPermissions || ['Full Access'];
    } catch (error) {
      console.error('Error loading access permissions from test data:', error);
      return ['Full Access']; // Fallback
    }
  }

  /**
   * Generate user data using validation test cases from JSON
   * @param testCaseType - Type of validation test case
   * @returns Promise<any> - Test case data
   */
  static async generateValidationTestData(testCaseType: string): Promise<any> {
    try {
      const userManagementData = await TestDataManager.readJsonData('user-management-data');
      const validationTests = userManagementData.userValidationTests;
      
      const testCase = validationTests.find((test: any) => test.testCase === testCaseType);
      if (!testCase) {
        throw new Error(`Validation test case '${testCaseType}' not found in test data`);
      }
      
      return testCase;
    } catch (error) {
      console.error('Error loading validation test data:', error);
      throw error;
    }
  }

  /**
   * Validate generated user data against test data constraints
   * @param userData - User data to validate
   * @returns Promise<{ isValid: boolean; errors: string[] }> - Validation result
   */
  static async validateUserData(userData: any): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // Validate department
    if (userData.department) {
      const isValidDept = await this.isValidDepartment(userData.department);
      if (!isValidDept) {
        errors.push(`Invalid department: ${userData.department}`);
      }
    }
    
    // Validate email domain
    if (userData.email && !userData.email.endsWith('@digitalmesh.com')) {
      errors.push(`Email must use @digitalmesh.com domain: ${userData.email}`);
    }
    
    // Validate access permissions
    if (userData.accessPermission) {
      const validPermissions = await this.getValidAccessPermissions();
      if (!validPermissions.includes(userData.accessPermission)) {
        errors.push(`Invalid access permission: ${userData.accessPermission}`);
      }
    }
    
    // Validate required fields
    const requiredFields = ['fullName', 'username', 'email', 'password'];
    for (const field of requiredFields) {
      if (!userData[field] || userData[field].toString().trim() === '') {
        errors.push(`Required field missing: ${field}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
