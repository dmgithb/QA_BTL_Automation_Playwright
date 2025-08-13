import { APIRequestContext, request } from '@playwright/test';
import { Logger } from './logger';
import { ConfigManager } from './config-manager';

/**
 * API utility class for making HTTP requests
 */
export class ApiUtils {
  private apiContext!: APIRequestContext;
  private logger: Logger;
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || ConfigManager.API_BASE_URL;
    this.logger = new Logger('ApiUtils');
  }

  /**
   * Initialize API context
   */
  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    this.logger.info(`API context initialized with base URL: ${this.baseURL}`);
  }

  /**
   * Make GET request
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise<any> - Response data
   */
  async get(endpoint: string, options?: { params?: Record<string, any>; headers?: Record<string, string> }): Promise<any> {
    this.logger.info(`Making GET request to: ${endpoint}`);
    
    const response = await this.apiContext.get(endpoint, {
      params: options?.params,
      headers: options?.headers
    });

    const responseData = await response.json();
    this.logger.info(`GET ${endpoint} - Status: ${response.status()}`);
    
    return {
      status: response.status(),
      data: responseData,
      headers: response.headers()
    };
  }

  /**
   * Make POST request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise<any> - Response data
   */
  async post(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<any> {
    this.logger.info(`Making POST request to: ${endpoint}`);
    
    const response = await this.apiContext.post(endpoint, {
      data: data,
      headers: options?.headers
    });

    const responseData = await response.json();
    this.logger.info(`POST ${endpoint} - Status: ${response.status()}`);
    
    return {
      status: response.status(),
      data: responseData,
      headers: response.headers()
    };
  }

  /**
   * Make PUT request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise<any> - Response data
   */
  async put(endpoint: string, data?: any, options?: { headers?: Record<string, string> }): Promise<any> {
    this.logger.info(`Making PUT request to: ${endpoint}`);
    
    const response = await this.apiContext.put(endpoint, {
      data: data,
      headers: options?.headers
    });

    const responseData = await response.json();
    this.logger.info(`PUT ${endpoint} - Status: ${response.status()}`);
    
    return {
      status: response.status(),
      data: responseData,
      headers: response.headers()
    };
  }

  /**
   * Make DELETE request
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise<any> - Response data
   */
  async delete(endpoint: string, options?: { headers?: Record<string, string> }): Promise<any> {
    this.logger.info(`Making DELETE request to: ${endpoint}`);
    
    const response = await this.apiContext.delete(endpoint, {
      headers: options?.headers
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }

    this.logger.info(`DELETE ${endpoint} - Status: ${response.status()}`);
    
    return {
      status: response.status(),
      data: responseData,
      headers: response.headers()
    };
  }

  /**
   * Set authentication token
   * @param token - Authentication token
   */
  async setAuthToken(token: string): Promise<void> {
    await this.apiContext.dispose();
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    this.logger.info('Authentication token set');
  }

  /**
   * Validate response status
   * @param response - API response
   * @param expectedStatus - Expected status code
   */
  validateResponseStatus(response: any, expectedStatus: number): void {
    if (response.status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus} but got ${response.status}`);
    }
    this.logger.info(`Response status validation passed: ${response.status}`);
  }

  /**
   * Validate response schema
   * @param response - API response
   * @param requiredFields - Array of required field names
   */
  validateResponseSchema(response: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => !(field in response.data));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields in response: ${missingFields.join(', ')}`);
    }
    
    this.logger.info('Response schema validation passed');
  }

  /**
   * Cleanup API context
   */
  async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
      this.logger.info('API context disposed');
    }
  }
}
