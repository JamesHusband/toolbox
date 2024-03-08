#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Dynamically construct the path to config.json based on the current working directory
const configPath = path.join(process.cwd(), 'config.json');
const configExists = fs.existsSync(configPath);

if (!configExists) {
  console.error('config.json not found in the project root.');
  process.exit(1);
}

const config = require(configPath);

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const scaffoldFiles = () => {
  config.scaffold.forEach((dir) => {
    dir.files.forEach((file) => {
      const filePath = path.join('libs/gtm-api', dir.path, file.name);
      ensureDirectoryExistence(filePath);
      fs.writeFileSync(filePath, file.content);
      console.log(`Created ${filePath}`);
    });
  });
};

const injectCode = () => {
  config.inject.forEach((injection) => {
    const filePath = path.join('libs/gtm-api', injection.file);
    const existingContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    fs.writeFileSync(filePath, existingContent + injection.code);
    console.log(`Injected code into ${filePath}`);
  });
};

const generate = () => {
  scaffoldFiles();
  injectCode();
  console.log('Generation completed.');
};

generate();