const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findFiles('c:/work/WEBSITE-STAY BELLISIMO/src', /\.(tsx|ts)$/);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We want to match: keywords: [\n ... \n] or keywords: [...]
  // We can use a regex that matches `keywords:\s*\[([^\]]*)\]`
  content = content.replace(/keywords:\s*\[([^\]]*)\]/g, (match, p1) => {
    // split by comma, ignoring commas inside quotes if possible
    // a simple split by comma should work since keywords don't contain commas
    const items = p1.split(',').map(s => s.trim()).filter(Boolean);
    if (items.length > 3) {
      // keep first 3
      return `keywords: [\n    ${items.slice(0, 3).join(',\n    ')}\n  ]`;
    }
    return match;
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
console.log('Keywords replaced.');
