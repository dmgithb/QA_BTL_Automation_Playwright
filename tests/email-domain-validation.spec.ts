import { test, expect } from '../src/fixtures/test-fixtures';
import { TestDataManager } from '../src/utils/test-data-manager';
import { TestDataFactory } from '../src/utils/test-data-factory';

test.describe('@digitalmesh.com Email Domain Validation', () => {

  test('Verify all static test data uses @digitalmesh.com emails', async () => {
    console.log('Test: Verify all static test data uses @digitalmesh.com emails');
    
    // Test static data users
    const userManagementData = await TestDataManager.readJsonData('user-management-data');
    const users = userManagementData.newUsers;
    
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      expect(userData.email).toContain('@digitalmesh.com');
      console.log(`✅ User ${i + 1} email validated: ${userData.email}`);
      
      // Also check sending instructions email if it exists
      if (userData.sendingInstructionsEmail) {
        expect(userData.sendingInstructionsEmail).toContain('@digitalmesh.com');
        console.log(`✅ User ${i + 1} sending instructions email validated: ${userData.sendingInstructionsEmail}`);
      }
    }
    
    console.log('Test completed: All static test data uses @digitalmesh.com emails - passed');
  });

  test('Verify Factory pattern generates @digitalmesh.com emails', async () => {
    console.log('Test: Verify Factory pattern generates @digitalmesh.com emails');
    
    // Test factory-generated users
    for (let i = 0; i < 5; i++) {
      const userData = await TestDataFactory.generateUserData();
      expect(userData.email).toContain('@digitalmesh.com');
      expect(userData.sendingInstructionsEmail).toContain('@digitalmesh.com');
      console.log(`✅ Generated user ${i + 1} email validated: ${userData.email}`);
      console.log(`✅ Generated user ${i + 1} sending instructions email: ${userData.sendingInstructionsEmail}`);
    }
    
    console.log('Test completed: Factory pattern generates @digitalmesh.com emails - passed');
  });

  test('Test email format patterns with @digitalmesh.com', async () => {
    console.log('Test: Email format patterns with @digitalmesh.com');
    
    const emailFormats = [
      'simple@digitalmesh.com',
      'user.name@digitalmesh.com', 
      'user_name@digitalmesh.com',
      'user123@digitalmesh.com',
      'test-user@digitalmesh.com',
      'very.long.email.address@digitalmesh.com'
    ];
    
    // Test each email format matches the domain pattern
    for (const email of emailFormats) {
      expect(email).toMatch(/^[^\s@]+@digitalmesh\.com$/);
      expect(email).toContain('@digitalmesh.com');
      console.log(`✅ Email format validated: ${email}`);
    }
    
    console.log('Test completed: Email format patterns with @digitalmesh.com - passed');
  });

  test('Test email domain consistency across framework', async () => {
    console.log('Test: Email domain consistency across framework');
    
    // Check static data
    const userManagementData = await TestDataManager.readJsonData('user-management-data');
    const staticEmails = userManagementData.newUsers.map((user: any) => user.email);
    
    // Check all static emails use the correct domain
    for (const email of staticEmails) {
      expect(email).toContain('@digitalmesh.com');
      expect(email).not.toContain('@example.com');
      expect(email).not.toContain('@test.com');
      expect(email).not.toContain('@sample.com');
    }
    
    // Check factory-generated emails
    const factoryUser = await TestDataFactory.generateUserData();
    expect(factoryUser.email).toContain('@digitalmesh.com');
    expect(factoryUser.sendingInstructionsEmail).toContain('@digitalmesh.com');
    
    console.log('✅ All email sources use @digitalmesh.com domain consistently');
    console.log('Test completed: Email domain consistency across framework - passed');
  });

  test('Test email address structure validation', async () => {
    console.log('Test: Email address structure validation');
    
    // Generate multiple test users and validate their email structure
    for (let i = 0; i < 3; i++) {
      const userData = await TestDataFactory.generateUserData();
      
      // Test email structure
      expect(userData.email).toMatch(/^[a-zA-Z0-9]+@digitalmesh\.com$/);
      expect(userData.email.split('@')[0]).toBeTruthy(); // Has username part
      expect(userData.email.split('@')[1]).toBe('digitalmesh.com'); // Has correct domain
      
      console.log(`✅ Email structure validated: ${userData.email}`);
      console.log(`   - Username part: ${userData.email.split('@')[0]}`);
      console.log(`   - Domain part: ${userData.email.split('@')[1]}`);
    }
    
    console.log('Test completed: Email address structure validation - passed');
  });
});
