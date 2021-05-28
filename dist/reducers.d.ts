declare const REDUCER_PREFIX = "_";
declare const isObject: (x: unknown) => boolean;
declare type ReduceOptions = {
    hash: any;
    reducerName: string;
    reducer: Function;
    initialValue: any;
    clean?: Function;
};
declare const reduce: ({ hash, reducerName, reducer, initialValue, clean, }: ReduceOptions) => any;
declare const sum: (hash: any) => any;
declare const count: (hash: any) => any;
declare const avg: (hash: any) => any;
declare const yep: (hash: any) => any;
declare const nope: (hash: any) => any;
declare const _reducers: {
    sum: (hash: any) => any;
    count: (hash: any) => any;
    avg: (hash: any) => any;
    yep: (hash: any) => any;
    nope: (hash: any) => any;
};
