Feature: User Management System Exploration
  As a system administrator
  I want to explore the ERP system after login
  So that I can understand the available user management features

  @exploration
  Scenario: Explore system after login
    Given I am logged into the ERP system as an administrator
    When I examine the page content
    Then I should see available menu options
