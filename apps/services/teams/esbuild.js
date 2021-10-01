const { build } = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');

(async () => {
  await build({
    platform: 'node',
    target: 'node14',
    bundle: true,
    sourcemap: false,
    external: [
      '@nestjs/microservices',
      'cache-manager',
      'class-transformer',
      'class-validator',
      '@nestjs/websockets/socket-module',
      'aws-sdk'
    ],
    plugins: [await esbuildDecorators({ tsconfig: './tsconfig.json' })],
    entryPoints: ['./src/app/index.ts'],
    outdir: './dist',
    tsconfig: './tsconfig.json',
    format: 'cjs'
  })
})()
