import { useState, useEffect } from "react";
import {
  getAllowedVideos,
  getWhitelistedChannels,
  removeAllowedVideo,
  removeWhitelistedChannel,
  whitelistChannel,
  clearAllowedVideos,
  clearWhitelistedChannels,
} from "@/utils/storage";
import "./App.css";

function App() {
  const [allowedVideos, setAllowedVideos] = useState<string[]>([]);
  const [whitelistedChannels, setWhitelistedChannels] = useState<string[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"channels" | "videos">("channels");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const videos = await getAllowedVideos();
    const channels = await getWhitelistedChannels();
    setAllowedVideos(videos);
    setWhitelistedChannels(channels);
    setLoading(false);
  };

  const handleRemoveVideo = async (videoId: string) => {
    await removeAllowedVideo(videoId);
    await loadData();
  };

  const handleRemoveChannel = async (channelHandle: string) => {
    await removeWhitelistedChannel(channelHandle);
    await loadData();
  };

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newChannel.trim()) {
      await whitelistChannel(newChannel.trim());
      setNewChannel("");
      await loadData();
    }
  };

  const handleClearVideos = async () => {
    if (confirm("Are you sure you want to clear all allowed videos?")) {
      await clearAllowedVideos();
      await loadData();
    }
  };

  const handleClearChannels = async () => {
    if (confirm("Are you sure you want to clear all whitelisted channels?")) {
      await clearWhitelistedChannels();
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="popup-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>🔒 YouTube Gatekeeper</h1>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "channels" ? "active" : ""}`}
          onClick={() => setActiveTab("channels")}
        >
          Channels ({whitelistedChannels.length})
        </button>
        <button
          className={`tab ${activeTab === "videos" ? "active" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          Videos ({allowedVideos.length})
        </button>
      </div>

      {activeTab === "channels" && (
        <div className="tab-content">
          <form onSubmit={handleAddChannel} className="add-form">
            <input
              type="text"
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              placeholder="@ChannelHandle"
              className="input"
            />
            <button type="submit" className="btn-add">
              Add
            </button>
          </form>

          {whitelistedChannels.length > 0 && (
            <button onClick={handleClearChannels} className="btn-clear">
              Clear All Channels
            </button>
          )}

          <div className="list">
            {whitelistedChannels.length === 0 ? (
              <div className="empty">No whitelisted channels</div>
            ) : (
              whitelistedChannels.map((channel) => (
                <div key={channel} className="list-item">
                  <span className="item-text">{channel}</span>
                  <button
                    onClick={() => handleRemoveChannel(channel)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "videos" && (
        <div className="tab-content">
          {allowedVideos.length > 0 && (
            <button onClick={handleClearVideos} className="btn-clear">
              Clear All Videos
            </button>
          )}

          <div className="list">
            {allowedVideos.length === 0 ? (
              <div className="empty">No allowed videos</div>
            ) : (
              allowedVideos.map((videoId) => (
                <div key={videoId} className="list-item">
                  <span className="item-text">{videoId}</span>
                  <button
                    onClick={() => handleRemoveVideo(videoId)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
