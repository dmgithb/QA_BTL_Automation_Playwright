@smoke @critical
Feature: User Management and Administration - @digitalmesh.com Domain
  As an administrator of the Bulktainer ERP System
  I want to manage user accounts with @digitalmesh.com email domain
  So that I can control system access and maintain proper user permissions

  Background:
    Given I am logged into the ERP system as an administrator
    And I have access to user management functionality

  @navigation @core-functionality @critical
  Scenario: Navigate to Users Info via Core Data menu
    When I access the Core Data menu
    And I click on Users Info option
    Then I should be successfully navigated to Users Info page
    And the users table should be visible
    And the "Add New User" button should be available
    And the page URL should contain "/user/index"

  @user-creation @factory-pattern @critical @smoke
  Scenario: Create user with Factory pattern and @digitalmesh.com email
    Given I am on the Users Info page
    When I click the "Add New User" button
    Then I should see the "Create User" form
    When I generate user data using Factory pattern with "Operations" department
    And I fill the form with generated user details
    And I submit the user creation form
    Then the user should be created successfully with @digitalmesh.com email
    And I should be redirected to the users list
    And the new user should appear in the system

  @email-validation @domain-acceptance @critical
  Scenario: Verify @digitalmesh.com email domain acceptance and validation
    Given I am on the user creation form
    When I fill user details with name "Email Validation Test User"
    And I enter an email with "@digitalmesh.com" domain
    And I fill all other required user information
    And I check the mandatory sending instructions checkbox
    And I submit the user creation form
    Then the @digitalmesh.com email should be accepted
    And the user should be created successfully
    And no email domain validation errors should occur

  @department-management @it-department @regression
  Scenario: Create user with IT department assignment
    Given I am on the user creation form
    When I fill user details with name "Test User One"
    And I enter a unique email with "@digitalmesh.com" domain
    And I assign the user to "IT" department
    And I set appropriate access permissions
    And I check the mandatory sending instructions checkbox
    And I submit the user creation form
    Then the user should be created with IT department access
    And the user should be properly assigned to IT department
    And the user information should be saved correctly

  @department-management @commercial-department @regression
  Scenario: Create user with Commercial department assignment
    Given I am on the user creation form
    When I fill user details with name "Jane Smith"
    And I generate a dynamic email with "@digitalmesh.com" domain
    And I assign the user to "Commercial" department
    And I configure appropriate user permissions
    And I check the mandatory sending instructions checkbox
    And I submit the user creation form
    Then the user should be created with Commercial department access
    And the Commercial department assignment should be saved
    And the user should have proper commercial access rights

  @form-validation @checkbox-validation @extended
  Scenario: Validate mandatory sending instructions checkbox functionality
    Given I am on the user creation form
    When I fill in complete user details
    And I enter a valid email with "@digitalmesh.com" domain
    But I do not check the mandatory sending instructions checkbox
    And I attempt to submit the form
    Then the form submission should fail with validation error
    When I check the mandatory sending instructions checkbox
    And I submit the form again
    Then the user should be created successfully
    And no "check at least one checkbox" error should appear

  @data-driven @multiple-departments @comprehensive
  Scenario Outline: Create users for different departments with @digitalmesh.com emails
    Given I am on the user creation form
    When I fill user details with name "<userName>"
    And I enter email "<emailPrefix>@digitalmesh.com"
    And I assign the user to "<department>" department
    And I set "<accessLevel>" access permissions
    And I check the mandatory sending instructions checkbox
    And I submit the user creation form
    Then the user should be created successfully
    And the user should be associated with "<department>" department
    And the user should have "<accessLevel>" access level

    Examples:
      | userName           | emailPrefix    | department   | accessLevel  |
      | Marketing Manager  | marketing001   | Marketing    | Full Access  |
      | HR Specialist      | hr001         | HR           | Limited      |
      | Finance Controller | finance001    | Finance      | Full Access  |
      | Operations Lead    | operations001 | Operations   | Full Access  |
      | Sales Manager      | sales001      | Sales        | Limited      |
      | Admin User         | admin001      | IT           | Full Access  |

  @form-validation @required-fields @error-handling
  Scenario: Validate required field validation and error handling
    Given I am on the user creation form
    When I attempt to submit the form without filling required fields
    Then I should see validation errors for missing required fields
    And the form should not be submitted
    And appropriate error messages should be displayed
    When I fill in all required fields with valid data
    And I include a valid @digitalmesh.com email
    And I check all mandatory checkboxes
    And I submit the form
    Then the user should be created successfully
    And all validation errors should be cleared

  @user-profile @email-notifications @communication
  Scenario: User creation with email notification preferences
    Given I am creating a new user
    When I fill in comprehensive user details
    And I set up email notification preferences
    And I check the sending instructions checkbox
    And I configure communication settings
    And I submit the user creation form
    Then the user should be created with proper email preferences
    And email notification settings should be saved correctly
    And the user should receive appropriate setup instructions

  @error-handling @duplicate-email @data-integrity
  Scenario: Handle duplicate email validation and conflict resolution
    Given a user already exists with email "existing.user@digitalmesh.com"
    When I attempt to create a new user with the same email address
    And I fill in all other required information
    And I submit the user creation form
    Then I should see a duplicate email validation error
    And the form should not be submitted
    And appropriate error message should guide the user
    When I change to a unique email address "unique.user@digitalmesh.com"
    And I submit the form again
    Then the user should be created successfully
    And the unique email should be accepted

  @user-permissions @access-control @security
  Scenario: Configure user permissions and access control
    Given I am creating a new user
    When I fill in basic user information
    And I set specific access permissions
    And I configure role-based access controls
    And I set department-specific permissions
    And I submit the user creation form
    Then the user should be created with proper permissions
    And access controls should be applied correctly
    And the user should have appropriate system access

  @bulk-operations @efficiency @advanced
  Scenario: Handle multiple user creation efficiently
    Given I need to create multiple users for the same department
    When I create the first user with complete details
    And I use the form to create subsequent users
    And I maintain consistent @digitalmesh.com email format
    And I apply similar permissions and settings
    Then all users should be created successfully
    And the bulk creation process should be efficient
    And data consistency should be maintained across all users

  @user-status @lifecycle-management @administration
  Scenario: Manage user status and lifecycle
    Given I have created a new user
    When I set the initial user status as "Active"
    And I configure appropriate user lifecycle settings
    And I submit the user information
    Then the user should be created with "Active" status
    And the user should be immediately available for login
    And the user lifecycle should be properly initialized

  @integration @system-connectivity @validation
  Scenario: Validate user creation system integration
    Given the user management system is properly connected
    When I create a new user with valid information
    And the user data is processed by the system
    Then the user should be integrated across all system modules
    And the user should appear in relevant system reports
    And all related system components should recognize the new user
