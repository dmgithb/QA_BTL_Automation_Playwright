import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import * as XLSX from 'xlsx';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test data manager for handling JSON, CSV, and Excel files with secure credential management
 */
export class TestDataManager {
  private static readonly DATA_DIR = path.join(process.cwd(), 'data');

  /**
   * Read JSON test data file with environment variable resolution
   * @param fileName - Name of the JSON file (without extension)
   * @returns Promise<any> - Parsed JSON data with resolved environment variables
   */
  static async readJsonData(fileName: string): Promise<any> {
    const filePath = path.join(this.DATA_DIR, `${fileName}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const jsonContent = fs.readFileSync(filePath, 'utf-8');
    const resolvedContent = this.resolveEnvironmentVariables(jsonContent);
    return JSON.parse(resolvedContent);
  }

  /**
   * Resolve environment variables in string content
   * @param content - String content with ${VARIABLE_NAME} placeholders
   * @returns string - Content with resolved environment variables
   */
  private static resolveEnvironmentVariables(content: string): string {
    return content.replace(/\$\{([^}]+)\}/g, (match, envVar) => {
      const value = process.env[envVar];
      if (value === undefined) {
        console.warn(`Environment variable ${envVar} is not defined, using empty string`);
        return '';
      }
      return value;
    });
  }

  /**
   * Read CSV test data file with environment variable resolution
   * @param fileName - Name of the CSV file (without extension)
   * @returns Promise<any[]> - Array of parsed CSV rows with resolved environment variables
   */
  static async readCsvData(fileName: string): Promise<any[]> {
    const filePath = path.join(this.DATA_DIR, `${fileName}.csv`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const csvContent = fs.readFileSync(filePath, 'utf-8');
      const resolvedContent = this.resolveEnvironmentVariables(csvContent);
      
      // Write resolved content to a temporary stream
      const { Readable } = require('stream');
      const stream = Readable.from([resolvedContent]);
      
      stream
        .pipe(csvParser())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error: any) => reject(error));
    });
  }

  /**
   * Read Excel test data file
   * @param fileName - Name of the Excel file (without extension)
   * @param sheetName - Name of the sheet to read (optional, defaults to first sheet)
   * @returns Promise<any[]> - Array of parsed Excel rows
   */
  static async readExcelData(fileName: string, sheetName?: string): Promise<any[]> {
    const filePath = path.join(this.DATA_DIR, `${fileName}.xlsx`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheet];
    
    return XLSX.utils.sheet_to_json(worksheet);
  }

  /**
   * Write JSON test data file
   * @param fileName - Name of the JSON file (without extension)
   * @param data - Data to write
   */
  static async writeJsonData(fileName: string, data: any): Promise<void> {
    const filePath = path.join(this.DATA_DIR, `${fileName}.json`);
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(this.DATA_DIR)) {
      fs.mkdirSync(this.DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Get test data by key from JSON file
   * @param fileName - Name of the JSON file
   * @param key - Key to extract from the JSON
   * @returns Promise<any> - Value for the specified key
   */
  static async getTestDataByKey(fileName: string, key: string): Promise<any> {
    const data = await this.readJsonData(fileName);
    
    if (!(key in data)) {
      throw new Error(`Key '${key}' not found in test data file: ${fileName}.json`);
    }

    return data[key];
  }

  /**
   * Get random test data from array
   * @param dataArray - Array of test data
   * @returns any - Random item from the array
   */
  static getRandomTestData(dataArray: any[]): any {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error('Invalid or empty data array provided');
    }

    const randomIndex = Math.floor(Math.random() * dataArray.length);
    return dataArray[randomIndex];
  }

  /**
   * Filter test data by criteria
   * @param dataArray - Array of test data
   * @param filterCriteria - Object containing filter criteria
   * @returns any[] - Filtered array
   */
  static filterTestData(dataArray: any[], filterCriteria: Record<string, any>): any[] {
    return dataArray.filter(item => {
      return Object.keys(filterCriteria).every(key => 
        item[key] === filterCriteria[key]
      );
    });
  }

  /**
   * Merge multiple test data sources
   * @param dataSources - Array of data objects to merge
   * @returns any - Merged data object
   */
  static mergeTestData(...dataSources: any[]): any {
    return Object.assign({}, ...dataSources);
  }

  /**
   * Generate test data combinations
   * @param baseData - Base test data object
   * @param variations - Object containing variations for each field
   * @returns any[] - Array of test data combinations
   */
  static generateTestDataCombinations(baseData: any, variations: Record<string, any[]>): any[] {
    const combinations: any[] = [];
    const keys = Object.keys(variations);
    
    if (keys.length === 0) {
      return [baseData];
    }

    function generateCombos(current: any, keyIndex: number): void {
      if (keyIndex === keys.length) {
        combinations.push({ ...baseData, ...current });
        return;
      }

      const key = keys[keyIndex];
      const values = variations[key];
      
      for (const value of values) {
        generateCombos({ ...current, [key]: value }, keyIndex + 1);
      }
    }

    generateCombos({}, 0);
    return combinations;
  }

  /**
   * Get secure login credentials from environment variables
   * @param userType - Type of user (admin, manager, regular, etc.)
   * @returns object - Login credentials
   */
  static getSecureCredentials(userType: string = 'default'): { username: string; password: string } {
    let username: string | undefined;
    let password: string | undefined;

    switch (userType.toLowerCase()) {
      case 'admin':
      case 'administrator':
        username = process.env.ADMIN_USERNAME;
        password = process.env.ADMIN_PASSWORD;
        break;
      case 'manager':
        username = process.env.MANAGER_USERNAME;
        password = process.env.MANAGER_PASSWORD;
        break;
      case 'regular':
      case 'user':
        username = process.env.REGULAR_USER_USERNAME;
        password = process.env.REGULAR_USER_PASSWORD;
        break;
      case 'default':
      case 'test':
      default:
        username = process.env.TEST_USER_USERNAME;
        password = process.env.TEST_USER_PASSWORD;
        break;
    }

    // Fallback to default credentials if specific user type not found
    if (!username || !password) {
      username = process.env.TEST_USER_USERNAME;
      password = process.env.TEST_USER_PASSWORD;
    }

    // Validate that credentials are available
    if (!username || !password) {
      throw new Error(
        `Credentials not found for user type: ${userType}. ` +
        'Please ensure the following environment variables are set: ' +
        'TEST_USER_USERNAME, TEST_USER_PASSWORD'
      );
    }

    return { username, password };
  }

  /**
   * Get secure test data with environment variable substitution
   * @param fileName - Name of the JSON file
   * @param key - Optional key to extract specific data
   * @returns Promise<any> - Test data with secure substitutions
   */
  static async getSecureTestData(fileName: string, key?: string): Promise<any> {
    const data = key ? await this.getTestDataByKey(fileName, key) : await this.readJsonData(fileName);
    
    // Replace environment variable placeholders
    return this.substituteEnvironmentVariables(data);
  }

  /**
   * Substitute environment variable placeholders in test data
   * @param data - Test data object
   * @returns any - Data with environment variables substituted
   */
  private static substituteEnvironmentVariables(data: any): any {
    if (typeof data === 'string') {
      // Replace ${ENV_VAR} patterns with actual environment variables
      return data.replace(/\$\{([^}]+)\}/g, (match, envVar) => {
        const value = process.env[envVar];
        if (value === undefined) {
          console.warn(`Environment variable ${envVar} not found, keeping placeholder`);
          return match;
        }
        return value;
      });
    } else if (Array.isArray(data)) {
      return data.map(item => this.substituteEnvironmentVariables(item));
    } else if (data && typeof data === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.substituteEnvironmentVariables(value);
      }
      return result;
    }
    
    return data;
  }

  /**
   * Validate environment configuration
   * @returns boolean - True if all required environment variables are set
   */
  static validateEnvironmentConfig(): { isValid: boolean; missingVars: string[] } {
    const requiredVars = [
      'TEST_USER_USERNAME',
      'TEST_USER_PASSWORD',
      'BASE_URL',
      'DEFAULT_EMAIL_DOMAIN'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    return {
      isValid: missingVars.length === 0,
      missingVars
    };
  }

  /**
   * Get login data for specific user type
   * @param userType - Type of user (validUser, invalidUser, admin, manager, etc.)
   * @returns Promise<any> - Login credentials and metadata
   */
  static async getLoginData(userType: string): Promise<any> {
    const loginData = await this.readJsonData('login-data');
    
    if (userType === 'validUser' || userType === 'admin') {
      return loginData.validUsers[0]; // Default to first valid user
    }
    
    if (userType === 'invalidUser') {
      return loginData.invalidUsers[0]; // Default to first invalid user
    }
    
    // Look for specific user type in valid users
    const user = loginData.validUsers.find((u: any) => u.role === userType);
    if (user) {
      return user;
    }
    
    // Default to first valid user if not found
    return loginData.validUsers[0];
  }

  /**
   * Get user management test data
   * @param dataType - Type of user data needed
   * @returns Promise<any> - User management test data
   */
  static async getUserData(dataType: string = 'default'): Promise<any> {
    const userData = await this.readJsonData('user-management-data');
    return userData[dataType] || userData.users[0];
  }
}
