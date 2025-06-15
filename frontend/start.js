const { spawn } = require('child_process');
const path = require('path');

const app = spawn('npm', ['start'], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || 3000
  }
});

app.on('close', (code) => {
  console.log(`App exited with code ${code}`);
  process.exit(code);
});