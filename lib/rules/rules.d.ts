export = Rules;
declare function Rules(values: any): void;
declare class Rules {
    constructor(values: any);
    _rules: any;
    _globalPluginVars: {};
    _sniCallback: any[];
    _orgValues: any;
    _values: any;
}
declare namespace Rules {
    function disableDnsCache(): void;
}
