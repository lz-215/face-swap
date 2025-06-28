import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.join(__dirname, 'en.json');
const zhPath = path.join(__dirname, 'zh.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));

const missingKeys = [];

function merge(enObj, zhObj) {
  if (typeof enObj !== 'object' || enObj === null) return zhObj ?? enObj;
  const result = Array.isArray(enObj) ? [...enObj] : { ...zhObj };
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && enObj[key] !== null && !Array.isArray(enObj[key])) {
      result[key] = merge(enObj[key], zhObj?.[key]);
    } else {
      if (zhObj?.[key] === undefined) {
        result[key] = enObj[key];
        missingKeys.push(key);
      } else {
        result[key] = zhObj[key];
      }
    }
  }
  return result;
}

const merged = merge(en, zh);

fs.writeFileSync(zhPath, JSON.stringify(merged, null, 2), 'utf8');

if (missingKeys.length) {
  console.log('已自动补全以下缺失 key：');
  missingKeys.forEach(k => console.log('  -', k));
} else {
  console.log('zh.json 已与 en.json 完全对齐，无缺失 key。');
}
console.log('合并完成，zh.json 已更新。');