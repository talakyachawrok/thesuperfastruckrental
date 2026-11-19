/**
 * SuperFast Backend Server Launcher
 * Launches the TypeScript Express application using tsx runtime
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverTs = path.join(__dirname, 'server.ts');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const child = spawn(npxCmd, ['tsx', serverTs], {
  stdio: 'inherit',
  shell: isWin,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
