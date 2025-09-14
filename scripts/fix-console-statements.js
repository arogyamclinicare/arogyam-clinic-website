const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and dist directories
      if (file !== 'node_modules' && file !== 'dist' && file !== 'coverage') {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to remove console statements from a file
function removeConsoleStatements(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove console.log, console.error, console.warn, console.info, console.debug statements
    const consoleRegex = /^\s*console.(log|error|warn|info|debug)\([^)]*\);\s*$/gm;
    const newContent = content.replace(consoleRegex, '');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      modified = true;
    }
    
    return modified;
  } catch (error) {
    return false;
  }
}

// Main execution
const projectRoot = process.cwd();
const files = findFiles(projectRoot);

let totalFixed = 0;
files.forEach(file => {
  if (removeConsoleStatements(file)) {
    totalFixed++;
  }
});
