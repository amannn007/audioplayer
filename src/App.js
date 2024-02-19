import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const storedAudioFiles = JSON.parse(localStorage.getItem('audioFiles'));
    if (storedAudioFiles) setAudioFiles(storedAudioFiles);
  }, []);

  useEffect(() => {
    if (currentAudio) {
      const audio = new Audio(URL.createObjectURL(currentAudio));
      audio.currentTime = currentTime;
      audio.addEventListener('ended', () => {
        if (currentIndex < audioFiles.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
        }
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      audio.play();
    }
  }, [currentAudio, currentIndex, currentTime]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFiles([...audioFiles, file]);
      localStorage.setItem('audioFiles', JSON.stringify([...audioFiles, file]));
    }
  };

  const handlePlay = (index) => {
    setCurrentAudio(audioFiles[index]);
    setCurrentIndex(index);
  };

  const handlePause = () => {
    setCurrentAudio(null);
  };

  return (
    <div className="App">
      <h1>Audio Player</h1>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      <ul className="playlist">
        {audioFiles.map((file, index) => (
          <li key={index}>
            {file.name}
            <button onClick={() => handlePlay(index)}>Play</button>
          </li>
        ))}
      </ul>
      {currentAudio && (
        <div className="now-playing">
          <h2>Now Playing</h2>
          <audio src={URL.createObjectURL(currentAudio)} controls />
          <button onClick={handlePause}>Pause</button>
          <p>{currentAudio.name}</p>
        </div>
      )}
    </div>
  );
};

export default App;
