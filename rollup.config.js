import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import pkg from './package.json';
import analyze from 'rollup-plugin-analyzer'

export default {
  input: pkg.source,
  output: [
    {/*preserveModules: false, exports: 'named',*/ file: pkg.main, format: 'cjs' },
    {/*preserveModules: false, exports: 'named',*/ file: pkg.module, format: 'esm' }
  ],
  plugins: [
    external(),
    resolve(),
    babel(),
    commonjs(),
    del({ targets: ['dist/*']}),
    analyze
  ],
  external: [ ...Object.keys({ ...pkg.peerDependencies } || {}), 'flagsmith', 'prop-types']
}