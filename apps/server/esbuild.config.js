const esbuild = require('esbuild');
const path = require('path');

const args = process.argv.slice(2);

const watchMode = args.includes('--watch');
const devFlag = args.includes('--dev');
const minifyFlag = args.includes('--minify');
const sourcemapFlag = args.includes('--sourcemap');

const isDev = watchMode || devFlag;

const baseConfig = {
  entryPoints: ['src/server.ts'],
  platform: 'node',
  target: ['esnext'],
  format: 'cjs',
  logLevel: 'info',
  bundle: true,
  absWorkingDir: path.resolve(__dirname),
  tsconfig: path.resolve(__dirname, '../../tsconfig.base.json'),
  loader: { '.ts': 'ts' },
};

const devConfig = {
  outdir: 'dist',
  sourcemap: sourcemapFlag ? true : 'inline',
  minify: false,
};

const prodConfig = {
  outfile: 'dist/bundle.js',
  minify: minifyFlag ? true : false,
  sourcemap: sourcemapFlag ? true : false,
};

const modeConfig = isDev ? devConfig : prodConfig;
const finalConfig = { ...baseConfig, ...modeConfig };

async function main() {
  try {
    if (watchMode) {
      process.stdout.write('Starting build in watch mode…\n');

      const ctx = await esbuild.context(finalConfig);

      await ctx.watch();
      process.stdout.write('Watching for file changes… (Press Ctrl+C to stop)\n');

      const shutdown = async () => {
        process.stdout.write('\nStopping watch mode…\n');
        await ctx.dispose();
        process.exit(0);
      };

      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
    } else {
      process.stdout.write('Building…\n');
      await esbuild.build(finalConfig);
      process.stdout.write('Build finished\n');
    }
  } catch (error) {
    process.stderr.write(String(error));
    process.exit(1);
  }
}

void main();
