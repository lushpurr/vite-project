import React, { useState, useEffect, useRef} from "react";

const simpleWords = [
  'apple', 'ball', 'cat', 'dog', 'tree', 'bird', 'car', 'book', 'milk', 'water',
  'sun', 'moon', 'star', 'flower', 'bear', 'fish', 'house', 'shoe', 'hat', 'cup'
];

function WordPronouncer() {
    const [word, setWord] = useState('');
    const [phonetic, setPhonetic] = useState('');
    const [audioSrc, setAudioSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // useRef to keep a reference to the Audio HTML element
    const audioRef = useRef(null);

    // Function to get a random word from our list
  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * simpleWords.length);
    return simpleWords[randomIndex];
  };

  // Function to fetch word date

const fetchWordData = async (wordToFetch) => {
    setLoading(true);
    setError(null);
    setAudioSrc('');
    setPhonetic('');

    try {
        // Free Dictionary API endpoint for a word
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToFetch}`);
    
      console.log('API response', response)
      if (!response.ok) {
        throw new Error(`Word not found or API error: ${response.statusText}`);
      }

      const data = await response.json();

      // The API returns an array, take the first entry

      const entry = data[0];

      // Extract phonetic text (handle cases where it might be missing)
      const foundAudio = entry.phonetics.find(p => p.audio && p.audio.endsWith('.mp3'))?.audio || '';

      setWord(wordToFetch);
      setPhonetic(foundPhonetic);
      setAudioSrc(foundAudio);
    } catch (e) { 
      console.error("Error fetching word data:", e);
      setError('Failed to load word. Please try again.');
      setWord(wordToFetch); // Still display the word even if data fetch fails

    } finally {
      setLoading(false);
    }
  }

  // useEffect to fetch a random word when the component mounts
  useEffect(() => {
    fetchWordData(getRandomWord());
  }, []); // Empty dependency array: runs only once on mount

  // Function to play audio
  const playAudio = () => {
    if (audioRef.current && audioSrc) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  };

    // Function to get a new random word
  const handleNextWord = () => {
    fetchWordData(getRandomWord());
  };

  return (
        <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '400px',
      margin: '20px auto',
      padding: '25px',
      border: '2px solid #4CAF50',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ color: '#333', marginBottom: '15px' }}>Let's Learn a Word!</h2>

      {loading && <p style={{ color: '#007bff' }}>Loading word...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && word && (
        <>
          <p style={{ fontSize: '3em', fontWeight: 'bold', color: '#0056b3', marginBottom: '5px' }}>
            {word.toUpperCase()}
          </p>
          {phonetic && (
            <p style={{ fontSize: '1.2em', color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
              {phonetic}
            </p>
          )}

          {audioSrc ? (
            <>
              <button
                onClick={playAudio}
                style={{
                  padding: '10px 20px',
                  fontSize: '1.2em',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                🔊 Play
              </button>
              <audio ref={audioRef} src={audioSrc} hidden /> {/* Hidden audio element */}
            </>
          ) : (
            <p style={{ color: '#999' }}>No audio available for this word.</p>
          )}

          <button
            onClick={handleNextWord}
            style={{
              padding: '10px 20px',
              fontSize: '1.2em',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Next Word
          </button>
        </>
      )}

      {/* Optionally, display a message if no word is loaded yet */}
      {!loading && !error && !word && <p>Click 'Next Word' to start learning!</p>}
    </div>
  )
};



export default WordPronouncer;
