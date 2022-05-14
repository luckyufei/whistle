/// <reference types="node" />
export = parse;
declare function parse(str: any, sep: any, eq: any, escape: any): "" | qs.ParsedUrlQuery;
import qs = require("querystring");
