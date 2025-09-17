import { clearLogFiles } from '../utils/logger.js'; // Ensure .js extension for ESM
import fs from 'fs/promises';
import path from 'path';

export default async function globalSetup() {
  console.log(`Global setup running in: ${process.cwd()}`);

  // Clear existing log files
  try {
    await clearLogFiles(); // Ensure clearLogFiles is async if it involves file operations
    console.log('Log files cleared in global setup.');
  } catch (error) {
    console.error('Error clearing log files:', error.message);
  }

  // Remove allure-results folder
  const allureResultsPath = path.join(process.cwd(), 'allure-results');
  try {
    await fs.rm(allureResultsPath, { recursive: true, force: true });
    console.log('Allure results folder cleared successfully.');
  } catch (error) {
    console.error(`Error clearing allure-results folder at ${allureResultsPath}:`, error.message);
  }
}