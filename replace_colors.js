const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

const replacements = [
  { old: /#F2E8D5/gi, new: '#FFFFFF' },
  { old: /#EDE0C8/gi, new: '#F8FAFC' },
  { old: /#D9CDB3/gi, new: '#E2E8F0' },
  { old: /#2C1F0E/gi, new: '#0F172A' },
  { old: /#FEFAF4/gi, new: '#FFFFFF' },
  { old: /#C5A059/gi, new: '#2563EB' },
  { old: /#D4AF6A/gi, new: '#3B82F6' },
  { old: /#1E7A8C/gi, new: '#3B82F6' },
  { old: /#2596AA/gi, new: '#60A5FA' },
  { old: /#5A9E2F/gi, new: '#2563EB' },
  { old: /#8BB83A/gi, new: '#3B82F6' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        processDirectory(filePath);
      }
    } else {
      const ext = path.extname(file);
      if (['.tsx', '.ts', '.css'].includes(ext)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        for (const r of replacements) {
          if (r.old.test(content)) {
            content = content.replace(r.old, r.new);
            changed = true;
          }
        }

        if (changed) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated: ${path.relative(targetDir, filePath)}`);
        }
      }
    }
  }
}

console.log('Starting global design color replacement...');
processDirectory(targetDir);
console.log('Done!');
