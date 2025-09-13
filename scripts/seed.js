const { execSync } = require('child_process');
const path = require('path');

// Run the TypeScript seed file with tsx
try {
  const seedFile = path.join(__dirname, 'seed-data.ts');
  execSync(`npx tsx ${seedFile}`, { stdio: 'inherit', cwd: process.cwd() });
} catch (error) {
  console.error('Error running seed script:', error);
  process.exit(1);
}