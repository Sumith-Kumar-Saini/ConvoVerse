const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  sourcemap: true,
  logLevel: 'info',

  absWorkingDir: path.resolve(__dirname),
  tsconfig: path.resolve(__dirname, '../../tsconfig.base.json'),

  external: ['bullmq', 'ioredis'],

  watch: isWatch && {
    onRebuild(error) {
      if (error) console.error('❌ rebuild failed', error);
      else console.log('✅ rebuild succeeded');
    },
  },
});
