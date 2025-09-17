// utils/ActionUtility.js

class ActionUtility {
  // Method now accepts a Playwright Locator object
  static async click(locator) {
    await locator.click();
  }

  // Method now accepts a Playwright Locator object
  static async fill(locator, value) {
    await locator.fill(value);
  }

  // Method now accepts a Playwright Locator object
  static async uploadFile(locator, filePath) {
    await locator.setInputFiles(filePath);
  }

  // Method now accepts a Playwright Locator object
  static async hover(locator) {
    await locator.hover();
  }
}

export default ActionUtility;