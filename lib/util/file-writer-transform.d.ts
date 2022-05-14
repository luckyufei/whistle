export = FileWriterTransform;
declare function FileWriterTransform(writer: any, source: any, isRaw: any, req: any, isReq: any): void;
declare class FileWriterTransform {
    constructor(writer: any, source: any, isRaw: any, req: any, isReq: any);
    _writer: any;
    _transform(chunk: any, encoding: any, callback: any): void;
}
