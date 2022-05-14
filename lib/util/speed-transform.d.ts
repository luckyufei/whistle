export = SpeedTransform;
declare function SpeedTransform(options: any): void;
declare class SpeedTransform {
    constructor(options: any);
    _speed: number | undefined;
    _delay: number | undefined;
    _transform(chunk: any, encoding: any, callback: any): NodeJS.Timeout | undefined;
}
