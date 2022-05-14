declare function _exports(socket: any, next: any, isWebPort: any): void;
declare namespace _exports {
    export function setup(s: any, p: any): void;
    export { handleWebsocket };
}
export = _exports;
declare function handleWebsocket(socket: any, clientIp: any, clientPort: any): void;
