import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.resolve(__dirname, '../config/lgu.config.json');
const templatePath = path.resolve(
  __dirname,
  '../src/data/seo-metadata.template.json'
);
const outputPath = path.resolve(__dirname, '../src/data/seo-metadata.json');

/**
 * Recursively traverse a parsed JSON value and replace all {{token}} occurrences
 * in any string leaf, across objects, arrays, and primitives.
 * @param {unknown} value - Current node in the parsed tree
 * @param {Record<string, string>} replacements - Token-to-value map (keys are raw token names, e.g. 'lguName')
 * @returns {unknown} - The same structure with all tokens replaced
 */
function replaceTokens(value, replacements) {
  if (typeof value === 'string') {
    return value.replace(/\{\{([\w\d_]+)\}\}/g, (match, token) => {
      return Object.prototype.hasOwnProperty.call(replacements, token)
        ? replacements[token]
        : match;
    });
  }
  if (Array.isArray(value)) {
    return value.map(item => replaceTokens(item, replacements));
  }
  if (value !== null && typeof value === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = replaceTokens(v, replacements);
    }
    return result;
  }
  // numbers, booleans, null — pass through
  return value;
}

/**
 * Extract all unique {{token}} names from a raw template string.
 * @param {string} templateStr - Raw JSON template file contents
 * @returns {string[]} - Unique token names found
 */
function extractTokens(templateStr) {
  const tokenRegex = /\{\{([\w\d_]+)\}\}/g;
  const tokens = new Set();
  let match;
  while ((match = tokenRegex.exec(templateStr)) !== null) {
    tokens.add(match[1]);
  }
  return [...tokens];
}

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const templateStr = fs.readFileSync(templatePath, 'utf-8');

  // Generate fallback domain if empty
  const portalName = config.portal.name;
  const portalDomain =
    config.portal.domain || `${portalName.toLowerCase()}.org`;

  // Define token-to-value replacements (keys match {{token}} names in template)
  const replacements = {
    portalDomain,
    portalName,
    lguName: config.lgu.name,
    lguFullName: config.lgu.fullName,
    province: config.lgu.province,
    region: config.lgu.region,
  };

  // Validate: all tokens in the template must be present in replacements
  const templateTokens = extractTokens(templateStr);
  const missingTokens = templateTokens.filter(
    token => !Object.prototype.hasOwnProperty.call(replacements, token)
  );
  if (missingTokens.length > 0) {
    throw new Error(
      `SEO template contains tokens not defined in replacements: ${missingTokens.map(t => `{{${t}}}`).join(', ')}.\n` +
        `Add these keys to the replacements map in scripts/generate-seo.js.`
    );
  }

  // Parse the template, perform recursive replacement on the tree, then stringify
  const parsedTemplate = JSON.parse(templateStr);
  const replaced = replaceTokens(parsedTemplate, replacements);
  const outputStr = JSON.stringify(replaced, null, 2);

  // Final validation: ensure output is parseable JSON before writing to disk
  JSON.parse(outputStr);

  fs.writeFileSync(outputPath, outputStr, 'utf-8');
  console.log('SEO metadata generated successfully from template.');
} catch (error) {
  console.error('Error generating SEO metadata:', error.message ?? error);
  process.exit(1);
}
