import { useState, useEffect } from "react";
import { getAllowedVideos, getWhitelistedChannels } from "@/utils/storage";
import "./App.css";

function App() {
  const [allowedCount, setAllowedCount] = useState(0);
  const [channelCount, setChannelCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const videos = await getAllowedVideos();
    const channels = await getWhitelistedChannels();
    setAllowedCount(videos.length);
    setChannelCount(channels.length);
    setLoading(false);
  };

  const openOptions = () => {
    browser.runtime.openOptionsPage();
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

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{channelCount}</div>
          <div className="stat-label">Whitelisted Channels</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{allowedCount}</div>
          <div className="stat-label">Allowed Videos</div>
        </div>
      </div>

      <button onClick={openOptions} className="options-button">
        Manage Whitelist
      </button>

      <footer className="popup-footer">
        <p>Videos require permission unless from whitelisted channels</p>
      </footer>
    </div>
  );
}

export default App;
