import { TestDataFactory } from './test-data-factory';

/**
 * Products Data Factory for generating product test data
 * Follows the Factory Pattern for better test data management
 * Extends the base TestDataFactory for consistent data generation
 */
export class ProductsDataFactory extends TestDataFactory {
  
  /**
   * Generate random product data for testing
   * @param overrides - Optional field overrides
   * @returns Product data object for testing
   */
  static async generateProductData(overrides: Partial<any> = {}): Promise<any> {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    
    const defaultProduct = {
      productName: `Test Product ${randomId}`,
      casNumber: this.generateCASNumber(),
      appearance: this.generateAppearance(),
      specificGravity: this.generateSpecificGravity(),
      productType: 'Product',
      businessType: 'DED',
      unNumber: this.generateUNNumber(),
      status: 'P', // P = Pending, A = Active
      
      // Dangerous goods fields
      hazardClass: this.generateHazardClass(),
      packingGroup: this.generatePackingGroup(),
      properShippingName: `Test Chemical ${randomId}`,
      technicalName: `Technical Name ${randomId}`,
      emergencyPhone: '+44 20 1234 5678',
      
      // Additional metadata
      description: `Auto-generated test product ${randomId}`,
      createdAt: new Date().toISOString()
    };

    // Apply any overrides
    return { ...defaultProduct, ...overrides };
  }

  /**
   * Generate valid CAS number format (XXX-XX-X)
   */
  static generateCASNumber(): string {
    const part1 = Math.floor(Math.random() * 900) + 100; // 3 digits
    const part2 = Math.floor(Math.random() * 90) + 10;   // 2 digits
    const part3 = Math.floor(Math.random() * 9) + 1;     // 1 digit
    
    return `${part1}-${part2}-${part3}`;
  }

  /**
   * Generate realistic product appearance
   */
  static generateAppearance(): string {
    const appearances = [
      'White crystalline powder',
      'Clear colorless liquid',
      'Yellow viscous liquid',
      'Off-white granules',
      'Transparent solution',
      'Light brown powder',
      'Colorless gas',
      'Blue crystalline solid',
      'Amber liquid',
      'White flakes'
    ];
    
    return appearances[Math.floor(Math.random() * appearances.length)];
  }

  /**
   * Generate specific gravity value (0.1 - 3.0)
   */
  static generateSpecificGravity(): string {
    const sg = (Math.random() * 2.9 + 0.1).toFixed(2);
    return sg;
  }

  /**
   * Generate UN number (4-digit code)
   */
  static generateUNNumber(): string {
    const unNumber = Math.floor(Math.random() * 9000) + 1000;
    return unNumber.toString();
  }

  /**
   * Generate hazard class (1-9)
   */
  static generateHazardClass(): string {
    const hazardClasses = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return hazardClasses[Math.floor(Math.random() * hazardClasses.length)];
  }

  /**
   * Generate packing group (I, II, III)
   */
  static generatePackingGroup(): string {
    const packingGroups = ['I', 'II', 'III'];
    return packingGroups[Math.floor(Math.random() * packingGroups.length)];
  }

  /**
   * Generate test product for validation testing
   * @param validationType - Type of validation to test
   */
  static async generateValidationTestProduct(validationType: 'missing_name' | 'invalid_cas' | 'negative_sg' | 'long_name' | 'xss_attempt'): Promise<any> {
    const baseProduct = await this.generateProductData();
    
    switch (validationType) {
      case 'missing_name':
        return { ...baseProduct, productName: '' };
        
      case 'invalid_cas':
        return { ...baseProduct, casNumber: 'invalid-cas-format' };
        
      case 'negative_sg':
        return { ...baseProduct, specificGravity: '-1.5' };
        
      case 'long_name':
        return { 
          ...baseProduct, 
          productName: 'A'.repeat(300) // Very long name
        };
        
      case 'xss_attempt':
        return {
          ...baseProduct,
          productName: '<script>alert("XSS Test")</script>Test Product',
          appearance: '<img src="x" onerror="alert(\'XSS\')">'
        };
        
      default:
        return baseProduct;
    }
  }

  /**
   * Generate product data for performance testing
   * @param count - Number of products to generate
   */
  static async generateBulkProductData(count: number = 10): Promise<any[]> {
    const products = [];
    
    for (let i = 0; i < count; i++) {
      const product = await this.generateProductData({
        productName: `Bulk Test Product ${i + 1}`,
        casNumber: this.generateCASNumber(),
        appearance: this.generateAppearance()
      });
      products.push(product);
    }
    
    return products;
  }

  /**
   * Generate product data with specific business requirements
   * @param businessType - Business type (DED, IMO, etc.)
   */
  static async generateBusinessSpecificProduct(businessType: 'DED' | 'IMO' | 'RETAIL' = 'DED'): Promise<any> {
    const baseProduct = await this.generateProductData();
    
    const businessSpecificData = {
      DED: {
        businessType: 'DED',
        productType: 'Product',
        status: 'P',
        hazardClass: this.generateHazardClass()
      },
      IMO: {
        businessType: 'IMO',
        productType: 'Service',
        status: 'A',
        unNumber: this.generateUNNumber()
      },
      RETAIL: {
        businessType: 'RETAIL',
        productType: 'Product',
        status: 'A',
        specificGravity: '1.00'
      }
    };
    
    return { ...baseProduct, ...businessSpecificData[businessType] };
  }

  /**
   * Generate product data for filter testing
   */
  static async generateFilterTestData(): Promise<{ filters: any[], products: any[] }> {
    const testProducts = [
      await this.generateProductData({
        productName: 'Propanediol Test',
        casNumber: '504-63-2',
        appearance: 'Clear liquid'
      }),
      await this.generateProductData({
        productName: 'Acetone Chemical',
        casNumber: '67-64-1',
        appearance: 'Colorless liquid'
      }),
      await this.generateProductData({
        productName: 'Methanol Solution',
        casNumber: '67-56-1',
        appearance: 'Clear solution'
      })
    ];
    
    const filterTests = [
      {
        type: 'productName',
        value: 'Propanediol',
        expectedResults: 1,
        description: 'Filter by product name'
      },
      {
        type: 'casNumber',
        value: '67-64-1',
        expectedResults: 1,
        description: 'Filter by CAS number'
      },
      {
        type: 'appearance',
        value: 'liquid',
        expectedResults: 3,
        description: 'Filter by appearance containing "liquid"'
      },
      {
        type: 'productName',
        value: 'NonExistent',
        expectedResults: 0,
        description: 'Filter with no results'
      }
    ];
    
    return {
      filters: filterTests,
      products: testProducts
    };
  }

  /**
   * Generate edge case test data
   */
  static async generateEdgeCaseTestData(): Promise<any[]> {
    return [
      // Unicode characters
      await this.generateProductData({
        productName: 'Продукт тест 测试产品 منتج',
        appearance: 'Test with unicode'
      }),
      
      // Boundary values
      await this.generateProductData({
        productName: 'Boundary Test',
        specificGravity: '0.01', // Very small value
        unNumber: '1000' // Minimum UN number
      }),
      
      // Maximum values
      await this.generateProductData({
        productName: 'Max Value Test',
        specificGravity: '2.99', // Near maximum
        unNumber: '9999' // Maximum UN number
      }),
      
      // Special characters
      await this.generateProductData({
        productName: 'Special!@#$%^&*()_+',
        appearance: 'Test with special chars'
      }),
      
      // Empty optional fields
      await this.generateProductData({
        productName: 'Minimal Required Only',
        casNumber: '',
        appearance: 'Basic test'
      })
    ];
  }

  /**
   * Validate generated product data
   */
  static validateProductData(productData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Required field validation
    if (!productData.productName || productData.productName.trim() === '') {
      errors.push('Product name is required');
    }
    
    // Product name length validation
    if (productData.productName && productData.productName.length > 255) {
      errors.push('Product name exceeds maximum length');
    }
    
    // CAS number format validation (if provided)
    if (productData.casNumber && productData.casNumber !== '') {
      const casRegex = /^\d{2,7}-\d{2}-\d$/;
      if (!casRegex.test(productData.casNumber)) {
        errors.push('Invalid CAS number format');
      }
    }
    
    // Specific gravity validation
    if (productData.specificGravity) {
      const sg = parseFloat(productData.specificGravity);
      if (isNaN(sg) || sg <= 0 || sg > 10) {
        errors.push('Invalid specific gravity value');
      }
    }
    
    // UN number validation (if provided)
    if (productData.unNumber && productData.unNumber !== '') {
      const unRegex = /^\d{4}$/;
      if (!unRegex.test(productData.unNumber)) {
        errors.push('Invalid UN number format');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
