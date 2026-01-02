# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**YouTube Gatekeeper** is a Chrome extension that acts as a "Gatekeeper" for YouTube, preventing you from watching videos unless they are explicitly permitted or from a whitelisted channel. Built with WXT (Web Extension Tools) framework and React 19.

### Core Functionality
- Blocks YouTube videos by default with a permission overlay
- Allows individual videos to be permitted (saved to `chrome.storage.local`)
- Supports channel whitelisting by handle (e.g., `@ScienceChannel`)
- Provides an options page for managing allowed videos and whitelisted channels
- Handles YouTube's SPA navigation to detect URL changes without page reloads

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

- **entrypoints/background.ts** - Background service worker (minimal logging)
- **entrypoints/content.ts** - Content script that runs on `*://*.youtube.com/*`
  - Detects YouTube video pages and URL changes (SPA navigation)
  - Shows permission overlay when video is not allowed
  - Checks video IDs and channel handles against storage
  - Injects overlay UI directly into the page DOM
- **entrypoints/popup/** - Extension popup showing stats and quick access
  - Displays count of whitelisted channels and allowed videos
  - Provides button to open options page
- **entrypoints/options/** - Options page for managing whitelist (React-based)
  - Add/remove whitelisted channel handles
  - View and remove allowed videos
  - Clear all functionality

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

## Utility Modules

- **utils/storage.ts** - Storage utility functions for managing allowed videos and whitelisted channels
  - Uses `chrome.storage.local` for persistence
  - Functions to add/remove/check video IDs and channel handles
  - Type assertions needed for storage API results (TypeScript)
- **utils/youtube.ts** - YouTube-specific utilities
  - Extract video ID from various URL formats (`/watch?v=`, `/shorts/`, `youtu.be/`)
  - Extract channel handle from page DOM (searches for `@handle` in links)
  - Wait for elements to load (handles YouTube's async rendering)
  - Detect if current page is a video page

## Development Notes

- The extension uses React 19 with StrictMode
- Content script uses MutationObserver to detect YouTube SPA navigation
- Overlay UI is injected directly into the page DOM with inline styles (no CSS files)
- Channel handles are normalized to always include `@` prefix
- Extension waits up to 3 seconds for channel information to load before showing overlay
- Built output is in `.output/chrome-mv3/` (gitignored)
- Load extension from `.output/chrome-mv3/` directory in Chrome for testing
