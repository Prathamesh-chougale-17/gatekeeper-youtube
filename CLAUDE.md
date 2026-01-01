# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser extension built with WXT (Web Extension Tools) framework and React. WXT is a next-generation framework for developing web extensions with support for Chrome, Firefox, and other browsers.

## Development Commands

**Start development server:**
```bash
npm run dev              # Chrome (default)
npm run dev:firefox      # Firefox
```

**Build for production:**
```bash
npm run build            # Chrome (default)
npm run build:firefox    # Firefox
```

**Create distribution packages:**
```bash
npm run zip              # Chrome
npm run zip:firefox      # Firefox
```

**Type checking:**
```bash
npm run compile          # TypeScript type check without emitting files
```

**Post-install setup:**
```bash
npm run postinstall      # Runs 'wxt prepare' - automatically runs after npm install
```

## Architecture

### WXT Framework Structure

The project uses WXT's convention-based file structure where files in `entrypoints/` automatically become extension entry points:

- **entrypoints/background.ts** - Background service worker (runs persistently in the background)
- **entrypoints/content.ts** - Content script (currently configured to run on `*://*.google.com/*`)
- **entrypoints/popup/** - Browser extension popup UI (React-based)
  - `main.tsx` - React entry point
  - `App.tsx` - Main popup component
  - `index.html` - Popup HTML template
  - `App.css` and `style.css` - Popup styles

### Key Concepts

- **WXT Module System**: The project uses `@wxt-dev/module-react` for React integration, configured in `wxt.config.ts`
- **Auto-generated Config**: WXT generates configuration in `.wxt/` directory (gitignored) - don't edit these files directly
- **Browser APIs**: WXT provides `browser` API that works cross-browser (uses webextension-polyfill internally)
- **Path Aliases**: `@/` alias resolves to project root (e.g., `@/assets/react.svg`)

### Entry Points

WXT uses a special API for defining entry points:
- `defineBackground()` - Define background scripts
- `defineContentScript()` - Define content scripts with match patterns
- `definePopup()` - Not explicitly needed for popup (convention-based)

### TypeScript Configuration

- Base config extends from `.wxt/tsconfig.json` (auto-generated)
- `jsx: "react-jsx"` is configured for React 17+ JSX transform
- `allowImportingTsExtensions: true` allows importing `.ts`/`.tsx` files directly

## Development Notes

- The extension popup uses React 19 with the modern StrictMode
- Content scripts use WXT's `matches` pattern to specify which pages they run on
- Assets in `public/` are copied to the output directory
- Assets in `assets/` can be imported directly in components
- WXT handles HMR (Hot Module Replacement) during development
