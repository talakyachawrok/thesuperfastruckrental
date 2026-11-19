/**
 * SuperFast Backend Server Launcher
 * Launches the TypeScript Express application using tsx runtime
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverTs = path.join(__dirname, 'server.ts');

const child = spawn('npx', ['tsx', serverTs], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
