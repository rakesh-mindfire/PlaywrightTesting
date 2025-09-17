// utils/JsonUtility.js

import fs from 'fs';
import path from 'path';

class JsonUtility {
  static readJsonFromFile(filePath) {
    const absolutePath = path.resolve(filePath);
    const jsonData = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(jsonData);
  }

  static getValue(jsonData, keyPath) {
    const keys = keyPath.split('.');
    let value = jsonData;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value;
  }
}

export default JsonUtility;