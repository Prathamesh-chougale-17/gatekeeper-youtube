import { useState, useEffect } from 'react';
import {
  getAllowedVideos,
  getWhitelistedChannels,
  removeAllowedVideo,
  removeWhitelistedChannel,
  whitelistChannel,
  clearAllowedVideos,
  clearWhitelistedChannels,
} from '@/utils/storage';

function App() {
  const [allowedVideos, setAllowedVideos] = useState<string[]>([]);
  const [whitelistedChannels, setWhitelistedChannels] = useState<string[]>([]);
  const [newChannel, setNewChannel] = useState('');
  const [loading, setLoading] = useState(true);

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
      setNewChannel('');
      await loadData();
    }
  };

  const handleClearVideos = async () => {
    if (confirm('Are you sure you want to clear all allowed videos?')) {
      await clearAllowedVideos();
      await loadData();
    }
  };

  const handleClearChannels = async () => {
    if (confirm('Are you sure you want to clear all whitelisted channels?')) {
      await clearWhitelistedChannels();
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>🔒 YouTube Gatekeeper</h1>
        <p className="subtitle">Manage your allowed videos and whitelisted channels</p>
      </header>

      <section className="section">
        <div className="section-header">
          <h2>Whitelisted Channels</h2>
          {whitelistedChannels.length > 0 && (
            <button onClick={handleClearChannels} className="btn-secondary">
              Clear All
            </button>
          )}
        </div>

        <form onSubmit={handleAddChannel} className="add-form">
          <input
            type="text"
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
            placeholder="Enter channel handle (e.g., @ScienceChannel)"
            className="input"
          />
          <button type="submit" className="btn-primary">
            Add Channel
          </button>
        </form>

        <div className="list">
          {whitelistedChannels.length === 0 ? (
            <div className="empty-state">
              No whitelisted channels yet. Add a channel handle above to whitelist it.
            </div>
          ) : (
            whitelistedChannels.map((channel) => (
              <div key={channel} className="list-item">
                <div className="list-item-content">
                  <span className="channel-handle">{channel}</span>
                  <a
                    href={`https://youtube.com/${channel}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    View Channel
                  </a>
                </div>
                <button
                  onClick={() => handleRemoveChannel(channel)}
                  className="btn-delete"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Allowed Videos</h2>
          {allowedVideos.length > 0 && (
            <button onClick={handleClearVideos} className="btn-secondary">
              Clear All
            </button>
          )}
        </div>

        <div className="list">
          {allowedVideos.length === 0 ? (
            <div className="empty-state">
              No allowed videos yet. Click "Permit" on a video to add it here.
            </div>
          ) : (
            allowedVideos.map((videoId) => (
              <div key={videoId} className="list-item">
                <div className="list-item-content">
                  <span className="video-id">{videoId}</span>
                  <a
                    href={`https://youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    Watch Video
                  </a>
                </div>
                <button
                  onClick={() => handleRemoveVideo(videoId)}
                  className="btn-delete"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <footer>
        <p className="stats">
          {whitelistedChannels.length} whitelisted channel{whitelistedChannels.length !== 1 ? 's' : ''} · {allowedVideos.length} allowed video{allowedVideos.length !== 1 ? 's' : ''}
        </p>
      </footer>
    </div>
  );
}

export default App;
