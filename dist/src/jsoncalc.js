"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.jsoncalc = exports.loadJson = void 0;
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const reducers_1 = require("./reducers");
const loadJson = (filePath) => {
    let json;
    try {
        json = JSON.parse(fs.readFileSync(filePath));
    }
    catch (err) {
        console.warn('Invalid JSON, please fix and save again.');
        return;
    }
    return json;
};
exports.loadJson = loadJson;
const jsoncalc = (filePath, { reducer = 'sum', applyChanges = () => { } }) => {
    const json = exports.loadJson(filePath);
    const snapshot = Object.assign({}, json);
    const result = reducer
        .split(',')
        .reduce((prev, cur) => reducers_1.reducers[cur](prev), json);
    if (JSON.stringify(snapshot) === JSON.stringify(result))
        return;
    applyChanges({ filePath, result });
};
exports.jsoncalc = jsoncalc;
const watch = (pathToJson, { reducer = 'sum' }) => {
    const filePath = path.resolve(process.cwd(), pathToJson);
    console.log(`Watching for changes in ${pathToJson} ...`);
    const opts = {
        reducer,
        applyChanges: ({ filePath, result }) => {
            fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
        },
    };
    exports.jsoncalc(filePath, opts);
    const watcher = chokidar.watch(filePath);
    watcher.on('change', () => exports.jsoncalc(filePath, opts));
};
exports.watch = watch;
//# sourceMappingURL=jsoncalc.js.map