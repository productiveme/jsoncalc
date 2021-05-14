const REDUCER_PREFIX = "_";

const isObject = (x) =>
  typeof x === "object" && x !== null && !Array.isArray(x);

const reduce = ({
  hash,
  reducerName = "",
  reducer = (prev, cur) => prev,
  initialValue = 0,
  clean = (res) => res,
}) => {
  const reducerResult = Object.keys(hash).reduce((prevValue, currentKey) => {
    if (currentKey.startsWith(REDUCER_PREFIX)) return prevValue;
    let a = prevValue;
    let b = hash[currentKey];
    if (isObject(b)) {
      hash[currentKey] = reduce({
        hash: hash[currentKey],
        reducerName,
        reducer,
        initialValue,
        clean,
      });
      b = hash[currentKey][`${REDUCER_PREFIX}${reducerName}`];
    }
    if (Array.isArray(b)) {
      b = b.reduce((prev, cur) => reducer(prev, cur), initialValue);
    }
    return reducer(a, b, hash);
  }, initialValue);
  hash[`${REDUCER_PREFIX}${reducerName}`] = clean(reducerResult);
  return hash;
};

const sum = (hash) =>
  reduce({
    hash,
    reducerName: "total",
    initialValue: 0,
    reducer: (a, b) => a + b,
    clean: (res) => Number(res.toFixed(2)),
  });

const count = (hash) =>
  reduce({
    hash,
    reducerName: "count",
    initialValue: 0,
    reducer: (a) => a + 1,
  });

const avg = (hash) =>
  reduce({
    hash: count(sum(hash)),
    reducerName: "avg",
    initialValue: 0,
    reducer: (a, b, h) => {
      if (Number.isNaN(h._total)) return a;
      if (Number.isNaN(h._count)) return a;
      return Number(h._total) / Number(h._count);
    },
    clean: (res) => Number(res.toFixed(3)),
  });

const yep = (hash) =>
  reduce({
    hash,
    reducerName: "yep",
    initialValue: 0,
    reducer(a, b) {
      return a + (b ? 1 : 0);
    },
    clean: (res) => res,
  });

const nope = (hash) =>
  reduce({
    hash,
    reducerName: "nope",
    initialValue: 0,
    reducer(a, b) {
      return a + (b ? 0 : 1);
    },
    clean: (res) => res,
  });

const reducers = {
  sum,
  count,
  avg,
  yep,
  nope,
};

module.exports = reducers;
