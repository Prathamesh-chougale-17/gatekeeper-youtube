/**
 * Storage utility for managing allowed videos and whitelisted channels
 */

export interface StorageData {
  allowedVideos: string[]; // Array of video IDs
  whitelistedChannels: string[]; // Array of channel handles (e.g., @ScienceChannel)
}

const STORAGE_KEYS = {
  ALLOWED_VIDEOS: "allowedVideos",
  WHITELISTED_CHANNELS: "whitelistedChannels",
} as const;

/**
 * Get all allowed video IDs from storage
 */
export async function getAllowedVideos(): Promise<string[]> {
  const result = await browser.storage.local.get(STORAGE_KEYS.ALLOWED_VIDEOS);
  return (result[STORAGE_KEYS.ALLOWED_VIDEOS] as string[]) || [];
}

/**
 * Add a video ID to the allowed list
 */
export async function allowVideo(videoId: string): Promise<void> {
  const videos = await getAllowedVideos();
  if (!videos.includes(videoId)) {
    videos.push(videoId);
    await browser.storage.local.set({ [STORAGE_KEYS.ALLOWED_VIDEOS]: videos });
  }
}

/**
 * Remove a video ID from the allowed list
 */
export async function removeAllowedVideo(videoId: string): Promise<void> {
  const videos = await getAllowedVideos();
  const filtered = videos.filter((id) => id !== videoId);
  await browser.storage.local.set({ [STORAGE_KEYS.ALLOWED_VIDEOS]: filtered });
}

/**
 * Check if a video ID is allowed
 */
export async function isVideoAllowed(videoId: string): Promise<boolean> {
  const videos = await getAllowedVideos();
  return videos.includes(videoId);
}

/**
 * Get all whitelisted channel handles from storage
 */
export async function getWhitelistedChannels(): Promise<string[]> {
  const result = await browser.storage.local.get(
    STORAGE_KEYS.WHITELISTED_CHANNELS,
  );
  return (result[STORAGE_KEYS.WHITELISTED_CHANNELS] as string[]) || [];
}

/**
 * Add a channel handle to the whitelist
 */
export async function whitelistChannel(channelHandle: string): Promise<void> {
  const channels = await getWhitelistedChannels();
  // Normalize handle to ensure it starts with @
  const normalizedHandle = channelHandle.startsWith("@")
    ? channelHandle
    : `@${channelHandle}`;
  if (!channels.includes(normalizedHandle)) {
    channels.push(normalizedHandle);
    await browser.storage.local.set({
      [STORAGE_KEYS.WHITELISTED_CHANNELS]: channels,
    });
  }
}

/**
 * Remove a channel handle from the whitelist
 */
export async function removeWhitelistedChannel(
  channelHandle: string,
): Promise<void> {
  const channels = await getWhitelistedChannels();
  const filtered = channels.filter((handle) => handle !== channelHandle);
  await browser.storage.local.set({
    [STORAGE_KEYS.WHITELISTED_CHANNELS]: filtered,
  });
}

/**
 * Check if a channel handle is whitelisted
 */
export async function isChannelWhitelisted(
  channelHandle: string,
): Promise<boolean> {
  const channels = await getWhitelistedChannels();
  const normalizedHandle = channelHandle.startsWith("@")
    ? channelHandle
    : `@${channelHandle}`;
  return channels.includes(normalizedHandle);
}

/**
 * Clear all allowed videos
 */
export async function clearAllowedVideos(): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEYS.ALLOWED_VIDEOS]: [] });
}

/**
 * Clear all whitelisted channels
 */
export async function clearWhitelistedChannels(): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEYS.WHITELISTED_CHANNELS]: [] });
}
