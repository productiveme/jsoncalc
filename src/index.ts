#!/usr/bin/env node

import {program} from 'commander';
import {version} from '../package.json';
import {reducers} from './reducers';
import {watch} from './jsoncalc';

program
  .version(version)
  .arguments('<pathToJson>')
  .description(
    'Watches for changes and adds calculated elements to each hashmap in the json file at <pathToJson>'
  )
  .option(
    '-r, --reducer <reducer>',
    `One or more (comma separated) of the available reducer computations: [${Object.keys(
      reducers
    ).join(', ')}]. (default: sum)`
  )
  .action(watch);

program.parse(process.argv);
