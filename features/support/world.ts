import { Page, Browser, BrowserContext } from '@playwright/test';
import { Logger } from '../../src/utils/logger';

export interface ICustomWorld {
  page: Page;
  browser: Browser;
  context: BrowserContext;
  logger: Logger;
  testData?: any;
  loginPage?: any;
  userManagementPage?: any;
}

export const world: ICustomWorld = {
  page: undefined as any,
  browser: undefined as any,
  context: undefined as any,
  logger: new Logger('BDD-Test'),
  testData: undefined,
  loginPage: undefined,
  userManagementPage: undefined
};
