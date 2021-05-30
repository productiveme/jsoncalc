declare type ApplyChangesOptions = {
    filePath: string;
    result: string;
};
declare type ApplyChangesCallback = (opts: ApplyChangesOptions) => void;
declare type JsonCalcOptions = {
    reducer?: string;
    applyChanges?: ApplyChangesCallback;
};
export declare const loadJson: (filePath: string) => any;
export declare const jsoncalc: (filePath: string, { reducer, applyChanges }: JsonCalcOptions) => void;
export declare const watch: (pathToJson: string, { reducer }: {
    reducer?: string | undefined;
}) => void;
export {};
