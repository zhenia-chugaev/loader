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
  loadPage(url, output)
    .then(({ filepath }) => console.log(filepath))
    .catch((err) => console.error(err.message));
});

program.parse(process.argv);
