export = Storage;
declare function Storage(dir: any, filters: any, disabled: any): void;
declare class Storage {
    constructor(dir: any, filters: any, disabled: any);
    recycleBin: RecycleBin;
    _disabled: boolean;
    _backupDir: string;
    _files: string;
    _properties: string;
    _backupProps: string;
    _cache: {
        maxIndex: number;
        files: {};
        properties: any;
    };
}
import RecycleBin = require("./recycle-bin");
