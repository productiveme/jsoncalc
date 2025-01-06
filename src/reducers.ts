const REDUCER_PREFIX = '_';

const isObject = (x: unknown) =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

const isNumeric = (x: unknown): boolean => {
  if (typeof x === 'number') return true;
  if (typeof x === 'string') {
    return !isNaN(parseFloat(x)) && isFinite(Number(x));
  }
  return false;
};

const toNumber = (x: unknown): number => {
  if (typeof x === 'number') return x;
  if (typeof x === 'string') return parseFloat(x);
  return 0;
};

type ReduceOptions = {
  hash?: Object;
  reducerName: string;
  reducer: Function;
  initialValue: unknown;
  clean?: Function;
};

const reduce = ({
  hash = {},
  reducerName = '',
  reducer = (prev: unknown) => prev,
  initialValue = 0,
  clean = (res: unknown) => res,
}: ReduceOptions) => {
  const reducerResult = Object.keys(hash).reduce(
    (prevValue, currentKey: string) => {
      if (currentKey.startsWith(REDUCER_PREFIX)) return prevValue;
      const a = prevValue;
      let b: unknown = hash[currentKey as keyof typeof hash];
      
      if (Array.isArray(b)) {
        b = b.reduce((prev, cur) => reducer(prev, cur), initialValue);
      }
      
      if (isObject(b)) {
        (hash as any)[currentKey] = reduce({
          hash: hash[currentKey as keyof typeof hash],
          reducerName,
          reducer,
          initialValue,
          clean,
        });
        b = [(hash as any)[currentKey][`${REDUCER_PREFIX}${reducerName}`]];
      }
      
      return reducer(a, b, hash);
    },
    initialValue
  );
  (hash as any)[`${REDUCER_PREFIX}${reducerName}`] = clean(reducerResult);
  return hash;
};

const sum = (hash: Object) =>
  reduce({
    hash,
    reducerName: 'total',
    initialValue: 0,
    reducer(a: number, b: unknown | [number]) {
      if (Array.isArray(b)) return a + b[0];
      return isNumeric(b) ? a + toNumber(b) : a;
    },
    clean: (res: number) => Number(res.toFixed(2)),
  });

const count = (hash: Object) =>
  reduce({
    hash,
    reducerName: 'count',
    initialValue: 0,
    reducer(a: number, b: unknown | [number]) {
      if (Array.isArray(b)) return a + b[0];
      return isNumeric(b) ? a + 1 : a;
    },
  });

const avg = (hash: Object) =>
  reduce({
    hash: count(sum(hash)),
    reducerName: 'avg',
    initialValue: 0,
    reducer(a: unknown, b: unknown, h: {_total: unknown; _count: unknown}) {
      if (Number.isNaN(h._total)) return a;
      if (Number.isNaN(h._count)) return a;
      return Number(h._total) / Number(h._count);
    },
    clean: (res: number) => Number(res.toFixed(3)),
  });

const yep = (hash: Object) =>
  reduce({
    hash,
    reducerName: 'yep',
    initialValue: 0,
    reducer(a: number, b: unknown | [number]) {
      if (Array.isArray(b)) return a + b[0];
      return a + (b ? 1 : 0);
    },
    clean: (res: unknown) => res,
  });

const nope = (hash: Object) =>
  reduce({
    hash,
    reducerName: 'nope',
    initialValue: 0,
    reducer(a: number, b: unknown | [number]) {
      if (Array.isArray(b)) return a + b[0];
      return a + (b ? 0 : 1);
    },
    clean: (res: unknown) => res,
  });

export const reducers = {
  sum,
  count,
  avg,
  yep,
  nope,
};
