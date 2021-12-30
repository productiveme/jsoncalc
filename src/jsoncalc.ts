const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
import YAML from 'yaml';
import {reducers} from './reducers';

type ApplyChangesOptions = {
  filePath: string;
  result: string;
  snapshot: string;
};

type ApplyChangesCallback = (opts: ApplyChangesOptions) => void;

type JsonCalcOptions = {
  reducer?: string;
  applyChanges?: ApplyChangesCallback;
};

export const loadFile = (filePath: string) => {
  if (isJson(filePath) || isYaml(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  console.warn('Only JSON and YAML files are supported');
  return;
};

export const isJson = (filePath: string) => {
  return /^\.json$/i.test(path.extname(filePath));
};

export const isYaml = (filePath: string) => {
  return /^\.ya?ml$/i.test(path.extname(filePath));
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
  return {
    obj: json,
  };
};

export const parseYaml = (contents: string) => {
  let yml;
  let doc;
  try {
    yml = YAML.parse(contents);
    doc = YAML.parseDocument(contents);
  } catch (err) {
    console.warn(
      (err as Error).message,
      '\n',
      'Invalid YAML, please fix and save again.'
    );
    return null;
  }
  return {
    doc,
    obj: yml,
  };
};

export const parse = (filePath: string, snapshot: string) => {
  switch (true) {
    case isJson(filePath):
      return parseJson(snapshot);
    case isYaml(filePath):
      return parseYaml(snapshot);
    default:
      console.warn('File type not supported');
      return null;
  }
};

export const jsoncalc = (
  filePath: string,
  {reducer = 'sum', applyChanges = () => {}}: JsonCalcOptions
) => {
  const snapshot = loadFile(filePath);
  const parsed = parse(filePath, snapshot);

  if (parsed === null) return;

  const result = reducer
    .split(',')
    .reduce(
      (prev, cur: string) => reducers[cur as keyof typeof reducers](prev),
      parsed?.obj
    );
  applyChanges({filePath, result, snapshot});
};

export const watch = (pathToJson: string, {reducer = 'sum'}) => {
  const filePath = path.resolve(process.cwd(), pathToJson);
  console.log(`Watching for changes in ${pathToJson} ...`);
  const opts = {
    reducer,
    applyChanges: ({filePath, result, snapshot}: ApplyChangesOptions) => {
      let output = snapshot;
      if (isJson(filePath)) {
        output = JSON.stringify(result, null, 2);
      }
      if (isYaml(filePath)) {
        output = YAML.stringify(result);
      }
      if (output !== snapshot) {
        fs.writeFileSync(filePath, output);
      }
    },
  };
  jsoncalc(filePath, opts);
  const watcher = chokidar.watch(filePath);
  watcher.on('change', () => jsoncalc(filePath, opts));
};
