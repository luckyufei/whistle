/// <reference types="node" />
export function setAuth(auth: any): any;
export function getPluginData(name: any): any;
export function setGuestAuth(auth: any): void;
export function setUIHost(host: any): void;
export function setPluginUIHost(pluginName: any, host: any): void;
export function extend(newConf: any): any;
export function getPluginNameByHost(host: any): any;
export var getWhistlePath: typeof common.getWhistlePath;
export function getDataDir(dirname: any): string;
export function getHttpsAgent(options: any, reqOpts: any): any;
export function getAuths(_url: any): any[];
export function toBuffer(buf: any): any;
export function setHeader(headers: any, name: any, value: any): void;
export function connect(options: any, cb: any): http.ClientRequest;
export function isWebUIHost(host: any): boolean;
import common = require("./util/common");
import http = require("http");
