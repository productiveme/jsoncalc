const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
import YAML from 'yaml';
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

export const loadFile = (filePath: string) => {
  if (/(\.json)|(\.yml)$/i.test(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  console.warn('Only JSON and YAML files are supported');
  return;
};

export const parseJson = (contents: string) => {
  let json;
  try {
    json = JSON.parse(contents);
  } catch (err) {
    console.warn(
      (err as Error).message,
      '\n',
      'Invalid JSON, please fix and save again.'
    );
    return null;
  }
  return json;
};

export const parseYaml = (contents: string) => {
  let yml;
  try {
    yml = YAML.parse(contents);
  } catch (err) {
    console.warn(
      (err as Error).message,
      '\n',
      'Invalid YAML, please fix and save again.'
    );
    return null;
  }
  return yml;
};

export const jsoncalc = (
  filePath: string,
  {reducer = 'sum', applyChanges = () => {}}: JsonCalcOptions
) => {
  const contents = loadFile(filePath);
  const hash = /\.json$/i.test(filePath)
    ? parseJson(contents)
    : parseYaml(contents);

  if (hash === null) return;

  const snapshot = Object.assign({}, hash);

  const result = reducer
    .split(',')
    .reduce(
      (prev, cur: string) => reducers[cur as keyof typeof reducers](prev),
      hash
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
      if (/\.json$/i.test(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
      }
      if (/\.yml$/i.test(filePath)) {
        fs.writeFileSync(filePath, YAML.stringify(result));
      }
    },
  };
  jsoncalc(filePath, opts);
  const watcher = chokidar.watch(filePath);
  watcher.on('change', () => jsoncalc(filePath, opts));
};
