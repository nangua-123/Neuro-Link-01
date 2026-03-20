const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
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
  
  content = content.replace(/indigo-/g, 'blue-');
  content = content.replace(/violet-/g, 'blue-');
  content = content.replace(/purple-/g, 'blue-');
  content = content.replace(/fuchsia-/g, 'blue-');
  
  // RGB shadow replacements
  content = content.replace(/79,70,229/g, '37,99,235'); // indigo-600 -> blue-600
  content = content.replace(/99,102,241/g, '59,130,246'); // indigo-500 -> blue-500
  content = content.replace(/84,112,255/g, '22,119,255'); // #5470FF -> #1677FF
  content = content.replace(/139,92,246/g, '59,130,246'); // violet-500 -> blue-500
  content = content.replace(/124,58,237/g, '37,99,235'); // violet-600 -> blue-600
  
  // Hex replacements
  content = content.replace(/#5470FF/gi, '#1677FF');
  
  // String literal replacements
  content = content.replace(/'indigo'/g, "'blue'");
  content = content.replace(/"indigo"/g, '"blue"');
  content = content.replace(/'violet'/g, "'blue'");
  content = content.replace(/"violet"/g, '"blue"');
  content = content.replace(/'purple'/g, "'blue'");
  content = content.replace(/"purple"/g, '"blue"');
  
  // Object key replacements
  content = content.replace(/indigo:/g, 'blue:');
  content = content.replace(/violet:/g, 'blue:');
  content = content.replace(/purple:/g, 'blue:');

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log(`Replacement complete. Modified ${changedFiles} files.`);
