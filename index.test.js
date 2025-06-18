import { execSync, spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('dotairc CLI tool', () => {
    const indexPath = path.join(__dirname, 'index.js');
    const testAircPath = path.join(__dirname, '.airc');

    // Clean up any .airc files created during tests
    afterEach(async () => {
        try {
            await fs.remove(testAircPath);
        } catch (error) {
            // File might not exist, ignore error
        }
    });

    describe('CLI argument parsing', () => {
        test('should display error when no stack is provided', done => {
            const child = spawn('node', [indexPath], {
                stdio: 'pipe'
            });

            let stderr = '';
            child.stderr.on('data', data => {
                stderr += data.toString();
            });

            child.on('close', code => {
                expect(code).toBe(1);
                expect(stderr).toContain('Please provide a technology stack using --stack option');
                done();
            });
        });

        test('should display error when empty stack is provided', done => {
            const child = spawn('node', [indexPath, '--stack', ''], {
                stdio: 'pipe'
            });

            let stderr = '';
            child.stderr.on('data', data => {
                stderr += data.toString();
            });

            child.on('close', code => {
                expect(code).toBe(1);
                expect(stderr).toContain('Please provide a technology stack using --stack option');
                done();
            });
        });

        test('should display help when --help is used', done => {
            const child = spawn('node', [indexPath, '--help'], {
                stdio: 'pipe'
            });

            let stdout = '';
            child.stdout.on('data', data => {
                stdout += data.toString();
            });

            child.on('close', code => {
                expect(code).toBe(0);
                expect(stdout).toContain('Generate .airc files for your AI agents');
                expect(stdout).toContain('-stack, --stack');
                expect(stdout).toContain('Comma-separated list of technologies');
                done();
            });
        });
    });

    describe('File generation', () => {
        test('should generate .airc file with valid technology', done => {
            const child = spawn('node', [indexPath, '--stack', 'vue'], {
                stdio: 'pipe',
                cwd: __dirname
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', data => {
                stdout += data.toString();
            });

            child.stderr.on('data', data => {
                stderr += data.toString();
            });

            child.on('close', async code => {
                expect(code).toBe(0);
                expect(stdout).toContain('.airc file generated successfully!');

                // Check if .airc file was created
                const exists = await fs.pathExists(testAircPath);
                expect(exists).toBe(true);

                if (exists) {
                    const content = await fs.readFile(testAircPath, 'utf-8');
                    expect(content).toContain('# AI Agent Instructions');
                    expect(content).toContain('Vue.js'); // Should contain Vue.js content from template
                }

                done();
            });
        });

        test('should generate .airc file with multiple technologies', done => {
            const child = spawn('node', [indexPath, '--stack', 'vue,html'], {
                stdio: 'pipe',
                cwd: __dirname
            });

            let stdout = '';

            child.stdout.on('data', data => {
                stdout += data.toString();
            });

            child.on('close', async code => {
                expect(code).toBe(0);
                expect(stdout).toContain('.airc file generated successfully!');

                // Check if .airc file was created
                const exists = await fs.pathExists(testAircPath);
                expect(exists).toBe(true);

                if (exists) {
                    const content = await fs.readFile(testAircPath, 'utf-8');
                    expect(content).toContain('# AI Agent Instructions');
                    // Should contain content from both templates
                    expect(content.length).toBeGreaterThan(100); // Combined content should be longer
                }

                done();
            });
        });

        test('should handle technologies with spaces', done => {
            const child = spawn('node', [indexPath, '--stack', ' vue , html '], {
                stdio: 'pipe',
                cwd: __dirname
            });

            child.on('close', async code => {
                expect(code).toBe(0);

                const exists = await fs.pathExists(testAircPath);
                expect(exists).toBe(true);

                done();
            });
        });

        test('should handle non-existent technology gracefully', done => {
            const child = spawn('node', [indexPath, '--stack', 'nonexistent'], {
                stdio: 'pipe',
                cwd: __dirname
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', data => {
                stdout += data.toString();
            });

            child.stderr.on('data', data => {
                stderr += data.toString();
            });

            child.on('close', async code => {
                expect(code).toBe(0);
                expect(stdout).toContain('.airc file generated successfully!');
                expect(stderr).toContain('Warning: No template found for nonexistent');

                // Should still create .airc file with basic content
                const exists = await fs.pathExists(testAircPath);
                expect(exists).toBe(true);

                if (exists) {
                    const content = await fs.readFile(testAircPath, 'utf-8');
                    expect(content).toContain('# AI Agent Instructions');
                }

                done();
            });
        });
    });

    describe('Template system', () => {
        test('should read existing template files', async () => {
            const templatesDir = path.join(__dirname, 'templates');
            const vueTemplatePath = path.join(templatesDir, 'vue.md');

            // Check if vue template exists
            const exists = await fs.pathExists(vueTemplatePath);
            expect(exists).toBe(true);

            if (exists) {
                const content = await fs.readFile(vueTemplatePath, 'utf-8');
                expect(content.length).toBeGreaterThan(0);
                expect(content).toContain('Vue.js');
            }
        });

        test('should have templates directory', async () => {
            const templatesDir = path.join(__dirname, 'templates');
            const exists = await fs.pathExists(templatesDir);
            expect(exists).toBe(true);

            const files = await fs.readdir(templatesDir);
            expect(files.length).toBeGreaterThan(0);
            expect(files).toContain('vue.md');
        });
    });

    describe('Error handling', () => {
        test('should handle case-insensitive technology names', done => {
            const child = spawn('node', [indexPath, '--stack', 'VUE,Html'], {
                stdio: 'pipe',
                cwd: __dirname
            });

            child.on('close', async code => {
                expect(code).toBe(0);

                const exists = await fs.pathExists(testAircPath);
                expect(exists).toBe(true);

                done();
            });
        });
    });
});
