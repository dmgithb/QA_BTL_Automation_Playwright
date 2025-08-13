Feature: User Management Navigation Test
  As a system administrator
  I want to navigate to user management features
  So that I can access user administration functions

  @navigation
  Scenario: Navigate to Core Data submenu
    Given I am logged into the ERP system as an administrator
    When I hover over the "Core Data" menu
    Then I should see the submenu options
