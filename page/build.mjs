// Inline the sim modules into the single-file page. usage: node page/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const strip = f => readFileSync(new URL(f, import.meta.url), 'utf8').replace(/^export /gm, '');
const out = readFileSync(new URL('./template.html', import.meta.url), 'utf8').replace('/*__SIM__*/', () => strip('../sim/core.js') + '\n' + strip('../sim/lens.js'));
writeFileSync(new URL('../index.html', import.meta.url), out);
console.log('index.html', (out.length / 1024).toFixed(1) + ' KB');
