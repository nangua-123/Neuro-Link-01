import fs from 'fs';
import path from 'path';

function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
  let original = fs.readFileSync(file, 'utf8');
  let content = original;
  
  content = content.replace(/blue-/g, 'blue-');
  content = content.replace(/blue-/g, 'blue-');
  content = content.replace(/blue-/g, 'blue-');
  content = content.replace(/blue-/g, 'blue-');
  
  // RGB shadow replacements
  content = content.replace(/37,99,235/g, '37,99,235'); // blue-600 -> blue-600
  content = content.replace(/59,130,246/g, '59,130,246'); // blue-500 -> blue-500
  content = content.replace(/22,119,255/g, '22,119,255'); // #1677FF -> #1677FF
  content = content.replace(/59,130,246/g, '59,130,246'); // blue-500 -> blue-500
  content = content.replace(/37,99,235/g, '37,99,235'); // blue-600 -> blue-600
  
  // Hex replacements
  content = content.replace(/#1677FF/gi, '#1677FF');
  
  // String literal replacements
  content = content.replace(/'blue'/g, "'blue'");
  content = content.replace(/"blue"/g, '"blue"');
  content = content.replace(/'blue'/g, "'blue'");
  content = content.replace(/"blue"/g, '"blue"');
  content = content.replace(/'blue'/g, "'blue'");
  content = content.replace(/"blue"/g, '"blue"');
  
  // Object key replacements
  content = content.replace(/blue:/g, 'blue:');
  content = content.replace(/blue:/g, 'blue:');
  content = content.replace(/blue:/g, 'blue:');

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log(`Replacement complete. Modified ${changedFiles} files.`);
