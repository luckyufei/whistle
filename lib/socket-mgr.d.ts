declare function _exports(p: any): void;
declare namespace _exports {
    export { getContext as setContext };
    export function removeContext(req: any): void;
    export function handleUpgrade(req: any, res: any): any;
    export function handleConnect(req: any, res: any): any;
    export function abort(reqId: any): void;
    export function getStatus(reqId: any): {
        sendStatus: any;
        receiveStatus: any;
    } | undefined;
    export function removePending(req: any): void;
    export function setPending(req: any): void;
    export function exists(reqId: any): any;
    export function getData(reqId: any): 1 | {
        sendStatus: any;
        receiveStatus: any;
        toServer: any;
        toClient: any;
    } | undefined;
    export function changeStatus(data: any): true | undefined;
    export function sendData(data: any): any;
}
export = _exports;
declare function getContext(req: any, res: any, hasEvent: any, sendStatus: any, receiveStatus: any): {
    customParser: any;
    req: any;
    res: any;
    hasEvent: any;
    url: any;
    charset: string;
    clearup: () => void;
    setSendStatus: (status: any) => void;
    setReceiveStatus: (status: any) => void;
};
