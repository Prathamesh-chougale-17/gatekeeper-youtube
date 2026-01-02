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
 * Extract channel handle from a sidebar recommendation video element
 */
export function getChannelHandleFromVideoElement(
  element: Element,
): string | null {
  // Method 1: Try to get from channel handle element (desktop - most reliable)
  const channelHandleEl = element.querySelector(
    'yt-formatted-string[id="channel-handle"]',
  );
  if (channelHandleEl && channelHandleEl.textContent) {
    const handle = channelHandleEl.textContent.trim();
    if (handle.startsWith("@")) {
      return handle;
    }
  }

  // Method 2: Try to get from channel name link (desktop)
  const channelLink = element.querySelector(
    "#channel-name a",
  ) as HTMLAnchorElement;
  if (channelLink && channelLink.href) {
    const match = channelLink.href.match(/@[\w-]+/);
    if (match) {
      return match[0];
    }
  }

  // Method 3: Try mobile channel thumbnail link
  const mobileChannelLink = element.querySelector(
    'ytm-channel-thumbnail-with-link-renderer a',
  ) as HTMLAnchorElement;
  if (mobileChannelLink && mobileChannelLink.href) {
    const match = mobileChannelLink.href.match(/@[\w-]+/);
    if (match) {
      return match[0];
    }
  }

  // Method 4: Search all links within the element for @ pattern
  const links = element.querySelectorAll('a[href*="@"]');
  for (const link of links) {
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
 * Get the YouTube sidebar recommendations container
 */
export function getSidebarContainer(): Element | null {
  // Try desktop version first
  let container = document.querySelector("ytd-watch-next-secondary-results-renderer");
  if (container) return container;

  // Try mobile version
  container = document.querySelector("ytm-watch-next-secondary-results-renderer");
  if (container) return container;

  // Try other possible containers
  container = document.querySelector("#related, #secondary");
  return container;
}

/**
 * Get all sidebar video recommendation elements
 */
export function getSidebarVideoElements(): Element[] {
  const container = getSidebarContainer();
  if (!container) {
    console.log("YouTube Gatekeeper: Sidebar container not found");
    return [];
  }

  // Try desktop selectors first
  let videos = container.querySelectorAll("ytd-compact-video-renderer");

  // If no videos found, try mobile selectors
  if (videos.length === 0) {
    videos = container.querySelectorAll("ytm-video-with-context-renderer, ytm-compact-video-renderer");
  }

  console.log(
    `YouTube Gatekeeper: Found ${videos.length} video elements in sidebar`,
  );
  return Array.from(videos);
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
 * Wait for sidebar container (desktop or mobile)
 */
export function waitForSidebar(timeout = 5000): Promise<Element | null> {
  return new Promise((resolve) => {
    // Check if sidebar already exists
    const existing = getSidebarContainer();
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const container = getSidebarContainer();
      if (container) {
        observer.disconnect();
        resolve(container);
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
