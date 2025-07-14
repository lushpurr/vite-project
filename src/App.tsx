
import WordPronouncer from './components/WordPronouncer.tsx'
import './App.css'

function App(){
  const appName = "Awesome App";

  return (
    <>
        <div className='pl-5'>
          <h1>My {appName} for Learning!</h1>
          <hr />
          <WordPronouncer /> {/* <--- Add your new WordPronouncer component here */}

          <p className="read-the-docs " style={{ marginTop: '20px', fontSize: '0.9em', color: '#888' }}>
            Powered by React, Vite, and the Free Dictionary API.
          </p>

        </div>
  
    </>
  )


}

export default App;
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
