export = WhistleTransform;
declare function WhistleTransform(options: any): void;
declare class WhistleTransform {
    constructor(options: any);
    _speed: number | undefined;
    _delay: number | undefined;
    _body: any;
    _top: any;
    _bottom: any;
    _strictHtml: boolean | undefined;
    _safeHtml: boolean | undefined;
    allowInject(chunk: any): boolean;
    _transform(chunk: any, encoding: any, callback: any): void | NodeJS.Timeout;
}
