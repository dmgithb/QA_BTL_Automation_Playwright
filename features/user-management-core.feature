Feature: User Management Core Operations
  As a system administrator
  I want to manage users in the ERP system
  So that I can maintain proper access control

  Background:
    Given I am logged into the ERP system as an administrator
    And I have access to user management functionality

  @core @user-management
  Scenario: Navigate to Users Info page
    When I access the Core Data menu
    And I click on Users Info option
    Then I should be successfully navigated to Users Info page
    And the users table should be visible
    And the "Add New User" button should be available

  @core @user-management
  Scenario: Create new user with Factory pattern
    Given I am on the user creation form
    When I generate user data using Factory pattern with "Operations" department
    And I fill the form with generated user details
    And I submit the user creation form
    Then the user should be created successfully with @digitalmesh.com email
    And I should be redirected to the users list
    And the new user should appear in the system
