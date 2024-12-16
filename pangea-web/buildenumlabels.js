/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');
const { join } = require('path');

const dataContractsPath = join(
  __dirname,
  '../pangea-web/lib/api/v2/data-contracts.ts',
);
const dynamicMappingsPath = join(
  __dirname,
  '../pangea-web/lib/dynamicMappings.ts',
);

// Read the data-contracts.ts file
const dataContractsContent = readFileSync(dataContractsPath, 'utf-8');

// Regular expression to match enum declarations with comments
const enumRegex = /\/\*\*([\s\S]*?)\*\/\s*export enum (\w+) {(.+?)}/gs;

// Function to escape special characters in labels
function escapeLabel(label) {
  return label.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Extract enum names, values, and comments
const enumMatches = [...dataContractsContent.matchAll(enumRegex)];

// Generate the dynamicMappings.ts content
const dynamicMappingsContent = enumMatches
  .map(([, commentBlock, enumName, enumValuesString]) => {
    const enumValues = enumValuesString
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value !== '');

    // Parse comments to extract labels
    const labelMap = {};
    commentBlock.split('\n').forEach((line) => {
      const match = line.match(/\*\s*`([^`]+)`\s*-\s*(.*)/);
      if (match) {
        labelMap[match[1]] = match[2].trim();
      }
    });

    const mappings = enumValues
      .map((value) => {
        const [key, enumValue] = value
          .split('=')
          .map((part) => part.trim().replace(/'/g, ''));
        const formattedKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
        const label = labelMap[enumValue] || labelMap[key.toLowerCase()] || key;
        const escapedLabel = escapeLabel(label);
        return `[${enumName}.${formattedKey}]: '${escapedLabel}'`;
      })
      .join(',\n  ');

    return `export const ${enumName}_LABEL_MAP: Record<${enumName}, string> = {\n  ${mappings},\n};`;
  })
  .join('\n\n');

// Generate the import statements
const importStatements = enumMatches
  .map(([, , enumName]) => enumName)
  .join(',\n');

// Write the dynamicMappings.ts file
writeFileSync(
  dynamicMappingsPath,
  `import { ${importStatements} } from './api/v2/data-contracts';\n\n${dynamicMappingsContent}\n`,
);

// Run ESLint with the --fix option
execSync(`npx eslint --fix ${dynamicMappingsPath}`);
