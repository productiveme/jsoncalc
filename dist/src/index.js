#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const package_json_1 = require("../package.json");
const reducers_1 = require("./reducers");
const jsoncalc_1 = require("./jsoncalc");
commander_1.program
    .version(package_json_1.version)
    .arguments('<pathToJson>')
    .description('Watches for changes and adds calculated elements to each hashmap in the json file at <pathToJson>')
    .option('-r, --reducer <reducer>', `One or more (comma seperated) of the available reducer computations: [${Object.keys(reducers_1.reducers).join(', ')}]. (default: sum)`)
    .action(jsoncalc_1.jsoncalc);
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map