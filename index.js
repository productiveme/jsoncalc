#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const { version } = require("./package.json");
const reducers = require("./reducers");
const chokidar = require("chokidar");

program
  .version(version)
  .arguments("<pathToJson>")
  .description(
    "Watches for changes and adds calculated elements to each hashmap in the json file at <pathToJson>"
  )
  .option(
    "-r, --reducer <reducer>",
    `One or more (comma seperated) of the available reducer computations, e.g. [${Object.keys(
      reducers
    ).join(", ")}]. (default: sum)`
  ).action((pathToJson, { reducer = 'sum' }) => {
    const filePath = path.resolve(process.cwd(), pathToJson);
    console.log(`Watching for changes in ${pathToJson} ...`);
    const watcher = chokidar.watch(filePath);
    watcher.on('change', () => {
      let json;
      try {
        json = JSON.parse(fs.readFileSync(filePath));
      } catch (err) {
        console.log("Invalid JSON, please fix and save again.")
        return
      }
      const snapshot = Object.assign({}, json);
      const result = reducer.split(',').reduce((prev, cur) => {
        return reducers[cur](prev);
      }, json);
      if (JSON.stringify(snapshot) === JSON.stringify(result)) return;
      fs.writeFileSync(
        filePath,
        JSON.stringify(result, null, 2)
      );
    });    
  });

  program.parse(process.argv);
