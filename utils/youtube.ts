/**
 * YouTube utility functions for extracting video ID and channel handle
 */

/**
 * Extract video ID from YouTube URL
 */
export function getVideoIdFromUrl(url: string): string | null {
  const urlObj = new URL(url);

  // Handle /watch?v=VIDEO_ID format
  if (urlObj.pathname === "/watch") {
    return urlObj.searchParams.get("v");
  }

  // Handle /shorts/VIDEO_ID format
  if (urlObj.pathname.startsWith("/shorts/")) {
    const parts = urlObj.pathname.split("/");
    return parts[2] || null;
  }

  // Handle youtu.be/VIDEO_ID format
  if (urlObj.hostname === "youtu.be") {
    const parts = urlObj.pathname.split("/");
    return parts[1] || null;
  }

  return null;
}

/**
 * Extract channel handle from the page DOM
 * YouTube displays the channel handle in the video page
 */
export function getChannelHandleFromPage(): string | null {
  // Method 1: Try to get from ytd-channel-name (most reliable)
  const channelNameLink = document.querySelector(
    "ytd-channel-name#channel-name a",
  ) as HTMLAnchorElement;

  if (channelNameLink && channelNameLink.href) {
    const match = channelNameLink.href.match(/@[\w-]+/);
    if (match) {
      return match[0];
    }
  }

  // Method 2: Try to get from the owner section
  const ownerLink = document.querySelector(
    '#owner a[href*="@"]',
  ) as HTMLAnchorElement;

  if (ownerLink && ownerLink.href) {
    const match = ownerLink.href.match(/@[\w-]+/);
    if (match) {
      return match[0];
    }
  }

  // Method 3: Try to get from video owner renderer
  const videoOwnerLink = document.querySelector(
    'ytd-video-owner-renderer a[href*="@"]',
  ) as HTMLAnchorElement;

  if (videoOwnerLink && videoOwnerLink.href) {
    const match = videoOwnerLink.href.match(/@[\w-]+/);
    if (match) {
      return match[0];
    }
  }

  // Method 4: Search all links in the video info section
  const videoInfo = document.querySelector("#above-the-fold, #top-row");
  if (videoInfo) {
    const links = videoInfo.querySelectorAll('a[href*="@"]');
    for (const link of links) {
      const href = (link as HTMLAnchorElement).href;
      if (href.includes("youtube.com/@") || href.includes("m.youtube.com/@")) {
        const match = href.match(/@[\w-]+/);
        if (match) {
          return match[0];
        }
      }
    }
  }

  // Method 5: Search ALL links on the page with @ (fallback)
  const allLinks = document.querySelectorAll('a[href*="@"]');
  for (const link of allLinks) {
    const href = (link as HTMLAnchorElement).href;
    if (href.includes("youtube.com/@") || href.includes("m.youtube.com/@")) {
      const match = href.match(/@[\w-]+/);
      if (match) {
        return match[0];
      }
    }
  }

  return null;
}

/**
 * Wait for an element to appear in the DOM
 */
export function waitForElement(
  selector: string,
  timeout = 5000,
): Promise<Element | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

/**
 * Check if current page is a YouTube video page
 */
export function isVideoPage(): boolean {
  const url = window.location.href;
  return url.includes("/watch?v=") || url.includes("/shorts/");
}
