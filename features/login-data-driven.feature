@data-driven @comprehensive
Feature: Data-Driven Login Tests - Bulktainer ERP System
  As a QA engineer
  I want to execute comprehensive data-driven login tests
  So that I can validate login functionality with multiple datasets

  Background:
    Given I am on the login page

  @data-driven @csv-testing
  Scenario: Execute data-driven login tests using CSV data
    Given I have loaded CSV test data for login scenarios
    When I execute all test cases from the CSV data
    Then each test case should produce the expected result
    And login forms should be cleared between test cases

  @cross-browser @compatibility
  Scenario: Cross-browser login functionality validation
    Given I have loaded valid user credentials for cross-browser testing
    When I test login functionality across different browsers
    Then login should work consistently
    And all login features should be functional
