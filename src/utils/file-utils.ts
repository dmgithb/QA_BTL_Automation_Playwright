import fs from 'fs';
import path from 'path';
import { Logger } from './logger';

/**
 * File utility class for file operations
 */
export class FileUtils {
  private static logger = new Logger('FileUtils');

  /**
   * Create directory if it doesn't exist
   * @param dirPath - Directory path to create
   */
  static createDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      this.logger.info(`Directory created: ${dirPath}`);
    }
  }

  /**
   * Delete file if it exists
   * @param filePath - File path to delete
   */
  static deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.info(`File deleted: ${filePath}`);
    }
  }

  /**
   * Delete directory and its contents
   * @param dirPath - Directory path to delete
   */
  static deleteDirectory(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      this.logger.info(`Directory deleted: ${dirPath}`);
    }
  }

  /**
   * Copy file from source to destination
   * @param sourcePath - Source file path
   * @param destPath - Destination file path
   */
  static copyFile(sourcePath: string, destPath: string): void {
    const destDir = path.dirname(destPath);
    this.createDirectory(destDir);
    
    fs.copyFileSync(sourcePath, destPath);
    this.logger.info(`File copied from ${sourcePath} to ${destPath}`);
  }

  /**
   * Read file content as string
   * @param filePath - File path to read
   * @returns File content as string
   */
  static readFileAsString(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Write content to file
   * @param filePath - File path to write
   * @param content - Content to write
   */
  static writeToFile(filePath: string, content: string): void {
    const dirPath = path.dirname(filePath);
    this.createDirectory(dirPath);
    
    fs.writeFileSync(filePath, content);
    this.logger.info(`Content written to file: ${filePath}`);
  }

  /**
   * Check if file exists
   * @param filePath - File path to check
   * @returns True if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Get file size in bytes
   * @param filePath - File path
   * @returns File size in bytes
   */
  static getFileSize(filePath: string): number {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const stats = fs.statSync(filePath);
    return stats.size;
  }

  /**
   * Get file extension
   * @param filePath - File path
   * @returns File extension
   */
  static getFileExtension(filePath: string): string {
    return path.extname(filePath);
  }

  /**
   * Get file name without extension
   * @param filePath - File path
   * @returns File name without extension
   */
  static getFileNameWithoutExtension(filePath: string): string {
    const fileName = path.basename(filePath);
    return path.parse(fileName).name;
  }

  /**
   * List files in directory with optional filter
   * @param dirPath - Directory path
   * @param extension - Optional file extension filter
   * @returns Array of file names
   */
  static listFiles(dirPath: string, extension?: string): string[] {
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Directory not found: ${dirPath}`);
    }
    
    let files = fs.readdirSync(dirPath);
    
    if (extension) {
      files = files.filter(file => path.extname(file) === extension);
    }
    
    return files;
  }

  /**
   * Create a unique file name with timestamp
   * @param baseName - Base file name
   * @param extension - File extension
   * @returns Unique file name
   */
  static createUniqueFileName(baseName: string, extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${baseName}-${timestamp}${extension}`;
  }

  /**
   * Initialize required directories for the test framework
   */
  static initializeDirectories(): void {
    const directories = [
      'reports',
      'reports/screenshots',
      'reports/videos',
      'reports/logs',
      'reports/auth-states',
      'allure-results',
      'allure-report'
    ];

    directories.forEach(dir => {
      this.createDirectory(dir);
    });

    this.logger.info('All required directories initialized');
  }

  /**
   * Clean up old test artifacts
   * @param daysOld - Number of days old files to delete
   */
  static cleanupOldFiles(daysOld: number = 7): void {
    const directories = ['reports/screenshots', 'reports/videos', 'reports/logs'];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime < cutoffDate) {
            this.deleteFile(filePath);
          }
        });
      }
    });

    this.logger.info(`Cleaned up files older than ${daysOld} days`);
  }
}
