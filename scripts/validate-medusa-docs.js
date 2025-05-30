#!/usr/bin/env node

/**
 * JSDoc Validation Script for Medusa Backend
 * 
 * This script analyzes TypeScript files in the Medusa backend to identify
 * missing or incomplete JSDoc documentation and provides recommendations
 * for improving documentation quality.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  rootDir: path.resolve(__dirname, '../backend/medusa'),
  sourceDir: path.resolve(__dirname, '../backend/medusa/src'),
  outputFile: path.resolve(__dirname, '../docs/generated/documentation-issues.md'),
  components: {
    api: 'src/api',
    modules: 'src/modules',
    workflows: 'src/workflows',
    subscribers: 'src/subscribers',
    jobs: 'src/jobs',
    admin: 'src/admin',
    scripts: 'src/scripts',
    links: 'src/links',
  },
  // JSDoc tags that should be present for functions, classes, etc.
  requiredTags: {
    function: ['description', 'param', 'returns'],
    class: ['description'],
    interface: ['description'],
    method: ['description', 'param', 'returns'],
  }
};

/**
 * Find all TypeScript files in a directory recursively
 */
function findTypeScriptFiles(dir) {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      results.push(...findTypeScriptFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

/**
 * Check if a function has JSDoc comments
 */
function checkJSDocForFunction(content, functionMatch, functionName) {
  const functionPos = functionMatch.index;
  const beforeFunction = content.substring(0, functionPos).trim();
  
  // Check if there's a JSDoc comment before the function
  const jsdocRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*$/;
  const jsdocMatch = beforeFunction.match(jsdocRegex);
  
  if (!jsdocMatch) {
    return {
      hasJSDoc: false,
      missingTags: config.requiredTags.function,
      recommendation: `Add JSDoc comment for function "${functionName}"`,
    };
  }
  
  // Check for required tags
  const jsdocContent = jsdocMatch[1];
  const missingTags = [];
  
  for (const tag of config.requiredTags.function) {
    const tagRegex = new RegExp(`@${tag}\\b`);
    if (!tagRegex.test(jsdocContent)) {
      missingTags.push(tag);
    }
  }
  
  if (missingTags.length > 0) {
    return {
      hasJSDoc: true,
      missingTags,
      recommendation: `Add missing JSDoc tags (${missingTags.join(', ')}) to function "${functionName}"`,
    };
  }
  
  return {
    hasJSDoc: true,
    missingTags: [],
    recommendation: null,
  };
}

/**
 * Analyze a TypeScript file for JSDoc issues
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for function declarations and expressions
  const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)|(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g;
  let functionMatch;
  
  while ((functionMatch = functionRegex.exec(content)) !== null) {
    const functionName = functionMatch[1] || functionMatch[2];
    
    if (functionName) {
      const jsdocCheck = checkJSDocForFunction(content, functionMatch, functionName);
      
      if (!jsdocCheck.hasJSDoc || jsdocCheck.missingTags.length > 0) {
        issues.push({
          type: 'function',
          name: functionName,
          ...jsdocCheck,
        });
      }
    }
  }
  
  // Check for class declarations
  const classRegex = /(?:export\s+)?class\s+(\w+)/g;
  let classMatch;
  
  while ((classMatch = classRegex.exec(content)) !== null) {
    const className = classMatch[1];
    const classPos = classMatch.index;
    const beforeClass = content.substring(0, classPos).trim();
    
    // Check if there's a JSDoc comment before the class
    const jsdocRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*$/;
    const jsdocMatch = beforeClass.match(jsdocRegex);
    
    if (!jsdocMatch) {
      issues.push({
        type: 'class',
        name: className,
        hasJSDoc: false,
        missingTags: config.requiredTags.class,
        recommendation: `Add JSDoc comment for class "${className}"`,
      });
    } else {
      // Check for required tags
      const jsdocContent = jsdocMatch[1];
      const missingTags = [];
      
      for (const tag of config.requiredTags.class) {
        const tagRegex = new RegExp(`@${tag}\\b`);
        if (!tagRegex.test(jsdocContent)) {
          missingTags.push(tag);
        }
      }
      
      if (missingTags.length > 0) {
        issues.push({
          type: 'class',
          name: className,
          hasJSDoc: true,
          missingTags,
          recommendation: `Add missing JSDoc tags (${missingTags.join(', ')}) to class "${className}"`,
        });
      }
    }
    
    // Check for class methods
    const classContent = content.substring(classPos);
    const methodRegex = /(?:public|private|protected|static)?\s*(?:async\s+)?(\w+)\s*\([^)]*\)/g;
    let methodMatch;
    
    while ((methodMatch = methodRegex.exec(classContent)) !== null) {
      const methodName = methodMatch[1];
      
      if (methodName !== 'constructor' && !methodName.startsWith('_') && methodName !== className) {
        const methodPos = classPos + methodMatch.index;
        const beforeMethod = content.substring(0, methodPos).trim();
        
        // Check if there's a JSDoc comment before the method
        const methodJsdocMatch = beforeMethod.match(jsdocRegex);
        
        if (!methodJsdocMatch) {
          issues.push({
            type: 'method',
            name: `${className}.${methodName}`,
            hasJSDoc: false,
            missingTags: config.requiredTags.method,
            recommendation: `Add JSDoc comment for method "${className}.${methodName}"`,
          });
        } else {
          // Check for required tags
          const jsdocContent = methodJsdocMatch[1];
          const missingTags = [];
          
          for (const tag of config.requiredTags.method) {
            const tagRegex = new RegExp(`@${tag}\\b`);
            if (!tagRegex.test(jsdocContent)) {
              missingTags.push(tag);
            }
          }
          
          if (missingTags.length > 0) {
            issues.push({
              type: 'method',
              name: `${className}.${methodName}`,
              hasJSDoc: true,
              missingTags,
              recommendation: `Add missing JSDoc tags (${missingTags.join(', ')}) to method "${className}.${methodName}"`,
            });
          }
        }
      }
    }
  }
  
  return issues;
}

/**
 * Generate a markdown report for JSDoc issues
 */
function generateReport(allIssues) {
  let report = '# Documentation Issues Report\n\n';
  report += `Generated on ${new Date().toLocaleString()}\n\n`;
  
  if (Object.keys(allIssues).length === 0) {
    report += 'No documentation issues found!\n';
    return report;
  }
  
  // Count issues by type
  const issueStats = {
    function: 0,
    class: 0,
    method: 0,
    total: 0,
  };
  
  Object.values(allIssues).forEach(fileIssues => {
    fileIssues.forEach(issue => {
      issueStats[issue.type]++;
      issueStats.total++;
    });
  });
  
  report += '## Summary\n\n';
  report += `- Total issues: ${issueStats.total}\n`;
  report += `- Function issues: ${issueStats.function}\n`;
  report += `- Class issues: ${issueStats.class}\n`;
  report += `- Method issues: ${issueStats.method}\n\n`;
  
  report += '## Issues by File\n\n';
  
  Object.entries(allIssues).forEach(([filePath, fileIssues]) => {
    if (fileIssues.length === 0) {
      return;
    }
    
    const relativePath = path.relative(config.rootDir, filePath);
    report += `### ${relativePath}\n\n`;
    
    fileIssues.forEach(issue => {
      const missingTagsText = issue.missingTags.length > 0 ? `Missing tags: ${issue.missingTags.join(', ')}` : '';
      report += `- **${issue.name}** (${issue.type}): ${issue.hasJSDoc ? missingTagsText : 'No JSDoc'}\n`;
      report += `  - 💡 ${issue.recommendation}\n`;
    });
    
    report += '\n';
  });
  
  report += '## Recommendations\n\n';
  report += 'To improve documentation quality:\n\n';
  report += '1. Add JSDoc comments to all functions, classes, and methods\n';
  report += '2. Include description, param, and returns tags where applicable\n';
  report += '3. Use examples to demonstrate usage\n';
  report += '4. Run this validator regularly to check documentation coverage\n';
  
  return report;
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('Starting JSDoc validation...');
    
    // Ensure output directory exists
    const outputDir = path.dirname(config.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Find all TypeScript files
    const tsFiles = findTypeScriptFiles(config.sourceDir);
    console.log(`Found ${tsFiles.length} TypeScript files`);
    
    // Analyze files
    const allIssues = {};
    
    for (const file of tsFiles) {
      const issues = analyzeFile(file);
      if (issues.length > 0) {
        allIssues[file] = issues;
      }
    }
    
    // Generate report
    const report = generateReport(allIssues);
    fs.writeFileSync(config.outputFile, report);
    
    console.log(`Documentation validation complete! Report saved to ${config.outputFile}`);
    console.log(`Found ${Object.values(allIssues).flat().length} documentation issues`);
  } catch (error) {
    console.error('Error during JSDoc validation:', error);
    process.exit(1);
  }
}

// Run the script
main();
