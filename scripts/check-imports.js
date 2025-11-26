#!/usr/bin/env node

/**
 * Script para verificar que todos los imports usen paths absolutos (@/)
 * en lugar de imports relativos (../)
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.spec.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function checkImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relativeImports = [];

  lines.forEach((line, index) => {
    // Buscar imports relativos que no sean del mismo directorio (./)
    const relativeImportMatch = line.match(/from\s+['"](\.\.\/)+/);
    if (relativeImportMatch) {
      relativeImports.push({
        line: index + 1,
        content: line.trim(),
      });
    }
  });

  return relativeImports;
}

function main() {
  console.log('🔍 Verificando imports absolutos...\n');

  const tsFiles = findTsFiles(srcDir);
  let hasErrors = false;

  tsFiles.forEach((file) => {
    const relativeImports = checkImports(file);
    if (relativeImports.length > 0) {
      hasErrors = true;
      const relativePath = path.relative(process.cwd(), file);
      console.log(`❌ ${relativePath}:`);
      relativeImports.forEach(({ line, content }) => {
        console.log(`   Línea ${line}: ${content}`);
      });
      console.log('');
    }
  });

  if (!hasErrors) {
    console.log('✅ Todos los imports usan paths absolutos (@/)');
    process.exit(0);
  } else {
    console.log('❌ Se encontraron imports relativos. Por favor, migra a imports absolutos.');
    process.exit(1);
  }
}

main();

