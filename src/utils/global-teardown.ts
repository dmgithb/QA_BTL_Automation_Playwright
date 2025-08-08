import { FullConfig } from '@playwright/test';
import { FileUtils } from './file-utils';
import { Logger } from './logger';
import { execSync } from 'child_process';

/**
 * Global teardown that runs after all tests
 */
async function globalTeardown(config: FullConfig) {
  const logger = new Logger('GlobalTeardown');
  
  logger.info('Starting global teardown...');
  
  try {
    // Update test run state
    const stateFile = 'reports/test-run-state.json';
    if (FileUtils.fileExists(stateFile)) {
      const state = JSON.parse(FileUtils.readFileAsString(stateFile));
      state.testRun.endTime = new Date().toISOString();
      state.testRun.duration = new Date().getTime() - new Date(state.testRun.startTime).getTime();
      FileUtils.writeToFile(stateFile, JSON.stringify(state, null, 2));
    }
    
    // Generate Allure report if allure-results directory exists
    const allureResultsDir = 'allure-results';
    const allureReportDir = 'allure-report';
    
    if (FileUtils.fileExists(allureResultsDir)) {
      try {
        logger.info('Generating Allure report...');
        execSync(`npx allure generate ${allureResultsDir} --clean -o ${allureReportDir}`, {
          stdio: 'pipe'
        });
        logger.info(`Allure report generated successfully at: ${allureReportDir}`);
      } catch (error) {
        logger.warn('Failed to generate Allure report. Make sure allure-commandline is installed.');
      }
    }
    
    // Log test execution summary
    logger.info('Test execution completed');
    logger.info(`Reports available at:`);
    logger.info(`  - HTML Report: reports/html-report/index.html`);
    logger.info(`  - JSON Report: reports/test-results.json`);
    logger.info(`  - JUnit Report: reports/junit-results.xml`);
    if (FileUtils.fileExists(allureReportDir)) {
      logger.info(`  - Allure Report: ${allureReportDir}/index.html`);
    }
    
  } catch (error) {
    logger.error(`Error in global teardown: ${error}`);
  }
  
  logger.info('Global teardown completed');
}

export default globalTeardown;
