import  { useState, useEffect, useRef, type JSX, useCallback} from "react";

// Define interfaces for the API response structure
interface Phonetic {
  text?: string;
  audio?: string; // Optional because not all phonetics have audio
}

interface WordDefinition {
  word: string;
  phonetic?: string; // Optional
  phonetics: Phonetic[];
}

const PIXABAY_API_KEY: string = '51320868-6480bc8a9e8163236e4746bb6'; 


const simpleWords: string[] = [
  'apple', 'ball', 'cat', 'dog', 'tree', 'bird', 'car', 'book', 'milk', 'water',
  'sun', 'moon', 'star', 'flower', 'bear', 'fish', 'house', 'shoe', 'hat', 'cup'
];

function WordPronouncer():  JSX.Element  {
  const [word, setWord] = useState<string>('');
  const [phonetic, setPhonetic] = useState<string>('');
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for image
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState<string>('');
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);


  // useRef to keep a reference to the Audio HTML element
  const audioRef = useRef<HTMLAudioElement>(null);

  // Function to get a random word from our list
  const getRandomWord = (): string => {
    const randomIndex = Math.floor(Math.random() * simpleWords.length);
    return simpleWords[randomIndex];
  };

    // Wrap fetchImageData in useCallback
  const fetchImageData = useCallback(async (wordToSearch: string): Promise<void> => {
    setImageLoading(true);
    setImageError(null);
    setImageSrc(null);
    setImageAlt('');

    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(wordToSearch)}&image_type=illustration&safesearch=true&per_page=3`
      );

      if (!response.ok) {
        throw new Error(`Pixabay API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.hits && data.hits.length > 0) {
        const firstHit = data.hits[0];
        setImageSrc(firstHit.webformatURL);
        setImageAlt(firstHit.tags || `Image of ${wordToSearch}`);
      } else {
        throw new Error('No relevant illustration found on Pixabay.');
      }

    } catch (e: unknown) {
      console.error("Error fetching image data from Pixabay:", e);
      if (e instanceof Error) {
        setImageError(e.message || 'Failed to load image.');
      } else if (typeof e === 'string') {
        setImageError(e || 'Failed to load image.');
      } else {
        setImageError('Failed to load image: An unknown error occurred.');
      }
    } finally {
      setImageLoading(false);
    }
  }, [setImageLoading, setImageError, setImageSrc, setImageAlt]); // Dependencies for useCallback: state setters are stable

    // Wrap fetchWordData in useCallback
  const fetchWordData = useCallback(async (wordToFetch: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setAudioSrc('');
    setPhonetic('');
    setWord('');

    setImageSrc(null);
    setImageAlt('');
    setImageError(null);
    setImageLoading(false);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToFetch}`);

      if (!response.ok) {
        throw new Error(`Word not found or API error: ${response.statusText}`);
      }

      const data: WordDefinition[] = await response.json();

      if (data.length === 0) {
        throw new Error('No definition found for this word.');
      }

      const entry = data[0];
      const foundPhonetic = entry.phonetic || entry.phonetics?.[0]?.text || '';
      const foundAudio = entry.phonetics.find((p: Phonetic) => p.audio && p.audio.endsWith('.mp3'))?.audio || '';

      setWord(wordToFetch);
      setPhonetic(foundPhonetic);
      setAudioSrc(foundAudio);

      fetchImageData(wordToFetch); // fetchImageData is now a stable reference

    } catch (e: unknown) {
      console.error("Error fetching word data:", e);
      if (e instanceof Error) {
        setError(e.message || 'Failed to load word. Please try again.');
      } else if (typeof e === 'string') {
        setError(e || 'Failed to load word. Please try again.');
      } else {
        setError('Failed to load word. An unknown error occurred.');
      }
      setWord(wordToFetch);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setAudioSrc, setPhonetic, setWord, fetchImageData]); // Dependencies for fetchWordData


    // useEffect to fetch a random word when the component mounts
  useEffect(() => {
    fetchWordData(getRandomWord());
  }, [fetchWordData]); 


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
        <div 
        className="
          font-sans
          w-max-[400px]
          m-5
          p-6
          border-2
          border-[#4CAF50]
          rounded-[10px]
          shadow-2xl
          text-center
          bg-[#f9f9f9]"
    >
      <h2 style={{ color: '#333', marginBottom: '15px' }}>Let's Learn a Word!</h2>

      {(loading || imageLoading) && <p style={{ color: '#007bff' }}>Loading...</p>}
      {(error || imageError) && <p style={{ color: 'red' }}>{error || imageError}</p>}

      {!loading && !error && word && (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          {/* Word and Pronunciation Section */}
          <div style={{ flex: 1, minWidth: '250px' }}>
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
                <audio ref={audioRef} src={audioSrc} hidden />
              </>
            ) : (
              <p style={{ color: '#999' }}>No audio available.</p>
            )}
          </div>

          {/* Image Section */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            {imageSrc && (
              <>
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #ccc' }}
                />
                <p style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
                  Image from Pixabay
                </p>
              </>
            )}
            {!imageSrc && !imageLoading && !imageError && (
              <p style={{ color: '#999' }}>No image found.</p>
            )}
          </div>
        </div>
      )}

      {!loading && !error && (
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
      )}

      {!loading && !error && !word && <p>Click 'Next Word' to start learning!</p>}
    </div>
  )
};



export default WordPronouncer;
