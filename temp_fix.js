const fs = require('fs');

// Read the file
let content = fs.readFileSync('components/AboutUs.tsx', 'utf8');

// Replace the base64 image with our photo
content = content.replace(/src="data:image\/jpeg;base64,[^"]*"/, 'src="/images/dr-kajal-kumari.jpg"');

// Write it back
fs.writeFileSync('components/AboutUs.tsx', content);

console.log('✅ Image source updated successfully!');
