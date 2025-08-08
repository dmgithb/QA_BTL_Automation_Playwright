import { FullConfig } from '@playwright/test';
import { FileUtils } from './file-utils';
import { ConfigManager } from './config-manager';
import { Logger } from './logger';

/**
 * Global setup that runs before all tests
 */
async function globalSetup(config: FullConfig) {
  const logger = new Logger('GlobalSetup');
  
  logger.info('Starting global setup...');
  
  // Print current configuration
  ConfigManager.printConfig();
  
  // Initialize required directories
  FileUtils.initializeDirectories();
  
  // Clean up old test artifacts
  FileUtils.cleanupOldFiles(7);
  
  // Create a global state file if needed
  const globalState = {
    testRun: {
      id: `test-run-${Date.now()}`,
      startTime: new Date().toISOString(),
      environment: ConfigManager.getEnvironment(),
      browser: ConfigManager.BROWSER,
      workers: config.workers
    }
  };
  
  FileUtils.writeToFile('reports/test-run-state.json', JSON.stringify(globalState, null, 2));
  
  logger.info('Global setup completed successfully');
}

export default globalSetup;
