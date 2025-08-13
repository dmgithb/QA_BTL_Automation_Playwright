@smoke @login-core
Feature: Core Login Functionality - Bulktainer ERP System
  As a user of the Bulktainer ERP System
  I want to be able to login securely
  So that I can access the system functionality

  Background:
    Given I am on the login page

  @authentication @smoke @critical
  Scenario: Successful login with valid credentials
    Given I have valid user credentials
    When I enter my username and password
    And I click the login button
    Then I should be successfully logged into the system
    And the authentication state should be saved for future tests

  @authentication @negative
  Scenario: Failed login with invalid credentials
    Given I have invalid user credentials
    When I enter my invalid username and password
    And I click the login button
    Then I should not be logged into the system

  @page-validation @smoke
  Scenario: Verify login page loads correctly
    Then I should see the login page loaded correctly
    And I should see the page title is correct
    And I should see all login form elements
