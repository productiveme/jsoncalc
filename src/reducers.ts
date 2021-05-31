const REDUCER_PREFIX = '_';

const isObject = (x: unknown) =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

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
      if (isObject(b)) {
        (hash as any)[currentKey] = reduce({
          hash: hash[currentKey as keyof typeof hash],
          reducerName,
          reducer,
          initialValue,
          clean,
        });
        b = (hash as any)[currentKey][`${REDUCER_PREFIX}${reducerName}`];
      }
      if (Array.isArray(b)) {
        b = b.reduce((prev, cur) => reducer(prev, cur), initialValue);
      }
      return reducer(a, b, hash);
    },
    initialValue
  );
  (hash as any)[`${REDUCER_PREFIX}${reducerName}`] = clean(reducerResult);
  return hash;
};

const sum = (hash: any) =>
  reduce({
    hash,
    reducerName: 'total',
    initialValue: 0,
    reducer: (a: any, b: any) => a + b,
    clean: (res: number) => Number(res.toFixed(2)),
  });

const count = (hash: any) =>
  reduce({
    hash,
    reducerName: 'count',
    initialValue: 0,
    reducer: (a: number) => a + 1,
  });

const avg = (hash: any) =>
  reduce({
    hash: count(sum(hash)),
    reducerName: 'avg',
    initialValue: 0,
    reducer: (a: any, b: any, h: {_total: unknown; _count: unknown}) => {
      if (Number.isNaN(h._total)) return a;
      if (Number.isNaN(h._count)) return a;
      return Number(h._total) / Number(h._count);
    },
    clean: (res: number) => Number(res.toFixed(3)),
  });

const yep = (hash: any) =>
  reduce({
    hash,
    reducerName: 'yep',
    initialValue: 0,
    reducer(a: number, b: any) {
      return a + (b ? 1 : 0);
    },
    clean: (res: any) => res,
  });

const nope = (hash: any) =>
  reduce({
    hash,
    reducerName: 'nope',
    initialValue: 0,
    reducer(a: number, b: any) {
      return a + (b ? 0 : 1);
    },
    clean: (res: any) => res,
  });

export const reducers = {
  sum: sum,
  count: count,
  avg: avg,
  yep: yep,
  nope: nope,
};
