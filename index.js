const fs = require('fs');
const json = require('./input.json');
const path = require('path');


const isObject = x => typeof x === 'object' && x !== null && !Array.isArray(x);

const compute = (hash, computation = (a,b) => a + b, computationName = '_total', initialValue = 0) => {
  const computationResult = Object.keys(hash).reduce((computedValue,currentKey) => {
    if (currentKey === computationName) return computedValue;
    let a = computedValue;
    let b = hash[currentKey];
    if(isObject(b)) {
      hash[currentKey] = compute(hash[currentKey]);
      b = hash[currentKey][computationName];
    }
    return computation(a,b);
  }, initialValue);
  hash[computationName] = computationResult;
  return hash;
}

const result = compute(json);

fs.writeFileSync(path.resolve(__dirname, './input.json'), JSON.stringify(result,null,2));