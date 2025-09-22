import { clearLogFiles } from './Logger.js'; 
import fs from 'fs/promises';
import path from 'path';

export default async function globalSetup() {

  // Clear existing log files
  try {
    await clearLogFiles(); 
  } catch (error) {
    console.error('Error clearing log files:', error.message);
  }

  // Remove allure-results folder
  const allureResultsPath = path.join(process.cwd(), 'allure-results');
  try {
    await fs.rm(allureResultsPath, { recursive: true, force: true });
  } catch (error) {
    console.error(`Error clearing allure-results folder at ${allureResultsPath}:`, error.message);
  }
}