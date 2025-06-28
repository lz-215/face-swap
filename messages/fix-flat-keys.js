import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import set from 'lodash.set';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const fixed = {};

  for (const [key, value] of Object.entries(data)) {
    if (key.includes('.')) {
      set(fixed, key, value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      fixed[key] = fixFileObject(value);
    } else {
      fixed[key] = value;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2), 'utf8');
}

function fixFileObject(obj) {
  const fixed = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.includes('.')) {
      set(fixed, key, value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      fixed[key] = fixFileObject(value);
    } else {
      fixed[key] = value;
    }
  }
  return fixed;
}

fixFile(path.join(__dirname, 'en.json'));
fixFile(path.join(__dirname, 'zh.json'));

console.log('已自动修复所有带点号的 key。');