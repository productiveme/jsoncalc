#!/usr/bin/env node
declare const fs: any;
declare const path: any;
declare const program: any;
declare const version: any;
declare const reducers: any;
declare const chokidar: any;
declare const jsoncalc: (pathToJson: string, { reducer }: {
    reducer?: string | undefined;
}) => void;
