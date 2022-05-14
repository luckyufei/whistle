export = ReplacePatternTransform;
declare function ReplacePatternTransform(pattern: any, value: any): void;
declare class ReplacePatternTransform {
    constructor(pattern: any, value: any);
    _pattern: any;
    _replaceAll: boolean;
    _value: string;
    _rest: string;
}
declare namespace ReplacePatternTransform {
    export { replacePattern };
}
declare function replacePattern(replacement: any, args: any): any;
