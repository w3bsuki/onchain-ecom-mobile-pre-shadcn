#!/usr/bin/env node

/**
 * Medusa Documentation Generator
 * 
 * This script automatically generates documentation for the Medusa backend
 * by analyzing the codebase structure, extracting JSDoc/TSDoc comments,
 * and creating comprehensive markdown documentation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  rootDir: path.resolve(__dirname, '../backend/medusa'),
  outputDir: path.resolve(__dirname, '../docs/generated'),
  sourceDir: path.resolve(__dirname, '../backend/medusa/src'),
  templateDir: path.resolve(__dirname, '../docs/templates'),
  components: {
    api: 'src/api',
    modules: 'src/modules',
    workflows: 'src/workflows',
    subscribers: 'src/subscribers',
    jobs: 'src/jobs',
    admin: 'src/admin',
    scripts: 'src/scripts',
    links: 'src/links',
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

/**
 * Extract module information from directory
 */
function analyzeDirectory(dir, pattern = /\.ts$/) {
  const fullPath = path.join(config.rootDir, dir);
  if (!fs.existsSync(fullPath)) {
    return { files: [], directories: [] };
  }
  
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  
  const files = entries
    .filter(entry => entry.isFile() && pattern.test(entry.name))
    .map(entry => ({
      name: entry.name,
      path: path.join(dir, entry.name),
      fullPath: path.join(fullPath, entry.name)
    }));
  
  const directories = entries
    .filter(entry => entry.isDirectory())
    .map(entry => ({
      name: entry.name,
      path: path.join(dir, entry.name)
    }));
    
  return { files, directories };
}

/**
 * Extract JSDoc comments from file
 */
function extractDocComments(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const docCommentRegex = /\/\*\*\s*([\s\S]*?)\s*\*\//g;
    const comments = [];
    let match;
    
    while ((match = docCommentRegex.exec(content)) !== null) {
      // Clean up the comment and remove asterisks
      const cleanComment = match[1]
        .replace(/^\s*\* ?/gm, '')
        .trim();
      comments.push(cleanComment);
    }
    
    return comments;
  } catch (err) {
    console.error(`Error reading file ${filePath}: ${err.message}`);
    return [];
  }
}

/**
 * Generate API documentation
 */
function generateApiDocs() {
  console.log('Generating API documentation...');
  
  const apiDir = config.components.api;
  const { files, directories } = analyzeDirectory(apiDir);
  
  // Create base API documentation file
  const readmePath = path.join(config.rootDir, apiDir, 'README.md');
  let overview = 'No overview available';
  
  if (fs.existsSync(readmePath)) {
    overview = fs.readFileSync(readmePath, 'utf8');
    
    // Remove frontmatter or markdown title if present
    overview = overview.replace(/^---[\s\S]*?---\n/, '');
    overview = overview.replace(/^# .*\n/, '');
  }
  
  // Generate endpoints documentation
  const endpoints = [];
  
  for (const dir of directories) {
    if (dir.name === 'admin' || dir.name === 'store') {
      const { files: routeFiles, directories: routeDirs } = analyzeDirectory(dir.path);
      
      for (const routeDir of routeDirs) {
        const { files: endpointFiles } = analyzeDirectory(routeDir.path);
        for (const file of endpointFiles) {
          if (file.name === 'route.ts') {
            const content = fs.readFileSync(file.fullPath, 'utf8');
            const methods = [];
            
            // Extract HTTP methods
            const methodRegex = /export async function (GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)/g;
            let methodMatch;
            
            while ((methodMatch = methodRegex.exec(content)) !== null) {
              methods.push(methodMatch[1]);
            }
            
            if (methods.length) {
              endpoints.push({
                path: `/${dir.name}/${routeDir.name}`,
                methods: methods,
                docComments: extractDocComments(file.fullPath)
              });
            }
          }
        }
      }
    }
  }
  
  // Generate API markdown
  let apiMarkdown = '# Medusa API Documentation\n\n';
  apiMarkdown += `## Overview\n\n${overview}\n\n`;
  apiMarkdown += '## Endpoints\n\n';
  
  for (const endpoint of endpoints) {
    apiMarkdown += `### ${endpoint.path}\n\n`;
    apiMarkdown += '**Supported Methods:**\n\n';
    
    for (const method of endpoint.methods) {
      apiMarkdown += `- \`${method}\`\n`;
    }
    
    if (endpoint.docComments.length) {
      apiMarkdown += '\n**Documentation:**\n\n';
      for (const comment of endpoint.docComments) {
        apiMarkdown += `${comment}\n\n`;
      }
    }
    
    apiMarkdown += '\n';
  }
  
  fs.writeFileSync(path.join(config.outputDir, 'api-documentation.md'), apiMarkdown);
}

/**
 * Generate modules documentation
 */
function generateModulesDocs() {
  console.log('Generating modules documentation...');
  
  const modulesDir = config.components.modules;
  const { files, directories } = analyzeDirectory(modulesDir);
  
  // Create base modules documentation file
  const readmePath = path.join(config.rootDir, modulesDir, 'README.md');
  let overview = 'No overview available';
  
  if (fs.existsSync(readmePath)) {
    overview = fs.readFileSync(readmePath, 'utf8');
    
    // Remove frontmatter or markdown title if present
    overview = overview.replace(/^---[\s\S]*?---\n/, '');
    overview = overview.replace(/^# .*\n/, '');
  }
  
  // Generate modules documentation
  const modules = [];
  
  for (const dir of directories) {
    const moduleFiles = analyzeDirectory(dir.path).files;
    const moduleInfo = {
      name: dir.name,
      path: dir.path,
      files: moduleFiles,
      models: [],
      services: [],
      docComments: []
    };
    
    // Check for module structure
    for (const file of moduleFiles) {
      // Find main module file
      if (file.name === 'index.ts') {
        moduleInfo.docComments = extractDocComments(file.fullPath);
      }
      
      // Find service file
      if (file.name === 'service.ts') {
        moduleInfo.services.push({
          name: 'service',
          docComments: extractDocComments(file.fullPath)
        });
      }
    }
    
    // Check for models
    const modelsDir = path.join(dir.path, 'models');
    if (fs.existsSync(path.join(config.rootDir, modelsDir))) {
      const { files: modelFiles } = analyzeDirectory(modelsDir);
      
      for (const modelFile of modelFiles) {
        moduleInfo.models.push({
          name: modelFile.name.replace(/\.\w+$/, ''),
          docComments: extractDocComments(modelFile.fullPath)
        });
      }
    }
    
    modules.push(moduleInfo);
  }
  
  // Generate modules markdown
  let modulesMarkdown = '# Medusa Modules Documentation\n\n';
  modulesMarkdown += `## Overview\n\n${overview}\n\n`;
  modulesMarkdown += '## Custom Modules\n\n';
  
  for (const module of modules) {
    modulesMarkdown += `### ${module.name}\n\n`;
    
    if (module.docComments.length) {
      modulesMarkdown += '**Description:**\n\n';
      for (const comment of module.docComments) {
        modulesMarkdown += `${comment}\n\n`;
      }
    }
    
    if (module.models.length) {
      modulesMarkdown += '**Models:**\n\n';
      for (const model of module.models) {
        modulesMarkdown += `#### ${model.name}\n\n`;
        if (model.docComments.length) {
          for (const comment of model.docComments) {
            modulesMarkdown += `${comment}\n\n`;
          }
        }
      }
    }
    
    if (module.services.length) {
      modulesMarkdown += '**Services:**\n\n';
      for (const service of module.services) {
        modulesMarkdown += `#### ${service.name}\n\n`;
        if (service.docComments.length) {
          for (const comment of service.docComments) {
            modulesMarkdown += `${comment}\n\n`;
          }
        }
      }
    }
    
    modulesMarkdown += '\n';
  }
  
  fs.writeFileSync(path.join(config.outputDir, 'modules-documentation.md'), modulesMarkdown);
}

/**
 * Generate workflows documentation
 */
function generateWorkflowsDocs() {
  console.log('Generating workflows documentation...');
  
  const workflowsDir = config.components.workflows;
  const { files, directories } = analyzeDirectory(workflowsDir);
  
  // Create base workflows documentation file
  const readmePath = path.join(config.rootDir, workflowsDir, 'README.md');
  let overview = 'No overview available';
  
  if (fs.existsSync(readmePath)) {
    overview = fs.readFileSync(readmePath, 'utf8');
    
    // Remove frontmatter or markdown title if present
    overview = overview.replace(/^---[\s\S]*?---\n/, '');
    overview = overview.replace(/^# .*\n/, '');
  }
  
  // Generate workflows documentation
  const workflows = [];
  
  for (const file of files) {
    if (file.name.endsWith('.ts') && !file.name.endsWith('.spec.ts')) {
      const docComments = extractDocComments(file.fullPath);
      
      workflows.push({
        name: file.name.replace(/\.\w+$/, ''),
        path: file.path,
        docComments
      });
    }
  }
  
  // Generate workflows markdown
  let workflowsMarkdown = '# Medusa Workflows Documentation\n\n';
  workflowsMarkdown += `## Overview\n\n${overview}\n\n`;
  workflowsMarkdown += '## Custom Workflows\n\n';
  
  for (const workflow of workflows) {
    workflowsMarkdown += `### ${workflow.name}\n\n`;
    
    if (workflow.docComments.length) {
      for (const comment of workflow.docComments) {
        workflowsMarkdown += `${comment}\n\n`;
      }
    } else {
      workflowsMarkdown += 'No documentation available\n\n';
    }
    
    workflowsMarkdown += '\n';
  }
  
  fs.writeFileSync(path.join(config.outputDir, 'workflows-documentation.md'), workflowsMarkdown);
}

/**
 * Generate a complete backend documentation file
 */
function generateFullBackendDocs() {
  console.log('Generating complete backend documentation...');
  
  // Get the Medusa configuration
  const medusaConfigPath = path.join(config.rootDir, 'medusa-config.ts');
  let configSection = '';
  
  if (fs.existsSync(medusaConfigPath)) {
    const configContent = fs.readFileSync(medusaConfigPath, 'utf8');
    configSection = '```typescript\n' + configContent + '\n```';
  }
  
  // Count files in each directory
  const stats = {};
  for (const [key, dir] of Object.entries(config.components)) {
    const fullPath = path.join(config.rootDir, dir);
    if (fs.existsSync(fullPath)) {
      stats[key] = countFilesRecursive(fullPath);
    } else {
      stats[key] = 0;
    }
  }
  
  // Generate full documentation
  let fullDocs = '# Medusa Backend Documentation\n\n';
  
  fullDocs += '## Project Overview\n\n';
  fullDocs += 'This documentation provides a comprehensive overview of the Medusa backend implementation.\n\n';
  
  fullDocs += '## Project Statistics\n\n';
  fullDocs += '| Component | Files |\n';
  fullDocs += '|-----------|-------|\n';
  
  for (const [key, count] of Object.entries(stats)) {
    fullDocs += `| ${key} | ${count} |\n`;
  }
  
  fullDocs += '\n## Configuration\n\n';
  fullDocs += configSection + '\n\n';
  
  // Extract component overviews
  const components = {};
  
  for (const [key, dir] of Object.entries(config.components)) {
    const readmePath = path.join(config.rootDir, dir, 'README.md');
    if (fs.existsSync(readmePath)) {
      let content = fs.readFileSync(readmePath, 'utf8');
      content = content.replace(/^---[\s\S]*?---\n/, '').replace(/^# .*\n/, '');
      components[key] = content;
    } else {
      components[key] = 'No documentation available';
    }
  }
  
  // Add component documentation
  fullDocs += '## Components\n\n';
  
  for (const [key, content] of Object.entries(components)) {
    fullDocs += `### ${key}\n\n`;
    fullDocs += content + '\n\n';
  }
  
  fs.writeFileSync(path.join(config.outputDir, 'backend-documentation.md'), fullDocs);
}

/**
 * Count files in directory recursively
 */
function countFilesRecursive(dir, pattern = /\.(ts|js|tsx|jsx|md)$/) {
  if (!fs.existsSync(dir)) {
    return 0;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  let count = 0;
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      count += countFilesRecursive(fullPath, pattern);
    } else if (pattern.test(entry.name)) {
      count++;
    }
  }
  
  return count;
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('Starting Medusa documentation generation...');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    // Generate documentation
    generateApiDocs();
    generateModulesDocs();
    generateWorkflowsDocs();
    generateFullBackendDocs();
    
    console.log(`Documentation generated successfully in ${config.outputDir}`);
  } catch (error) {
    console.error('Error generating documentation:', error);
    process.exit(1);
  }
}

// Run the script
main();
