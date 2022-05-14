/// <reference types="node" />
export var hasInvalidCerts: boolean;
export function existsCustomCert(hostname: any): any;
export function hasCustomCerts(): number;
export function createCertificate(hostname: any): any;
export function createRootCA(opts: any): {
    key: any;
    cert: any;
};
export function getRootCA(): {
    key: any;
    cert: any;
};
export function getCustomCertsInfo(): {};
export function getCustomCertsFiles(): {};
export function getHttp2Server(listener: any, callback: any): any;
export function getSNIServer(listener: any, callback: any, disableH2: any, requestCert: any): any;
export function removeCert(filename: any): void;
export function uploadCerts(certs: any): void;
export var remoteCerts: any;
export var createSecureContext: typeof import("tls").createSecureContext;
export var CUSTOM_CERTS_DIR: any;
export function getDomain(hostname: any): any;
export function getRootCAFile(): string;
export function SNICallback(servername: any, cb: any): void;
export { unknown as serverAgent };
