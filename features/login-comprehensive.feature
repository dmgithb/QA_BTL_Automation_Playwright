@comprehensive
Feature: Comprehensive Login Testing - Bulktainer ERP System
  As a quality assurance engineer
  I want to perform comprehensive testing of the login functionality
  So that I can ensure the system works correctly across all scenarios

  Background:
    Given I am on the login page

  @data-driven @authentication
  Scenario: Execute data-driven login tests
    Given I have loaded CSV test data for login scenarios
    When I execute all test cases from the CSV data
    Then each test case should produce the expected result
    And the login form should be cleared between test cases

  @cross-browser @authentication @compatibility
  Scenario: Cross-browser login functionality validation
    Given I have valid user credentials
    When I perform login functionality testing
    Then the login should work consistently across browsers
    And all login features should be functional

  @performance @non-functional
  Scenario: Login page load performance testing
    When I navigate to the login page and measure performance
    Then the page should load within acceptable time limits
    And the load time should be logged for monitoring

  @accessibility @non-functional @compliance
  Scenario: Login page accessibility testing
    Given I am on the login page
    When I check for basic accessibility requirements
    Then the form should have proper labels and attributes
    And the submit button should be accessible
    And all accessibility checks should pass

  @security @authentication @edge-case
  Scenario Outline: Login security validations
    Given I have credentials with "<credential_type>" values
    When I attempt to login with these credentials
    Then the system should handle the "<credential_type>" appropriately
    And security measures should be in place

    Examples:
      | credential_type    |
      | SQL injection      |
      | XSS attempts       |
      | special characters |
      | very long strings  |

  @load-testing @performance
  Scenario: Multiple concurrent login attempts
    Given I have multiple user credentials
    When I simulate concurrent login attempts
    Then the system should handle multiple users correctly
    And performance should remain acceptable

  @session-management @authentication
  Scenario: Session and authentication state management
    Given I have successfully logged in
    When I verify the authentication state
    Then the session should be properly maintained
    And the auth state should be available for future tests

  @ui-responsiveness @accessibility
  Scenario: Login page responsiveness testing
    Given I am on the login page
    When I test the page on different screen sizes
    Then the login form should be responsive
    And all elements should remain accessible
