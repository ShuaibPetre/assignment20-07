// App.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';

import AboutSection from './components/AboutSection';
import Filters from './components/Filters';
import TrackList from './components/TrackList';
import Pagination from './components/Pagination';
import NowPlaying from './components/NowPlaying';

const PER_PAGE = 10;

function App() {
  const [tracks, setTracks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [manualPage, setManualPage] = useState('');
  const [sortMode, setSortMode] = useState('alpha-asc');
  const [about, setAbout] = useState(null);
  const audioRefs = useRef({});
  const [playingTrack, setPlayingTrack] = useState(null);
  const [loadingTrack, setLoadingTrack] = useState(false);

  useEffect(() => {
    fetch('https://arthurfrost.qflo.co.za/php/getTimeline.php')
      .then(res => res.json())
      .then(data => {
        if (!data?.Timeline) return;
        const allTracks = data.Timeline;
        setTracks(allTracks);

        const aboutInfo = data.Body[0];
        setAbout(aboutInfo);

        const uniqueCategories = [
          ...new Set(allTracks.map(t => t.Category || 'Uncategorized'))
        ];
        setCategories(uniqueCategories.sort());
      })
      .catch(err => console.error('Failed to fetch:', err));
  }, []);

  const filtered = useMemo(() => {
    let result = tracks.filter(t => {
      const nameMatch = t.Title?.toLowerCase().includes(search.toLowerCase());
      const categoryMatch = category === 'All' || t.Category === category;
      return nameMatch && categoryMatch;
    });

    switch (sortMode) {
      case 'alpha-asc':
        result.sort((a, b) => a.Title.localeCompare(b.Title));
        break;
      case 'alpha-desc':
        result.sort((a, b) => b.Title.localeCompare(a.Title));
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.CreateDate) - new Date(b.CreateDate));
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.CreateDate) - new Date(a.CreateDate));
        break;
    }

    return result;
  }, [tracks, search, category, sortMode]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageTracks = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSearch = debounce(val => {
    setSearch(val);
    setCurrentPage(1);
  }, 300);

  const handlePlay = (url, index) => {
    setLoadingTrack(true);

    // Pause all others
    Object.entries(audioRefs.current).forEach(([key, ref]) => {
      if (parseInt(key) !== index && ref) {
        ref.pause();
        ref.currentTime = 0;
      }
    });

    const audio = audioRefs.current[index];
    if (audio) {
      audio.play().then(() => {
        setPlayingTrack(index);
        setLoadingTrack(false);
      }).catch(() => {
        setLoadingTrack(false);
      });
    }
  };

  const handlePause = index => {
    const audio = audioRefs.current[index];
    if (audio) audio.pause();
  };

  const handleStop = index => {
    const audio = audioRefs.current[index];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      if (playingTrack === index) setPlayingTrack(null);
    }
  };

  const goToManualPage = () => {
    const page = parseInt(manualPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setManualPage('');
  };

  const toggleAlphaSort = () => {
    setSortMode(prev => (prev === 'alpha-asc' ? 'alpha-desc' : 'alpha-asc'));
  };

  const toggleDateSort = () => {
    setSortMode(prev => (prev === 'date-asc' ? 'date-desc' : 'date-asc'));
  };

  const backgroundImg = about?.Background
    ? `https://arthurfrost.qflo.co.za/${about.Background}`
    : '';

  // **Get current track from pageTracks using playingTrack index**
  const currentTrack = playingTrack !== null && pageTracks[playingTrack] ? pageTracks[playingTrack] : null;

  return (
    <div className="lg:max-w-[90%] mx-auto p-4">
      {backgroundImg && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImg})`, opacity: 0.35 }}
        />
      )}

      <div className="relative z-10 p-8 text-black">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <AboutSection about={about} />
          </div>

          <div className="lg:col-span-3 text-sm">
            <Filters
              search={search}
              handleSearch={handleSearch}
              category={category}
              setCategory={setCategory}
              categories={categories}
              toggleAlphaSort={toggleAlphaSort}
              toggleDateSort={toggleDateSort}
              sortMode={sortMode}
            />

            <TrackList
              tracks={pageTracks}
              handlePlay={handlePlay}
              handlePause={handlePause}
              handleStop={handleStop}
              audioRefs={audioRefs}
              playingTrack={playingTrack}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                manualPage={manualPage}
                setManualPage={setManualPage}
                goToManualPage={goToManualPage}
              />
            )}

            {/* Now Playing tab below the track list */}
            {playingTrack !== null && (
              <NowPlaying
                track={filtered[playingTrack]}
                audioRefs={audioRefs}
                playingTrack={playingTrack}
                handlePause={handlePause}
                handleStop={handleStop}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
