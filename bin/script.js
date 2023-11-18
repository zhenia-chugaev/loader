#!/usr/bin/env node

import { Command } from 'commander';
import loadPage from '../src/main.js';

const program = new Command();

program
  .name('page-loader')
  .description('Page loader utility')
  .version('0.1.0', '-v, --version')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .argument('<url>')
  .allowExcessArguments(false);

program.action((url, { output }) => {
  const options = {
    renderer: 'default',
  };
  loadPage(url, output, options)
    .then(({ filepath }) => console.log(
      `Page was successfully downloaded into '${filepath}'`,
    ))
    .catch((err) => {
      console.error(`error: ${err.message}`);
      process.exit(1);
    });
});

program.parse(process.argv);
