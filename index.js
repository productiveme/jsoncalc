const fs = require("fs");
const json = require("./data.json");
const path = require("path");

const snapshot = Object.assign({}, json);

const isObject = (x) =>
  typeof x === "object" && x !== null && !Array.isArray(x);

const reduce = (
  hash,
  reducer = (a, b) => a + b,
  reducerName = "_total",
  initialValue = 0,
  clean = (res) => Number(res.toFixed(2))
) => {
  const reducerResult = Object.keys(hash).reduce(
    (prevValue, currentKey) => {
      if (currentKey === reducerName) return prevValue;
      let a = prevValue;
      let b = hash[currentKey];
      if (isObject(b)) {
        hash[currentKey] = reduce(hash[currentKey]);
        b = hash[currentKey][reducerName];
      }
      return reducer(a, b);
    },
    initialValue
  );
  hash[reducerName] = clean(reducerResult);
  return hash;
};

const result = reduce(json);

if (JSON.stringify(snapshot) === JSON.stringify(result)) return;

fs.writeFileSync(
  path.resolve(__dirname, "./data.json"),
  JSON.stringify(result, null, 2)
);
