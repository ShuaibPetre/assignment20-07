function TrackList({ tracks, handlePlay, handleStop, audioRefs, playingTrack, loadingTrack }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
      {tracks.map((track, index) => {
        const isPlaying = playingTrack === index;
        const isLoading = loadingTrack === index;

        return (
          <div key={track.Id || index} className="flex items-center gap-4 border-b pb-2">
            <img
              src={`https://arthurfrost.qflo.co.za/${track.Image}`}
              alt="Thumb"
              className="w-12 h-12 object-cover rounded"
            />

            <div className="flex-1">
              <div className="font-semibold">{track.Title}</div>
              <div className="text-gray-500">{track.Category}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlay(`https://arthurfrost.qflo.co.za/${track.Audio}`, index)}
                className={`text-xl ${isPlaying ? 'font-bold' : ''}`}
                disabled={isLoading}
                aria-label="Play"
              >
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  '▶️'
                )}
              </button>

              <button
                onClick={() => handleStop(index)}
                className="text-xl"
                aria-label="Stop"
              >
                ⏹️
              </button>

              <audio
                ref={el => (audioRefs.current[index] = el)}
                src={`https://arthurfrost.qflo.co.za/${track.Audio}`}
                preload="none"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TrackList;
