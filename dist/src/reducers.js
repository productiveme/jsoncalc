"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducers = void 0;
const REDUCER_PREFIX = '_';
const isObject = (x) => typeof x === 'object' && x !== null && !Array.isArray(x);
const reduce = ({ hash = {}, reducerName = '', reducer = (prev) => prev, initialValue = 0, clean = (res) => res, }) => {
    const reducerResult = Object.keys(hash).reduce((prevValue, currentKey) => {
        if (currentKey.startsWith(REDUCER_PREFIX))
            return prevValue;
        const a = prevValue;
        let b = hash[currentKey];
        if (Array.isArray(b)) {
            b = b.reduce((prev, cur) => reducer(prev, cur), initialValue);
        }
        if (isObject(b)) {
            hash[currentKey] = reduce({
                hash: hash[currentKey],
                reducerName,
                reducer,
                initialValue,
                clean,
            });
            // using an array to indicate the results are from a child object
            b = [hash[currentKey][`${REDUCER_PREFIX}${reducerName}`]];
        }
        return reducer(a, b, hash);
    }, initialValue);
    hash[`${REDUCER_PREFIX}${reducerName}`] = clean(reducerResult);
    return hash;
};
const sum = (hash) => reduce({
    hash,
    reducerName: 'total',
    initialValue: 0,
    reducer(a, b) {
        return Array.isArray(b) ? a + b[0] : a + b;
    },
    clean: (res) => Number(res.toFixed(2)),
});
const count = (hash) => reduce({
    hash,
    reducerName: 'count',
    initialValue: 0,
    reducer(a, b) {
        return Array.isArray(b) ? a + b[0] : a + 1;
    },
});
const avg = (hash) => reduce({
    hash: count(sum(hash)),
    reducerName: 'avg',
    initialValue: 0,
    reducer(a, b, h) {
        if (Number.isNaN(h._total))
            return a;
        if (Number.isNaN(h._count))
            return a;
        return Number(h._total) / Number(h._count);
    },
    clean: (res) => Number(res.toFixed(3)),
});
const yep = (hash) => reduce({
    hash,
    reducerName: 'yep',
    initialValue: 0,
    reducer(a, b) {
        return Array.isArray(b) ? a + b[0] : a + (b ? 1 : 0);
    },
    clean: (res) => res,
});
const nope = (hash) => reduce({
    hash,
    reducerName: 'nope',
    initialValue: 0,
    reducer(a, b) {
        return Array.isArray(b) ? a + b[0] : a + (b ? 0 : 1);
    },
    clean: (res) => res,
});
exports.reducers = {
    sum: sum,
    count: count,
    avg: avg,
    yep: yep,
    nope: nope,
};
//# sourceMappingURL=reducers.js.map