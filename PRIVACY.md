# Privacy Policy — YouTube Gatekeeper

**Last updated: May 14, 2026**

## Overview

YouTube Gatekeeper is a Chrome extension that blocks YouTube videos by default and only allows playback for videos or channels you have explicitly whitelisted. This privacy policy explains how the extension handles your data.

## Data Collection

**YouTube Gatekeeper does not collect any personal data.**

The extension does not:
- Collect your name, email address, or any personally identifiable information
- Track your browsing history or watch history
- Record clicks, keystrokes, or user activity
- Transmit any data to external servers
- Use analytics or telemetry services
- Communicate with any remote server or third-party service

## Data Stored Locally

The extension stores the following data **locally on your device only**, using the browser's built-in `chrome.storage.local` API:

- **Whitelisted channel handles** — the list of YouTube channel handles (e.g. `@ScienceChannel`) you have chosen to allow
- **Permitted video IDs** — the list of individual YouTube video IDs you have explicitly permitted

This data:
- Never leaves your device
- Is never shared with the extension developer or any third party
- Can be deleted at any time from the extension's options page using the "Clear All" buttons
- Is permanently removed if you uninstall the extension

## Permissions

The extension requests the following permissions, each used solely for its core blocking functionality:

| Permission | Purpose |
|---|---|
| `storage` | Save your whitelisted channels and permitted videos locally on your device |
| `activeTab` | Read the current YouTube tab's URL and page to identify the video and channel being viewed |
| `*://*.youtube.com/*` | Inject the content script that detects video pages and displays the blocking overlay on YouTube only |

No permission is used for data collection or tracking.

## Remote Code

This extension does not load or execute any remote code. All code is bundled within the extension package itself.

## Third Parties

This extension does not integrate with, share data with, or communicate with any third-party service, advertiser, or analytics provider.

## Changes to This Policy

If this policy is ever updated, the "Last updated" date at the top of this document will be revised. Any future version that collects data will require explicit user consent.

## Contact

If you have questions about this privacy policy, please open an issue at the project's GitHub repository.
