export default function VideoLinks({ videoLinks = [] }) {
  if (!Array.isArray(videoLinks) || videoLinks.length === 0) {
    return null;
  }

  return (
    <div className="video-links">
      <h3 className="video-links-title">Videolar</h3>
      <div className="video-links-list">
        {videoLinks.map((video) => (
          <div key={video.url} className="video-link-card">
            {video.thumbnail && (
              <div className="video-link-thumb">
                <img src={video.thumbnail} alt={video.title} loading="lazy" />
              </div>
            )}
            <div className="video-link-body">
              <div className="video-link-title">{video.title}</div>
            </div>
            <a
              className="video-link-cta"
              href={video.url}
              target="_blank"
              rel="noreferrer"
            >
              Videoyu Ac
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
