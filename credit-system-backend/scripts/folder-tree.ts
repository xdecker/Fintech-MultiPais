import fs from 'fs';
import path from 'path';

function tree(dir: string, prefix = '') {
  const files = fs.readdirSync(dir);
  files.forEach((file, i) => {
    const isLast = i === files.length - 1;
    const newPrefix = prefix + (isLast ? '└── ' : '├── ');
    const fullPath = path.join(dir, file);
    console.log(newPrefix + file);
    if (fs.statSync(fullPath).isDirectory()) {
      tree(fullPath, prefix + (isLast ? '    ' : '│   '));
    }
  });
}

tree('src');