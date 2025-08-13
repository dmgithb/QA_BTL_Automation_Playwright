@smoke @critical
Feature: Login Authentication - Bulktainer ERP System
  As a user of the Bulktainer ERP System
  I want to be able to login securely with proper validation
  So that I can access the system functionality safely

  Background:
    Given I am on the login page

  @authentication @page-load @smoke
  Scenario: Verify login page loads correctly
    Then I should see the login page loaded correctly
    And I should see the page title is correct
    And I should see all login form elements
    And I should take a screenshot of the login page

  @authentication @happy-path @critical @smoke
  Scenario: Successful login with valid credentials
    Given I have valid user credentials
    When I enter my username and password
    And I click the login button
    Then I should be successfully logged into the system
    And the authentication state should be saved for future tests

  @authentication @negative-testing @validation
  Scenario: Failed login with invalid credentials
    Given I have invalid user credentials
    When I enter my invalid username and password
    And I click the login button
    Then I should not be logged into the system
    And I should remain on the login page

  @authentication @validation @edge-case
  Scenario: Login with empty credentials
    Given I have empty credentials
    When I attempt to login with empty fields
    And I click the login button
    Then I should not be logged into the system
    And I should see appropriate validation messages

  @functionality @navigation
  Scenario: Test forgot password functionality
    When I click the forgot password link
    Then I should be navigated to the forgot password page
    And the URL should contain "forgot-password"

  @functionality @navigation @footer-links
  Scenario Outline: Test footer links navigation
    When I click the "<link_name>" link
    Then I should be navigated to the appropriate page

    Examples:
      | link_name  |
      | About Us   |
      | Contact Us |

  @authentication @error-handling @security
  Scenario: Login attempt with invalid credentials
    Given I have invalid user credentials
    When I enter incorrect username and password
    And I click the login button
    Then I should see an appropriate error message
    And I should remain on the login page
    And no authentication state should be created

  @authentication @security @field-validation
  Scenario: Password field security validation
    When I enter text in the password field
    Then the password should be masked for security
    And the password field should have type "password"
    And the password should not be visible in plain text

  @authentication @form-behavior @submission
  Scenario: Form submission behavior validation
    Given I have valid user credentials
    When I fill in the complete login form
    And I submit the form
    Then the form should be submitted successfully
    And I should be redirected to the main dashboard
    And the URL should change to reflect successful login

  @performance @load-time @critical
  Scenario: Login page performance validation
    Then the login page should load within 5 seconds
    And all critical UI elements should be visible immediately
    And the page should be responsive on different screen sizes
    And page load performance should meet requirements

  @accessibility @keyboard-navigation @usability
  Scenario: Keyboard navigation and accessibility
    When I navigate through the form using Tab key
    Then I should be able to focus on username field first
    And I should be able to focus on password field next
    And I should be able to focus on login button last
    And I should be able to submit the form using Enter key
    And focus indicators should be clearly visible

  @data-driven @multiple-users @roles
  Scenario Outline: Login with different user types and roles
    Given I have credentials for "<userType>" user
    When I login with "<username>" and corresponding password
    Then I should be successfully authenticated
    And I should have access to "<userType>" specific features
    And my user role should be properly recognized

    Examples:
      | userType | username |
      | admin    | jibin    |
      | manager  | manager1 |
      | regular  | testuser |

  @security @session-management @authentication
  Scenario: Session handling and security after successful login
    Given I have successfully logged in
    When I check the browser session state
    Then I should have a valid session token
    And the session should be properly established
    And authentication cookies should be set correctly
    And session security measures should be in place

  @navigation @post-login @dashboard
  Scenario: Navigation capabilities after successful login
    Given I have successfully logged in
    When I am on the welcome dashboard page
    Then I should be able to navigate to different system modules
    And the main navigation menu should be accessible
    And all authorized sections should be available
    And breadcrumb navigation should work properly

  @error-recovery @resilience @user-experience
  Scenario: Recovery from login errors and retry functionality
    Given I have attempted login with wrong credentials
    And I see an error message displayed
    When I clear the form fields
    And I enter correct valid credentials
    And I attempt to login again
    Then I should be able to login successfully
    And the previous error message should be cleared
    And the error state should be reset

  @security @brute-force @protection
  Scenario: Multiple failed login attempts handling
    Given I am on the login page
    When I attempt login with invalid credentials multiple times
    Then the system should handle failed attempts appropriately
    And security measures should be triggered if needed
    And appropriate warnings should be displayed

  @responsive @mobile @cross-platform
  Scenario: Login functionality on different devices
    Given I access the login page on different screen sizes
    Then the login form should be responsive
    And all elements should be properly positioned
    And touch interactions should work on mobile devices
    And the user experience should be consistent across devices
