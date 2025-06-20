const TrackCard = ({ track, index, handlePlay, handleStop, audioRef }) => (
  <div className="flex items-center gap-4 border-b pb-2">
    <img
      src={`https://arthurfrost.qflo.co.za/${track.Image}`}
      alt="Thumb"
      className="w-12 h-12 object-cover rounded"
    />

    <div className="flex-1">
      <div className="font-semibold">{track.Title}</div>
      <div className="text-sm text-gray-500">{track.Category}</div>
    </div>

    <div className="flex items-center gap-2">
      <button onClick={() => handlePlay(`https://arthurfrost.qflo.co.za/${track.Audio}`, index)} className="text-xl">▶️</button>
      <button onClick={() => handleStop(index)} className="text-xl">⏹️</button>
      <audio
        ref={audioRef}
        src={`https://arthurfrost.qflo.co.za/${track.Audio}`}
        preload="none"
      />
    </div>
  </div>
);

export default TrackCard;