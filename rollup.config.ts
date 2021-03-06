import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import camelCase from 'lodash/camelCase'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json')
const { libraryName } = pkg
const isProduction = process.env.NODE_ENV === 'production'

const libConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true,
      exports: 'named',
    },
    { file: pkg.module, format: 'esm', sourcemap: true, exports: 'named' },
  ],
}

const sharedConfig = {
  // Indicate here external modules manually
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // external modules you don't wanna include in your bundle taken from peerDependencies
    external(),
    // Compile TypeScript files
    typescript({
      clean: isProduction,
      objectHashIgnoreUnknownHack: true,
      useTsconfigDeclarationDir: true,
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
    isProduction && terser(),
  ],
}

export default [{ ...libConfig, ...sharedConfig }]
