@performance @accessibility @non-functional
Feature: Login Page Performance & Accessibility - Bulktainer ERP System
  As a user and accessibility advocate
  I want the login page to be performant and accessible
  So that all users can access the system efficiently and inclusively

  Background:
    Given I am on the login page

  @performance @load-time
  Scenario: Login page load performance validation
    When I navigate to the login page and measure performance
    Then the page should load within acceptable time limits
    And the load time should be logged for monitoring
    And performance should meet the required standards

  @accessibility @compliance @wcag
  Scenario: Login page accessibility compliance
    When I navigate to the login page
    And I check for basic accessibility requirements
    Then form elements should have proper labels and attributes
    And the submit button should be accessible
    And all accessibility checks should pass
    And the page should be WCAG compliant
