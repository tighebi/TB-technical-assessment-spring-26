import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lesson1 from './pages/Lesson1';
import './App.css'

function App() {
  return (
    <div className="app-container">
      {/* The Navbar stays visible on ALL pages */}
      <nav>
        <h1>Super Cool Stuff</h1>
      </nav>

      {/* The Routes switch out the content based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson-1" element={<Lesson1 />} />
        {/* Add more routes here as you build pages */}
      </Routes>
    </div>
  )
}

export default App
