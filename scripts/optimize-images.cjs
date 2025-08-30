#!/usr/bin/env node

/**
 * Image Optimization Script for Arogyam Clinic
 * Converts images to WebP format and optimizes for production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is installed
function checkSharp() {
  try {
    require('sharp');
    return true;
  } catch (e) {
    return false;
  }
}

// Install sharp if not available
function installSharp() {
  console.log('📦 Installing sharp for image optimization...');
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
    console.log('✅ Sharp installed successfully');
    return true;
  } catch (e) {
    console.error('❌ Failed to install sharp:', e.message);
    return false;
  }
}

// Optimize single image
async function optimizeImage(inputPath, outputPath, quality = 80) {
  const sharp = require('sharp');
  
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`);
    return true;
  } catch (e) {
    console.error(`❌ Failed to optimize ${inputPath}:`, e.message);
    return false;
  }
}

// Generate responsive images
async function generateResponsiveImages(inputPath, outputDir, sizes = [640, 1280, 1920]) {
  const sharp = require('sharp');
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${filename}-${size}w.webp`);
      await sharp(inputPath)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      console.log(`📱 Generated ${size}w responsive image`);
    }
    return true;
  } catch (e) {
    console.error(`❌ Failed to generate responsive images for ${inputPath}:`, e.message);
    return false;
  }
}

// Main optimization function
async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  
  if (!checkSharp()) {
    if (!installSharp()) {
      return;
    }
  }
  
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  const optimizedDir = path.join(imagesDir, 'optimized');
  
  // Create optimized directory
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Find all images
  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .map(file => path.join(imagesDir, file));
  
  console.log(`📁 Found ${imageFiles.length} images to optimize`);
  
  let successCount = 0;
  
  for (const imagePath of imageFiles) {
    const filename = path.basename(imagePath, path.extname(imagePath));
    const webpPath = path.join(optimizedDir, `${filename}.webp`);
    
    // Optimize to WebP
    if (await optimizeImage(imagePath, webpPath)) {
      successCount++;
      
      // Generate responsive versions for important images
      if (filename.includes('dr-kajal') || filename.includes('medical-consultation')) {
        await generateResponsiveImages(imagePath, optimizedDir);
      }
    }
  }
  
  console.log(`\n🎉 Image optimization complete! ${successCount}/${imageFiles.length} images optimized`);
  console.log(`📁 Optimized images saved to: ${optimizedDir}`);
  
  // Generate optimization report
  generateReport(imagesDir, optimizedDir);
}

// Generate optimization report
function generateReport(originalDir, optimizedDir) {
  const report = {
    original: {},
    optimized: {},
    savings: {}
  };
  
  // Calculate original sizes
  fs.readdirSync(originalDir)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .forEach(file => {
      const filePath = path.join(originalDir, file);
      const stats = fs.statSync(filePath);
      report.original[file] = stats.size;
    });
  
  // Calculate optimized sizes
  if (fs.existsSync(optimizedDir)) {
    fs.readdirSync(optimizedDir)
      .filter(file => /\.webp$/i.test(file))
      .forEach(file => {
        const filePath = path.join(optimizedDir, file);
        const stats = fs.statSync(filePath);
        report.optimized[file] = stats.size;
      });
  }
  
  // Calculate savings
  Object.keys(report.original).forEach(file => {
    const originalName = path.basename(file, path.extname(file));
    const webpFile = `${originalName}.webp`;
    
    if (report.optimized[webpFile]) {
      const originalSize = report.original[file];
      const optimizedSize = report.optimized[webpFile];
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      report.savings[file] = {
        original: originalSize,
        optimized: optimizedSize,
        savings: `${savings}%`
      };
    }
  });
  
  // Save report
  const reportPath = path.join(__dirname, '..', 'image-optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📊 Optimization report saved to: ${reportPath}`);
  
  // Display summary
  console.log('\n📈 OPTIMIZATION SUMMARY:');
  Object.entries(report.savings).forEach(([file, data]) => {
    console.log(`   ${file}: ${(data.original / 1024).toFixed(1)}KB → ${(data.optimized / 1024).toFixed(1)}KB (${data.savings} smaller)`);
  });
}

// Run if called directly
if (require.main === module) {
  optimizeImages().catch(console.error);
}

module.exports = { optimizeImages, optimizeImage, generateResponsiveImages };
