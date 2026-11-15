const esbuild = require('esbuild');
const Module = require('node:module');
const path = require('node:path');

esbuild.build({ entryPoints: [path.join(__dirname, 'account-state.mjs')], bundle: true, platform: 'node', format: 'cjs', write: false })
  .then((result) => {
    const compiled = new Module(path.join(__dirname, 'account-state.bundle.cjs'), module);
    compiled.filename = path.join(__dirname, 'account-state.bundle.cjs');
    compiled.paths = module.paths;
    compiled._compile(result.outputFiles[0].text, compiled.filename);
  })
  .catch((error) => { console.error(error); process.exitCode = 1; });
