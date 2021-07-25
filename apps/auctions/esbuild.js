const { build } = require('esbuild');

const isLocal = process.env.NODE_ENV === 'development';

(async () => {
  build({
    platform: 'node',
    target: 'node14',
    bundle: true,
    sourcemap: isLocal ? true : false,
    external: ['aws-sdk'],
    entryPoints: ['./src/main.js'],
    outdir: './dist',
    tsconfig: './tsconfig.json',
    format: 'cjs'
  })
})()
