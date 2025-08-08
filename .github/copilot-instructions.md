# Copilot Instructions for Playwright Automation Framework

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a comprehensive Playwright automation framework built with TypeScript using the Page Object Model (POM) pattern. The framework is designed for testing the Bulktainer Logistics ERP System.

## Key Framework Components
- **Page Object Model (POM)**: All page interactions are encapsulated in page classes
- **Test Data Management**: JSON/CSV files for maintaining test data separately
- **Comprehensive Reporting**: Allure reports with screenshots and videos
- **Utilities**: Helper functions for database, API, file operations, and logging
- **Configuration Management**: Environment-specific configurations using dotenv

## Coding Standards
- Use TypeScript strict mode
- Follow Page Object Model pattern for all page interactions
- Create reusable components and utilities
- Implement proper error handling and logging
- Use async/await for all asynchronous operations
- Write descriptive test names and add proper documentation

## Test Structure
- Place page objects in `src/pages/`
- Store test data in `data/` directory
- Keep utilities in `src/utils/`
- Write tests in `tests/` directory
- Use fixtures for common setup and teardown

## Best Practices
- Always use explicit waits instead of hard-coded delays
- Implement proper assertions with meaningful error messages
- Use data-driven testing approach
- Create helper methods for common operations
- Maintain clean and readable test code
- Use proper naming conventions for files and methods
