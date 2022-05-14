/// <reference types="node" />
declare function _exports(url: any): import("url").UrlWithStringQuery | {
    protocol: string;
    slashes: boolean;
    auth: null;
    host: string;
    port: string | null;
    hostname: string;
    hash: string | null;
    search: string | null;
    query: string | null;
    pathname: string;
    path: string;
    href: any;
};
export = _exports;
