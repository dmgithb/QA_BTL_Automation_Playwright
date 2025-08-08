import winston from 'winston';
import path from 'path';

/**
 * Logger utility class for structured logging
 */
export class Logger {
  private logger: winston.Logger;
  private className: string;

  constructor(className: string) {
    this.className = className;
    this.logger = this.createLogger();
  }

  /**
   * Create winston logger instance
   */
  private createLogger(): winston.Logger {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ level, message, timestamp, stack }) => {
        const logMessage = `${timestamp} [${level.toUpperCase()}] [${this.className}] ${message}`;
        return stack ? `${logMessage}\n${stack}` : logMessage;
      })
    );

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        // Console transport
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            logFormat
          )
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: path.join('reports', 'logs', 'test-execution.log'),
          format: logFormat
        }),
        // File transport for error logs only
        new winston.transports.File({
          filename: path.join('reports', 'logs', 'errors.log'),
          level: 'error',
          format: logFormat
        })
      ]
    });
  }

  /**
   * Log info message
   */
  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log error message
   */
  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log step information for test reporting
   */
  step(stepName: string, description?: string): void {
    const message = description ? `STEP: ${stepName} - ${description}` : `STEP: ${stepName}`;
    this.logger.info(message);
  }

  /**
   * Log test start
   */
  testStart(testName: string): void {
    this.logger.info(`========== TEST STARTED: ${testName} ==========`);
  }

  /**
   * Log test end
   */
  testEnd(testName: string, status: 'PASSED' | 'FAILED'): void {
    this.logger.info(`========== TEST ${status}: ${testName} ==========`);
  }
}
