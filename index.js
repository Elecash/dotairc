#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('dotairc')
  .description('Generate .airc files for your AI agents')
  .option('-stack, --stack <technologies>', 'Comma-separated list of technologies', '')
  .parse(process.argv);

const options = program.opts();

async function generateAIRC() {
  const technologies = options.stack.split(',').map(tech => tech.trim().toLowerCase());
  let combinedContent = '# AI Agent Instructions\n\n';

  // Create templates directory structure if it doesn't exist
  const templatesDir = path.join(__dirname, 'templates');
  await fs.ensureDir(templatesDir);

  for (const tech of technologies) {
    const templatePath = path.join(templatesDir, `${tech}.md`);
    try {
      const content = await fs.readFile(templatePath, 'utf-8');
      combinedContent += `${content}\n\n`;
    } catch (error) {
      console.warn(`Warning: No template found for ${tech}`);
    }
  }

  // Write the combined content to .airc file
  await fs.writeFile('.airc', combinedContent);
  console.log('.airc file generated successfully!');
}

if (options.stack) {
  generateAIRC().catch(console.error);
} else {
  console.error('Please provide a technology stack using --stack option');
  process.exit(1);
}
