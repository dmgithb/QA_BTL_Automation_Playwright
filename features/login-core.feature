@smoke @critical
Feature: Login Authentication Test - Core Scenarios
  As a user of the Bulktainer ERP System
  I want to be able to login securely
  So that I can access the system functionality

  @authentication @page-load
  Scenario: Verify login page loads correctly
    Given I am on the login page
    Then I should see the login page loaded correctly
    And I should see the page title is correct
    And I should see all login form elements

  @authentication @happy-path @critical
  Scenario: Successful login with valid credentials
    Given I am on the login page
    And I have valid user credentials
    When I enter my username and password
    And I click the login button
    Then I should be successfully logged into the system
    And I should see the welcome page
    And the authentication state should be saved for future tests
