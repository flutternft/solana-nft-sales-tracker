/**
 * Run this file through a process manager like PM2. The node-cron module lets you periodically
 * execute tasks using a cron pattern. It supports second level granularity.
 */

import cron from 'node-cron';
import SalesTracker from './src/main.js';
import yargs from 'yargs'
import fs from 'fs';
import _ from 'lodash';

let configPath = yargs(process.argv).argv.config;
let overrides = yargs(process.argv).argv;
let outputType = overrides.outputType || 'console';

let config = JSON.parse(fs.readFileSync(configPath).toString());
config = _.assignIn(config, overrides);

cron.schedule('0 */3 * * * *', () => {
  console.log('Running a task every 3rd minute');
  let tracker = new SalesTracker(config, outputType);
  tracker.checkSales();
});