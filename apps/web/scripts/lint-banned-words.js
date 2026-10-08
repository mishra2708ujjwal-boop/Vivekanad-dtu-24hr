const fs = require('fs');
const path = require('path');

const BANNED_WORDS = ['beneficiary', 'needy', 'case', 'donor', 'volunteer', 'leaderboard', 'top volunteer'];
const REGEX = new RegExp(`\\b(${BANNED_WORDS.join('|')})\\b`, 'i');

function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      if (!filepath.includes('node_modules') && !filepath.includes('.next')) {
        filelist = walkSync(filepath, filelist);
      }
    } else {
      if (filepath.endsWith('.ts') || filepath.endsWith('.tsx') || filepath.endsWith('.js') || filepath.endsWith('.json')) {
        if (!filepath.includes('package.json') && !filepath.includes('package-lock.json')) {
            filelist.push(filepath);
        }
      }
    }
  }
  return filelist;
}

const files = walkSync(path.join(__dirname, '../app'));
const components = walkSync(path.join(__dirname, '../components'));
const allFiles = [...files, ...components];

let hasError = false;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const match = content.match(REGEX);
  if (match) {
    console.error(`\x1b[31m❌ Banned word "${match[0]}" found in ${file}\x1b[0m`);
    hasError = true;
  }
}

if (hasError) {
  console.error('\x1b[31mBuild failed due to presence of banned identity words. Roles exist per activity, not per person.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32m✅ No banned words found. Dignity check passed.\x1b[0m');
}
