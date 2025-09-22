const fs = require('fs');
const path = require('path');

const [_node, _script, dir] = process.argv;

fs.watch(dir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    console.log(`[${eventType}] ${filename}`);
  } else {
    console.log(`Directory changed: ${dir}`);
  }
});

console.log(`Watching for file changes in: ${dir}`);
