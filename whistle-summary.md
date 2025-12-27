# Whistle Complete Feature Summary

This document provides a comprehensive summary of Whistle's capabilities for LLM reference, enabling understanding of all features for tasks like porting to other languages or building similar tools.

## 1. Overview

Whistle is a cross-platform network debugging proxy built on Node.js that supports:
- **Protocols**: HTTP, HTTPS, HTTP/2, WebSocket, TCP/TUNNEL
- **Proxy Modes**: HTTP Proxy, HTTPS Proxy, SOCKS5 Proxy, Reverse Proxy
- **Core Functions**: Traffic capture, request/response modification, rule-based routing, plugin extensibility

## 2. Architecture

### 2.1 Core Components

| Component | Description |
|-----------|-------------|
| **Proxy Server** | Express-based HTTP server handling all proxy requests |
| **HTTPS Handler** | SNI-based certificate generation, HTTP/2 support |
| **Rules Engine** | Pattern matching and protocol-based request modification |
| **Plugin System** | Extensible hooks for custom functionality |
| **Web UI** | React-based management interface |
| **CLI** | Command-line tools using `starting` library |

### 2.2 Request Processing Pipeline

1. Request arrives (HTTP/HTTPS/SOCKS)
2. `init` middleware normalizes request
3. `biz` checks if request targets WebUI
4. `inspectors` apply rules and capture data
5. `handlers` proxy to destination or serve local files
6. Response flows back through inspectors
7. Data stored for UI display

### 2.3 Key Design Patterns

- **Middleware Pipeline**: Express-style chain for request processing
- **Event Emitter**: `proxyEvents` for request lifecycle events
- **LRU Caching**: DNS, certificates, rules caching
- **Process Forking**: Plugins run in separate processes via `pfork`
- **Cluster Mode**: Multi-process for high throughput

## 3. Rule System

### 3.1 Basic Syntax

```
pattern operation [includeFilter://... excludeFilter://...]
```

- **pattern**: URL matching expression
- **operation**: `protocol://value` format
- **filters**: Optional request/response filters

### 3.2 Pattern Types

| Type | Syntax | Example |
|------|--------|---------|
| **Domain** | `domain[:port]` | `www.example.com:8080` |
| **Path** | `domain/path` | `www.example.com/api/v1` |
| **Wildcard** | `*.domain`, `**.domain`, `***.domain` | `**.example.com` |
| **Regex** | `/pattern/[flags]` | `/^https?://api\./i` |
| **Protocol-specific** | `protocol://domain` | `tunnel://example.com` |

### 3.3 Wildcard Rules

| Pattern | Matches |
|---------|---------|
| `*` | Single segment (no `.` or `/`) |
| `**` | Multiple segments (no `?`) |
| `***` | Any characters including `?` |
| `***.domain` | Root domain + all subdomains |

### 3.4 Sub-match Variables

```
^http://*.example.com/** file:///path/$1/$2
```
- `$0`: Full match
- `$1-$9`: Capture groups

## 4. Protocol Categories

### 4.1 Map Local (Local File Response)

| Protocol | Description |
|----------|-------------|
| `file` | Serve local file/directory |
| `xfile` | Like file, but 404 passes through |
| `tpl` | Template file with variable substitution |
| `rawfile` | Raw file without processing |

### 4.2 Map Remote (Remote URL Response)

| Protocol | Description |
|----------|-------------|
| `http` | Redirect to HTTP URL |
| `https` | Redirect to HTTPS URL |
| `ws` | Redirect WebSocket |
| `wss` | Redirect Secure WebSocket |
| `tunnel` | Redirect tunnel connection |

### 4.3 DNS Spoofing

| Protocol | Description |
|----------|-------------|
| `host` | Modify DNS resolution (IP/CNAME) |
| `proxy` / `http-proxy` | Forward via HTTP proxy |
| `https-proxy` | Forward via HTTPS proxy |
| `socks` | Forward via SOCKS5 proxy |
| `pac` | Use PAC script for routing |

### 4.4 Request Modification

| Protocol | Description |
|----------|-------------|
| `urlParams` | Modify URL parameters |
| `pathReplace` | Replace URL path |
| `method` | Change HTTP method |
| `reqHeaders` | Modify request headers |
| `reqCookies` | Modify request cookies |
| `reqBody` | Replace request body |
| `reqMerge` | Merge into request body (JSON/form) |
| `reqPrepend` | Prepend to request body |
| `reqAppend` | Append to request body |
| `reqReplace` | Search/replace in request body |
| `reqCharset` | Set request charset |
| `reqType` | Set Content-Type |
| `reqCors` | Set CORS request headers |
| `reqWrite` | Write request to file |
| `reqScript` | Dynamic rules via JavaScript |
| `reqRules` | Batch request rules |
| `ua` | Set User-Agent |
| `auth` | Set Basic Auth |
| `referer` | Set Referer header |
| `forwardedFor` | Set X-Forwarded-For |

### 4.5 Response Modification

| Protocol | Description |
|----------|-------------|
| `statusCode` | Set response status code |
| `replaceStatus` | Replace status code |
| `redirect` | HTTP redirect (301/302) |
| `locationHref` | JavaScript redirect |
| `resHeaders` | Modify response headers |
| `resCookies` | Modify response cookies |
| `resBody` | Replace response body |
| `resMerge` | Merge into response body |
| `resPrepend` | Prepend to response body |
| `resAppend` | Append to response body |
| `resReplace` | Search/replace in response body |
| `resCharset` | Set response charset |
| `resType` | Set Content-Type |
| `resCors` | Set CORS response headers |
| `resWrite` | Write response to file |
| `resScript` | Dynamic rules via JavaScript |
| `resRules` | Batch response rules |
| `htmlPrepend/Body/Append` | Inject into HTML |
| `jsPrepend/Body/Append` | Inject into JavaScript |
| `cssPrepend/Body/Append` | Inject into CSS |
| `trailers` | Set HTTP trailers |

### 4.6 General Operations

| Protocol | Description |
|----------|-------------|
| `pipe` | Pipe through plugin for processing |
| `delete` | Delete headers/body fields |
| `headerReplace` | Search/replace in headers |

### 4.7 Throttling

| Protocol | Description |
|----------|-------------|
| `reqDelay` | Delay request (ms) |
| `resDelay` | Delay response (ms) |
| `reqSpeed` | Limit request speed (KB/s) |
| `resSpeed` | Limit response speed (KB/s) |

### 4.8 Debug Tools

| Protocol | Description |
|----------|-------------|
| `weinre` | Remote DOM inspection |
| `log` | Capture console.log |

### 4.9 Settings

| Protocol | Description |
|----------|-------------|
| `enable` | Enable features (https, abort, gzip, etc.) |
| `disable` | Disable features |
| `style` | Custom styling in capture list |
| `lineProps` | Set rule line properties |
| `ignore` | Ignore subsequent rules |
| `skip` | Skip specific protocols |

### 4.10 Filters

| Protocol | Description |
|----------|-------------|
| `includeFilter` | Only apply if filter matches |
| `excludeFilter` | Skip if filter matches |

## 5. Enable/Disable Actions

### 5.1 Enable Actions

| Action | Description |
|--------|-------------|
| `https` / `capture` | Enable HTTPS decryption |
| `captureIp` | Capture HTTPS to IP addresses |
| `abort` / `abortReq` / `abortRes` | Terminate request/response |
| `gzip` / `br` / `deflate` | Enable compression |
| `h2` / `http2` / `httpH2` | Enable HTTP/2 |
| `hide` | Hide from capture list |
| `inspect` | Inspect TUNNEL content |
| `websocket` | Force WebSocket parsing |
| `clientIp` | Add X-Forwarded-For |
| `clientId` | Add client identifier |
| `proxyFirst` | Prioritize proxy over host |
| `proxyHost` | Enable both proxy and host |
| `proxyTunnel` | Tunnel through proxy chain |
| `bigData` | Increase capture size limit |

### 5.2 Disable Actions

| Action | Description |
|--------|-------------|
| `https` / `capture` | Disable HTTPS decryption |
| `cache` | Disable caching |
| `cookies` / `reqCookies` / `resCookies` | Disable cookies |
| `csp` | Remove CSP headers |
| `timeout` | Disable request timeout |
| `ua` | Remove User-Agent |
| `referer` | Remove Referer |
| `301` | Convert 301 to 302 |
| `dnsCache` | Disable DNS caching |

## 6. Template Variables

Available in template strings (`` `...${var}...` ``):

| Variable | Description |
|----------|-------------|
| `${now}` | Current timestamp |
| `${random}` | Random number |
| `${randomUUID}` | UUID v4 |
| `${reqId}` | Request ID |
| `${url}` | Full URL |
| `${url.protocol/hostname/host/port/path/pathname/search}` | URL parts |
| `${query.xxx}` | Query parameter |
| `${method}` | HTTP method |
| `${reqHeaders.xxx}` | Request header |
| `${resHeaders.xxx}` | Response header |
| `${reqCookies.xxx}` | Request cookie |
| `${resCookies.xxx}` | Response cookie |
| `${statusCode}` | Response status |
| `${clientIp}` / `${clientPort}` | Client info |
| `${serverIp}` / `${serverPort}` | Server info |
| `${env.xxx}` | Environment variable |
| `${version}` / `${port}` / `${host}` | Whistle info |

## 7. Filter Syntax

Filters support matching on:

| Prefix | Target |
|--------|--------|
| `m:` | HTTP method |
| `h:` | Headers (raw text) |
| `H:` | Host header |
| `b:` | Body content |
| `i:` | IP address |
| `s:` | Status code |
| `from:` | Request source |
| `env:` | Environment |

Example:
```
pattern operation includeFilter://m:POST includeFilter://h:/cookie:[^\r\n]*session/i
```

## 8. Value Sources

Operations can get values from:

1. **Inline**: `protocol://(value)` or `protocol://value`
2. **Embedded**: 
   ```
   ``` key.json
   {"data": "value"}
   ```
   pattern protocol://{key.json}
   ```
3. **Values Panel**: Reference by key name `{keyName}`
4. **Local File**: `protocol:///path/to/file`
5. **Remote URL**: `protocol://https://example.com/data`
6. **Temp File**: `protocol://temp/filename`

## 9. Plugin System

### 9.1 Plugin Types

| Hook | Description |
|------|-------------|
| `rules.txt` | Static rules (always active) |
| `_rules.txt` | Rules for plugin protocol matches |
| `resRules.txt` | Response-phase rules |
| `auth` | Request authentication |
| `sniCallback` | Custom TLS certificates |
| `rulesServer` | Dynamic request rules |
| `tunnelRulesServer` | Dynamic tunnel rules |
| `resRulesServer` | Dynamic response rules |
| `statsServer` | Request statistics (read-only) |
| `resStatsServer` | Response statistics (read-only) |
| `server` | Full request/response handling |
| `pipe` | Stream processing (HTTP/WS/TCP) |

### 9.2 Plugin Configuration

```json
{
  "name": "whistle.myplugin",
  "whistleConfig": {
    "priority": 0,
    "networkColumn": { "name": "Custom", "key": "..." },
    "inspectorsTab": { "name": "Tab", "action": "/page.html" },
    "networkMenus": [{ "name": "Menu", "action": "/menu.html" }],
    "hintUrl": "/cgi-bin/hints",
    "pluginVars": { "hintUrl": "/cgi-bin/vars" }
  }
}
```

### 9.3 Plugin API Objects

**Request Object**:
- `fullUrl`, `method`, `headers`, `body`
- `ruleValue`, `clientIp`, `clientPort`
- `getReqSession()`, `getSession()`

**Response Object**:
- `statusCode`, `headers`, `serverIp`

## 10. Web UI Features

### 10.1 Network Panel

- Real-time request capture
- Request replay and editing
- WebSocket/TCP frame inspection
- Custom column display
- Tree view mode
- Advanced filtering (URL, method, headers, body, status)

### 10.2 Rules Panel

- Multiple rule files
- Rule enable/disable
- Syntax highlighting
- Auto-completion
- Import/export

### 10.3 Values Panel

- Key-value storage
- JSON/text editing
- Import/export

### 10.4 Plugins Panel

- Plugin management
- Install/uninstall
- Enable/disable

### 10.5 Tools

- **Composer**: Construct and send requests
- **Console**: Remote console.log capture
- **Weinre**: Remote DOM inspection
- **Toolbox**: Encoding/decoding utilities

## 11. CLI Commands

| Command | Description |
|---------|-------------|
| `w2 start` | Start as daemon |
| `w2 stop` | Stop daemon |
| `w2 restart` | Restart daemon |
| `w2 run` | Run in foreground |
| `w2 status` | Show running instances |
| `w2 add` | Load rules from .whistle.js |
| `w2 proxy` | Configure system proxy |
| `w2 ca` | Install root certificate |
| `w2 install` | Install plugin |
| `w2 uninstall` | Uninstall plugin |
| `w2 exec` | Execute plugin command |

### 11.1 Key Options

| Option | Description |
|--------|-------------|
| `-p, --port` | Proxy port (default: 8899) |
| `-S, --storage` | Storage directory name |
| `-n, --username` | UI username |
| `-w, --password` | UI password |
| `-H, --host` | Bind host |
| `-M, --mode` | Startup mode |
| `--socksPort` | SOCKS5 port |
| `--httpPort` | HTTP server port |
| `--httpsPort` | HTTPS server port |
| `--cluster` | Multi-process mode |
| `--inspect` | Node.js debugger |

## 12. HTTPS Handling

### 12.1 Certificate Management

- Auto-generated root CA
- Dynamic domain certificates via SNI
- Custom certificate upload
- Client certificate (mTLS) support

### 12.2 Special Rules

```
# Import remote rules
@https://example.com/rules.txt

# Set client certificate
@clientCert://certName
```

## 13. Mobile Debugging

1. Install root certificate on device
2. Configure device proxy to Whistle IP:port
3. Enable HTTPS capture in Whistle UI

### iOS Specifics
- Install profile via Settings
- Enable full trust in Certificate Trust Settings

### Android Specifics
- Install CA certificate in Security settings
- May need network security config for apps

## 14. Advanced Features

### 14.1 Scripted Rules

```javascript
// reqScript or resScript
if (method === 'POST') {
  rules.push('* resBody://({"error": true})');
}
```

Available globals: `url`, `method`, `headers`, `body`, `rules`, `values`, `parseUrl`, `parseQuery`, `getValue`, `render`

### 14.2 WebSocket/TCP Debugging

- Frame inspection in Frames panel
- Send/receive/pause/ignore controls
- `frameScript` for programmatic handling
- `pipe` for stream transformation

### 14.3 Proxy Chaining

```
# Chain through HTTP proxy
pattern proxy://upstream:8080

# With host override
pattern proxy://upstream:8080 target:9090 enable://proxyHost

# Tunnel through proxy chain
pattern proxy://proxy1:8080 proxy2:8080 enable://proxyHost|proxyTunnel
```

### 14.4 Configuration File

`~/.whistlerc`:
```
# Global defaults
username=admin
password=secret

# Storage-specific
myproject.port=8100

# Wildcard
*.timeout=60000
```

## 15. Data Formats

### 15.1 JSON Format
```json
{"key": "value"}
```

### 15.2 Line Format
```
key1: value1
key2: value2
nested.key: value
escaped\.key: value
```

### 15.3 Query Format
```
key1=value1&key2=value2
```

## 16. Internal Headers

| Header | Purpose |
|--------|---------|
| `x-forwarded-for` | Client IP |
| `x-whistle-client-id` | Client identifier |
| `x-whistle-policy` | Routing policy |
| `x-forwarded-proto` | Original protocol |
| `x-forwarded-host` | Original host |

## 17. Performance Considerations

- Default timeout: 360 seconds
- Default max connections per domain: 256
- Default request cache size: 600
- Default frame cache size: 512
- Capture data limit: 2MB (16MB with bigData)

## 18. Security Features

- Username/password authentication
- Guest read-only access
- Plugin-based request authentication
- CORS origin whitelist
- Secure filter for sensitive data

## 19. Extensibility Points

1. **Custom Middlewares**: `-m` option for startup middlewares
2. **Plugins**: Full lifecycle hooks
3. **UI Extensions**: Custom columns, tabs, menus
4. **Rules**: Scriptable via reqScript/resScript
5. **API**: Programmatic usage as npm module

## 20. Common Use Cases

1. **Local Development**: Map remote APIs to local servers
2. **API Mocking**: Return mock responses
3. **Debugging**: Inspect/modify traffic
4. **Testing**: Simulate network conditions
5. **Security**: Analyze app traffic
6. **Mobile**: Debug mobile app requests
7. **Performance**: Throttle/delay requests
