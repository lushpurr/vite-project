
import './App.css'
import AnimatedBackground from './components/AnimatedBackground.tsx';
import WordPronouncer from './components/WordPronouncer.tsx'


const App = () => {
  const appName = "Awesome App";

  return (
    <>
        <AnimatedBackground /> {/* <--- Add the animated background here first */}

        <div className='pl-5 relative z-[1] bg-[rgba(255, 255, 255, 0.9)] p-5 min-h-[100vh]'>
          <h1>My {appName} for Learning!</h1>
          <hr />
          <WordPronouncer /> 

          <p className="read-the-docs mt-5 text-sm text-slate-500">
            Powered by React, Vite, the Free Dictionary API and Pixabay API.
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
