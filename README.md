# YouTube Gatekeeper

A Chrome extension that acts as a "Gatekeeper" for YouTube, preventing you from watching videos unless they are explicitly permitted or from a whitelisted channel.

## Features

- **Permission Overlay**: Videos are blocked by default with a permission request overlay
- **Persistent Storage**: Permitted videos are saved locally and automatically allowed on future visits
- **Channel Whitelisting**: Whitelist entire channels by their handle (e.g., @ScienceChannel)
- **Options Page**: Manage permitted videos and whitelisted channels
- **SPA Support**: Handles YouTube's single-page application architecture with AJAX transitions

## Installation

### Development Mode

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` directory

### Development with Hot Reload

```bash
npm run dev
```

Then load the extension from `.output/chrome-mv3` as described above. Changes will automatically rebuild.

## How It Works

### Logic Flow

1. When you visit a YouTube video, the extension checks:
   - Is the video ID in the allowed videos list?
   - Is the channel handle in the whitelisted channels list?
   
2. If neither condition is met, the extension displays a blocking overlay

3. You can either:
   - Click "Permit This Video" to allow it (saved permanently)
   - Click "Go Back" to return to the previous page

### User Interface

**Popup**: Click the extension icon to see:
- Number of whitelisted channels
- Number of allowed videos
- Quick access to the options page

**Options Page**: Right-click the extension icon and select "Options" or click "Manage Whitelist" in the popup to:
- Add/remove whitelisted channel handles
- View and remove individually permitted videos
- Clear all allowed videos or whitelisted channels
- View direct links to channels and videos

## Technical Details

### Architecture

- **Manifest Version**: 3
- **Framework**: WXT (Web Extension Tools) + React 19
- **Permissions**: `storage`, `activeTab`, `*://*.youtube.com/*`
- **Content Script**: Detects video page loads and URL changes in YouTube's SPA
- **Storage**: Uses `chrome.storage.local` for persistent data

### File Structure

```
entrypoints/
├── background.ts          # Background service worker
├── content.ts            # Content script for YouTube pages
├── options/              # Options page
│   ├── App.tsx
│   ├── main.tsx
│   └── style.css
└── popup/                # Extension popup
    ├── App.tsx
    ├── App.css
    └── main.tsx

utils/
├── storage.ts            # Storage utility functions
└── youtube.ts            # YouTube-specific utilities
```

## Usage Tips

### Whitelisting a Channel

1. Open the options page (right-click extension icon → Options)
2. Enter the channel handle in the format `@ChannelName`
3. Click "Add Channel"
4. All videos from this channel will now play automatically

### Allowing Individual Videos

When you encounter a blocked video:
1. Click "✓ Permit This Video" on the overlay
2. The video will play immediately and be remembered for future visits

### Managing Your Lists

- View all allowed videos and whitelisted channels in the options page
- Remove items individually or clear entire lists
- Click links to visit channels or videos directly from the options page

## Development Commands

```bash
npm run dev              # Start development server (Chrome)
npm run dev:firefox      # Start development server (Firefox)
npm run build            # Build for production (Chrome)
npm run build:firefox    # Build for production (Firefox)
npm run compile          # TypeScript type checking
npm run zip              # Create distribution package (Chrome)
npm run zip:firefox      # Create distribution package (Firefox)
```

## Browser Support

- Chrome (Manifest V3)
- Firefox (with `npm run build:firefox`)
- Other Chromium-based browsers

## License

This project is private and for personal use.
