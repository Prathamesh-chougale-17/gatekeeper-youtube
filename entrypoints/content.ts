import {
  isVideoAllowed,
  isChannelWhitelisted,
  allowVideo,
} from "@/utils/storage";
import {
  getVideoIdFromUrl,
  getChannelHandleFromPage,
  waitForElement,
  isVideoPage,
} from "@/utils/youtube";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  main() {
    console.log("YouTube Gatekeeper: Content script loaded");

    // Check on initial page load
    if (isVideoPage()) {
      checkAndBlockVideo();
    }

    // Listen for URL changes (YouTube is a SPA)
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        if (isVideoPage()) {
          checkAndBlockVideo();
        } else {
          removeOverlay();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});

async function checkAndBlockVideo() {
  const videoId = getVideoIdFromUrl(window.location.href);

  if (!videoId) {
    console.log("YouTube Gatekeeper: No video ID found");
    return;
  }

  console.log("YouTube Gatekeeper: Checking video:", videoId);

  // Check if video is already allowed
  const videoAllowed = await isVideoAllowed(videoId);
  if (videoAllowed) {
    console.log("YouTube Gatekeeper: Video is allowed");
    removeOverlay();
    return;
  }

  // Wait for channel information to load
  await waitForElement("ytd-channel-name", 3000);

  // Check if channel is whitelisted
  const channelHandle = getChannelHandleFromPage();
  if (channelHandle) {
    const channelAllowed = await isChannelWhitelisted(channelHandle);
    if (channelAllowed) {
      console.log("YouTube Gatekeeper: Channel is whitelisted:", channelHandle);
      removeOverlay();
      return;
    }
  }

  // Video is not allowed - show overlay
  console.log("YouTube Gatekeeper: Blocking video");
  showOverlay(videoId, channelHandle);
}

function showOverlay(videoId: string, channelHandle: string | null) {
  removeOverlay(); // Remove any existing overlay

  const overlay = document.createElement("div");
  overlay.id = "youtube-gatekeeper-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `;

  const content = document.createElement("div");
  content.style.cssText = `
    background: #1f1f1f;
    padding: 40px;
    border-radius: 12px;
    text-align: center;
    max-width: 500px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const title = document.createElement("h1");
  title.textContent = "🔒 Video Blocked";
  title.style.cssText = `
    margin: 0 0 20px 0;
    font-size: 32px;
    font-weight: 600;
  `;

  const message = document.createElement("p");
  message.textContent = "This video requires permission to watch.";
  message.style.cssText = `
    margin: 0 0 30px 0;
    font-size: 16px;
    color: #b0b0b0;
    line-height: 1.5;
  `;

  if (channelHandle) {
    const channelInfo = document.createElement("p");
    channelInfo.textContent = `Channel: ${channelHandle}`;
    channelInfo.style.cssText = `
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #808080;
    `;
    content.appendChild(title);
    content.appendChild(message);
    content.appendChild(channelInfo);
  } else {
    content.appendChild(title);
    content.appendChild(message);
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
    display: flex;
    gap: 12px;
    justify-content: center;
  `;

  const permitButton = document.createElement("button");
  permitButton.textContent = "✓ Permit This Video";
  permitButton.style.cssText = `
    background: #065fd4;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  `;
  permitButton.onmouseover = () => {
    permitButton.style.background = "#0479f0";
  };
  permitButton.onmouseout = () => {
    permitButton.style.background = "#065fd4";
  };
  permitButton.onclick = async () => {
    await allowVideo(videoId);
    removeOverlay();
    console.log("YouTube Gatekeeper: Video permitted:", videoId);
  };

  const backButton = document.createElement("button");
  backButton.textContent = "← Go Back";
  backButton.style.cssText = `
    background: transparent;
    color: #aaa;
    border: 1px solid #555;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  `;
  backButton.onmouseover = () => {
    backButton.style.background = "#2a2a2a";
    backButton.style.color = "#fff";
  };
  backButton.onmouseout = () => {
    backButton.style.background = "transparent";
    backButton.style.color = "#aaa";
  };
  backButton.onclick = () => {
    window.history.back();
  };

  buttonContainer.appendChild(backButton);
  buttonContainer.appendChild(permitButton);
  content.appendChild(buttonContainer);
  overlay.appendChild(content);
  document.body.appendChild(overlay);
}

function removeOverlay() {
  const overlay = document.getElementById("youtube-gatekeeper-overlay");
  if (overlay) {
    overlay.remove();
  }
}
