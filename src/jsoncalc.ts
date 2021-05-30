const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
import {reducers} from './reducers';

type ApplyChangesOptions = {
  filePath: string;
  result: string;
};

type ApplyChangesCallback = (opts: ApplyChangesOptions) => void;

type JsonCalcOptions = {
  reducer?: string;
  applyChanges?: ApplyChangesCallback;
};

export const loadJson = (filePath: string) => {
  let json;
  try {
    json = JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    console.warn('Invalid JSON, please fix and save again.');
    return;
  }
  return json;
};

export const jsoncalc = (
  filePath: string,
  {reducer = 'sum', applyChanges = () => {}}: JsonCalcOptions
) => {
  const json = loadJson(filePath);
  const snapshot = Object.assign({}, json);

  const result = reducer
    .split(',')
    .reduce(
      (prev, cur: string) => reducers[cur as keyof typeof reducers](prev),
      json
    );
  if (JSON.stringify(snapshot) === JSON.stringify(result)) return;
  applyChanges({filePath, result});
};

export const watch = (pathToJson: string, {reducer = 'sum'}) => {
  const filePath = path.resolve(process.cwd(), pathToJson);
  console.log(`Watching for changes in ${pathToJson} ...`);
  const opts = {
    reducer,
    applyChanges: ({filePath, result}: ApplyChangesOptions) => {
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
    },
  };
  jsoncalc(filePath, opts);
  const watcher = chokidar.watch(filePath);
  watcher.on('change', () => jsoncalc(filePath, opts));
};
