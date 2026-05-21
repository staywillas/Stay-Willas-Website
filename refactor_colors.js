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

        // The previous arbitrary colors we used:
        // #F2E8D5 -> beige background
        // #EDE0C8 -> darker beige
        // #D9CDB3 -> beige border
        // #2C1F0E -> charcoal text
        // #C5A059 -> gold
        // #1B3564 -> navy
        // #1E7A8C -> teal

        const safeReplacements = [
          // Backgrounds
          { old: /bg-\[#F2E8D5\]/g, new: 'bg-bg-primary' },
          { old: /bg-\[#EDE0C8\]/g, new: 'bg-bg-secondary' },
          
          // Texts
          { old: /text-\[#F2E8D5\]/g, new: 'text-bg-primary' },
          { old: /text-\[#2C1F0E\]/g, new: 'text-text-primary' },
          { old: /text-\[#C5A059\]/g, new: 'text-accent-secondary' },
          { old: /text-\[#1B3564\]/g, new: 'text-accent-primary' },
          { old: /text-\[#1E7A8C\]/g, new: 'text-accent-tertiary' },

          // Borders
          { old: /border-\[#F2E8D5\]/g, new: 'border-bg-primary' },
          { old: /border-\[#EDE0C8\]/g, new: 'border-bg-secondary' },
          { old: /border-\[#D9CDB3\]/g, new: 'border-border-subtle' },
          { old: /border-\[#C5A059\]/g, new: 'border-accent-secondary' },
          { old: /border-\[#1B3564\]/g, new: 'border-accent-primary' },

          // Backgrounds (Accents)
          { old: /bg-\[#2C1F0E\]/g, new: 'bg-text-primary' },
          { old: /bg-\[#C5A059\]/g, new: 'bg-accent-secondary' },
          { old: /bg-\[#1B3564\]/g, new: 'bg-accent-primary' },
          { old: /bg-\[#C5A059\]\/30/g, new: 'bg-accent-secondary/30' },

          // Gradients
          { old: /from-\[#F2E8D5\]/g, new: 'from-bg-primary' },
          { old: /from-\[#2C1F0E\]/g, new: 'from-text-primary' },
          { old: /to-\[#2C1F0E\]/g, new: 'to-text-primary' },
          { old: /via-\[#2C1F0E\]/g, new: 'via-text-primary' }
        ];

        for (const r of safeReplacements) {
          if (r.old.test(content)) {
            content = content.replace(r.old, r.new);
            changed = true;
          }
        }

        if (changed) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Refactored semantic colors in: ${filePath}`);
        }
      }
    }
  }
}

processDirectory(targetDir);
console.log('Semantic color refactoring complete!');
