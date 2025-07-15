import  { useState, useEffect, useRef, type JSX} from "react";

// Define interfaces for the API response structure
interface Phonetic {
  text?: string;
  audio?: string; // Optional because not all phonetics have audio
}

interface WordDefinition {
  word: string;
  phonetic?: string; // Optional
  phonetics: Phonetic[];
  // Other properties like meanings, origin, etc., can be added if needed
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

   const fetchImageData = async (wordToSearch: string): Promise<void> => {
    setImageLoading(true);
    setImageError(null);
    setImageSrc(null);
    setImageAlt('');

    try {
       // Pixabay API Call
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(wordToSearch)}&image_type=illustration&safesearch=true&per_page=3`
      ); // image_type=illustration for cartoons/clipart

      if (!response.ok) {
        throw new Error(`Pixabay API error: ${response.statusText}`);
      }

      const data = await response.json(); // Pixabay response is simpler to parse

      console.log("RESPONSE", data)

     if (data.hits && data.hits.length > 0) {
        // Pick the first result, or you could randomize it:
        const firstHit = data.hits[0];
        setImageSrc(firstHit.webformatURL); // webformatURL is good for web display (smaller size)
        setImageAlt(firstHit.tags || `Image of ${wordToSearch}`); // Pixabay provides 'tags' for alt text

      } else {
        throw new Error('No relevant illustration found on Pixabay.');
      }

    } catch (e: unknown) {
      console.error("Error fetching image data:", e);
      
      // Safely check if 'e' is an an Error object
      if (e instanceof Error) {
        setImageError(e.message || 'Failed to load image.');
      } else if (typeof e === 'string') {
        // If it's a string (less common, but possible in JS)
        setImageError(e || 'Failed to load image.');
      } else {
        // Fallback for any other unexpected type
        setImageError('Failed to load image: An unknown error occurred.');
      }
    } finally {
      setImageLoading(false);
    }
  };

  // Function to fetch word date

const fetchWordData = async (wordToFetch: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setAudioSrc('');
    setPhonetic('');
    setWord(''); // Clear word until successfully fetched

    // Also clear image state while fetching new word data
    setImageSrc(null);
    setImageAlt('');
    setImageError(null);
    setImageLoading(false); // Reset image loading for next fetch

    try {
        // Free Dictionary API endpoint for a word
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToFetch}`);
    
      console.log('API response', response)
      if (!response.ok) {
        throw new Error(`Word not found or API error: ${response.statusText}`);
      }

         // Explicitly cast the response to an array of WordDefinition
      const data: WordDefinition[] = await response.json();

      // The API returns an array, take the first entry

      const entry = data[0];

          // Extract phonetic text (handle cases where it might be missing)
      const foundPhonetic = entry.phonetic || entry.phonetics[0]?.text || '';

  // Extract audio source (find the first MP3 audio link)
      const foundAudio = entry.phonetics.find((p: Phonetic) => p.audio && p.audio.endsWith('.mp3'))?.audio || '';

      setWord(wordToFetch);
      setPhonetic(foundPhonetic);
      setAudioSrc(foundAudio);
      // Successfully fetched word data, now fetch image data
      fetchImageData(wordToFetch);
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
       {/* <div style={{
      fontFamily: 'Arial, sans-serif', // Using inline style for now, integrate Tailwind later
      maxWidth: '800px', // Increased max-width to accommodate image
      margin: '20px auto',
      padding: '25px',
      border: '2px solid #4CAF50',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      display: 'flex', // Use flexbox for layout
      flexDirection: 'column',
      gap: '20px'
    }}> */}
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
      /* <h2 style={{ color: '#333', marginBottom: '15px' }}>Let's Learn a Word!</h2>

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
              <audio ref={audioRef} src={audioSrc} hidden /> {/* Hidden audio element */
          //   </>
          // ) : (
          //   <p style={{ color: '#999' }}>No audio available for this word.</p>
          // )}

    //       <button
    //         onClick={handleNextWord}
    //         style={{
    //           padding: '10px 20px',
    //           fontSize: '1.2em',
    //           backgroundColor: '#007bff',
    //           color: 'white',
    //           border: 'none',
    //           borderRadius: '5px',
    //           cursor: 'pointer',
    //           marginTop: '20px'
    //         }}
    //       >
    //         Next Word
    //       </button>
    //     </>
    //   )}

    //   {/* Optionally, display a message if no word is loaded yet */}
    //   {!loading && !error && !word && <p>Click 'Next Word' to start learning!</p>}
    // </div> */}
  )
};



export default WordPronouncer;
