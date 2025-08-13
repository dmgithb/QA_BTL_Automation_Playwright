@smoke @critical
Feature: Simple Login Test
  As a user of the Bulktainer ERP System
  I want to be able to login securely
  So that I can access the system functionality

  Scenario: Successful login with valid credentials
    Given I navigate to the login page
    When I enter valid credentials
    And I click login
    Then I should be logged in successfully
