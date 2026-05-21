const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'admin'].includes(file)) {
        processDirectory(filePath);
      }
    } else {
      const ext = path.extname(file);
      if (['.tsx', '.ts', '.css'].includes(ext)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        const safeReplacements = [
          { old: /bg-\[#FFFFFF\]/g, new: 'bg-[#F2E8D5]' },
          { old: /text-\[#FFFFFF\]/g, new: 'text-[#F2E8D5]' },
          { old: /border-\[#FFFFFF\]/g, new: 'border-[#F2E8D5]' },
          { old: /from-\[#FFFFFF\]/g, new: 'from-[#F2E8D5]' },
          
          { old: /bg-\[#F8FAFC\]/g, new: 'bg-[#EDE0C8]' },
          { old: /text-\[#F8FAFC\]/g, new: 'text-[#EDE0C8]' },
          { old: /border-\[#F8FAFC\]/g, new: 'border-[#EDE0C8]' },
          
          { old: /border-\[#E2E8F0\]/g, new: 'border-[#D9CDB3]' },
          
          { old: /text-\[#0F172A\]/g, new: 'text-[#2C1F0E]' },
          { old: /bg-\[#0F172A\]/g, new: 'bg-[#2C1F0E]' },
          { old: /from-\[#0F172A\]/g, new: 'from-[#2C1F0E]' },
          { old: /to-\[#0F172A\]/g, new: 'to-[#2C1F0E]' },
          { old: /via-\[#0F172A\]/g, new: 'via-[#2C1F0E]' },
          
          { old: /text-\[#3B82F6\]/g, new: 'text-[#C5A059]' },
          { old: /bg-\[#3B82F6\]/g, new: 'bg-[#C5A059]' },
          { old: /border-\[#3B82F6\]/g, new: 'border-[#C5A059]' },
          
          { old: /text-\[#2563EB\]/g, new: 'text-[#1B3564]' },
          { old: /bg-\[#2563EB\]/g, new: 'bg-[#1B3564]' },
          { old: /border-\[#2563EB\]/g, new: 'border-[#1B3564]' },
          
          { old: /text-\[#60A5FA\]/g, new: 'text-[#1E7A8C]' }
        ];

        for (const r of safeReplacements) {
          if (r.old.test(content)) {
            content = content.replace(r.old, r.new);
            changed = true;
          }
        }

        if (changed) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Restored beige in: ${filePath}`);
        }
      }
    }
  }
}

processDirectory(targetDir);
console.log('Done reverting to beige!');
