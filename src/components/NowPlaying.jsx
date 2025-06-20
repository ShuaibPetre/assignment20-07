import React, { useEffect, useState } from 'react';

const NowPlaying = ({ track, audioRefs, playingTrack, handlePause, handleStop }) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    const audio = audioRefs.current[playingTrack];
    if (!audio) return;

    const updateTime = () => {
      if (!seeking) {
        setProgress(audio.currentTime);
      }
    };

    const updateDuration = () => {
      const d = audio.duration;
      if (!isNaN(d) && d > 0) {
        setDuration(d);
      }
    };

    // Force metadata load if available
    if (audio.readyState >= 1) {
      updateDuration();
    } else {
      audio.addEventListener('loadedmetadata', updateDuration);
    }

    audio.addEventListener('timeupdate', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [playingTrack, seeking, audioRefs]);

  const handleSeek = (value) => {
    const audio = audioRefs.current[playingTrack];
    if (audio) {
      audio.currentTime = value;
      setProgress(value);
    }
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!track) return null;

  return (
    <div className="mt-6 p-4 rounded text-sm text-white bg-black/30 backdrop-blur shadow-inner">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={`https://arthurfrost.qflo.co.za/${track.Image}`}
            alt="Thumb"
            className="w-12 h-12 object-cover rounded"
          />
          <div>
            <div className="font-semibold">{track.Title}</div>
            <div className="text-xs text-gray-300">{track.Category}</div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
  {audioRefs.current[playingTrack]?.paused ? (
    <button
      onClick={() =>
        audioRefs.current[playingTrack]?.play()
      }
      className="text-xl font-bold"
    >
      ▶️
    </button>
  ) : (
    <button onClick={() => handlePause(playingTrack)} className="text-xl">⏸️</button>
  )}

  <button onClick={() => handleStop(playingTrack)} className="text-xl">⏹️</button>
</div>

      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="w-10 text-xs text-gray-300">{formatTime(progress)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={progress}
          onMouseDown={() => setSeeking(true)}
          onMouseUp={(e) => {
            handleSeek(parseFloat(e.target.value));
            setSeeking(false);
          }}
          onChange={(e) => {
            if (seeking) {
              setProgress(parseFloat(e.target.value));
            }
          }}
          className="flex-1 accent-blue-400"
        />
        <span className="w-10 text-xs text-gray-300">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default NowPlaying;
