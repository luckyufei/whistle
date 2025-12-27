# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

> **IMPORTANT**: 永远使用中文来写文档和代码注释

## Project Overview

Whistle is a cross-platform HTTP, HTTPS, HTTP/2, WebSocket, and TCP debugging proxy built on Node.js. It supports multiple proxy modes (HTTP proxy, HTTPS proxy, SOCKS proxy, reverse proxy), request/response inspection and modification, and is extensible via plugins.

## Common Commands

### Development
```bash
npm run dev          # Start webpack in watch mode for WebUI development
npm run start        # Run whistle directly (w2 run)
```

### Testing
```bash
npm test             # Run lintfix + all tests
node test/index.test.js  # Run tests directly without lint
```

### Linting
```bash
npm run lint         # Check for lint errors
npm run lintfix      # Auto-fix lint errors
```

### Documentation
```bash
npm run docs:dev     # Start VitePress dev server for docs
npm run docs         # Build documentation
```

### CLI Usage (after global install)
```bash
w2 start             # Start whistle as daemon
w2 stop              # Stop whistle daemon
w2 restart           # Restart whistle daemon
w2 run               # Run whistle in foreground
w2 status            # Show running status
w2 ca                # Install root CA certificate
w2 proxy             # Configure system proxy
```

## Architecture Overview

### Entry Points

- **`index.js`** - Main module entry point. Handles cluster mode, configuration loading, and bootstraps the proxy server via `lib/index.js`.
- **`bin/whistle.js`** - CLI entry point using the `starting` library. Defines all CLI commands (`start`, `stop`, `run`, `status`, `ca`, `proxy`, `install`, `uninstall`) and options.

### Core Library (`lib/`)

The `lib/` directory contains the proxy server core:

- **`lib/index.js`** - Creates the Express app and HTTP server. Assembles middleware pipeline: `init` → `biz` → `inspectors` → custom middlewares → `handlers`. Sets up HTTPS/SOCKS servers, initializes plugin manager, rules engine, and socket manager.

- **`lib/config.js`** - Central configuration module. Defines all HTTP headers used internally, default ports, timeouts, and exports configuration that can be extended via options.

- **`lib/tunnel.js`** - Handles CONNECT method requests for HTTPS/WebSocket tunneling. Manages tunnel connections, SNI inspection, and forwards traffic to appropriate handlers.

- **`lib/upgrade.js`** - Handles WebSocket upgrade requests.

- **`lib/socket-mgr.js`** - Manages WebSocket frame inspection and modification.

### HTTPS Handling (`lib/https/`)

- **`lib/https/index.js`** - Main HTTPS handling logic. Implements SNI-based certificate generation, HTTP/2 support, and WebSocket proxying.
- **`lib/https/ca.js`** - Certificate Authority management. Generates root CA and domain-specific certificates on-the-fly using `node-forge`.
- **`lib/https/h2.js`** - HTTP/2 server management.

### Rules Engine (`lib/rules/`)

The rules engine is central to Whistle's functionality:

- **`lib/rules/rules.js`** - Core rules parsing and matching logic. Supports pattern matching (wildcards, regex, exact), protocol handlers, and template variables.
- **`lib/rules/index.js`** - Rules management API. Handles rule initialization, resolution, and DNS caching.
- **`lib/rules/storage.js`** - Persists rules and values to disk.
- **`lib/rules/protocols.js`** - Defines supported protocols (file, host, proxy, redirect, etc.).

### Plugin System (`lib/plugins/`)

- **`lib/plugins/index.js`** - Plugin manager. Discovers, loads, and manages plugins. Handles plugin lifecycle, rules resolution from plugins, and inter-plugin communication.
- **`lib/plugins/load-plugin.js`** - Plugin loader. Forks plugin processes and manages IPC.
- **`lib/plugins/get-plugins.js`** / **`get-plugins-sync.js`** - Plugin discovery from `node_modules`.

### Request Inspectors (`lib/inspectors/`)

Middleware that inspects and potentially modifies requests/responses:

- **`lib/inspectors/req.js`** - Request inspection and modification.
- **`lib/inspectors/res.js`** - Response inspection and modification.
- **`lib/inspectors/data.js`** - Request/response data capture for UI.
- **`lib/inspectors/rules.js`** - Applies rules to requests.
- **`lib/inspectors/weinre.js`** - Weinre remote debugging integration.

### Request Handlers (`lib/handlers/`)

Final handlers that proxy requests to their destinations:

- **`lib/handlers/http-proxy.js`** - HTTP proxy handler.
- **`lib/handlers/file-proxy.js`** - Local file serving handler.

### Utilities (`lib/util/`)

- **`lib/util/index.js`** - Main utility module with extensive helper functions.
- **`lib/util/common.js`** - Common utilities shared across modules.
- **`lib/util/data-server.js`** - In-memory data storage for captured requests.

### Web UI (`biz/`)

- **`biz/index.js`** - Routes requests to WebUI or Weinre based on URL patterns.
- **`biz/webui/cgi-bin/`** - Backend API endpoints for the web interface (rules CRUD, values CRUD, plugins management, certificates, etc.).
- **`biz/webui/htdocs/`** - Frontend assets. The main bundle is `js/index.js` (built from `src/js/` using webpack).
- **`biz/webui/htdocs/src/`** - React-based frontend source code with webpack configuration.
- **`biz/weinre/`** - Weinre remote debugging server integration.

### CLI Tools (`bin/`)

- **`bin/whistle.js`** - Main CLI using `starting` library.
- **`bin/plugin.js`** - Plugin install/uninstall commands.
- **`bin/proxy.js`** - System proxy configuration.
- **`bin/ca/`** - Root CA certificate installation.
- **`bin/use.js`** - Load rules from local `.whistle.js` files.
- **`bin/status.js`** - Display running whistle instances.

### Data Flow

1. Request arrives at proxy server (HTTP/HTTPS/SOCKS)
2. `lib/init.js` normalizes the request
3. `biz/index.js` checks if request is for WebUI
4. `lib/inspectors/` applies rules and captures data
5. `lib/handlers/` proxies to destination or serves local files
6. Response flows back through inspectors for modification
7. Data is stored in `lib/util/data-server.js` for UI display

### Key Design Patterns

- **Middleware Pipeline**: Express-style middleware chain for request processing.
- **Event Emitter**: `proxyEvents` object emits events for request lifecycle.
- **LRU Caching**: Used extensively for DNS, certificates, and rules caching.
- **Process Forking**: Plugins run in separate processes via `pfork`.
- **Cluster Mode**: Optional multi-process mode for high throughput.

## Testing

Tests are in `test/` directory using `tape` framework. Test files in `test/units/` cover individual features. The test harness (`test/index.test.js`) starts a whistle instance, HTTP/HTTPS servers, WebSocket server, and SOCKS servers before running tests.

Run a specific test by requiring it directly:
```bash
node -e "require('./test/units/host.test.js')"
```
