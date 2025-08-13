@smoke @critical @login
Feature: Login Functionality - Bulktainer ERP System
  As a user of the Bulktainer ERP System
  I want to be able to login securely with comprehensive validation
  So that I can access the system functionality safely and efficiently

  Background:
    Given I am on the login page

  @page-validation @smoke
  Scenario: Verify login page loads correctly
    Then I should see the login page elements loaded correctly
    And I should see the correct page title
    And I should take a screenshot of the loaded login page

  @authentication @happy-path @critical
  Scenario: Successful login with valid credentials
    Given I have loaded valid user credentials from test data
    When I navigate to the login page
    And I perform login with the valid credentials
    Then I should be successfully logged into the system
    And I should save the authentication state for future tests

  @authentication @negative-testing
  Scenario: Failed login with invalid credentials
    Given I have loaded invalid user credentials from test data
    When I navigate to the login page
    And I attempt login with invalid credentials
    Then login should fail
    And I should verify the login failure

  @authentication @edge-case @validation
  Scenario: Login with empty credentials
    Given I have loaded test data for empty credentials
    When I navigate to the login page
    And I attempt login with empty credentials
    Then login should fail
    And I should verify the login failure

  @functionality @navigation
  Scenario: Test forgot password functionality
    When I navigate to the login page
    And I click the forgot password link
    Then I should be navigated to the forgot password page
    And the URL should contain "forgot-password"

  @functionality @navigation @footer-links
  Scenario: Test footer links navigation
    When I navigate to the login page
    And I test the About Us link navigation
    And I navigate back to the login page
    And I test the Contact Us link navigation
    Then all footer link navigation should work correctly
