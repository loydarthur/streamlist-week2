<<<<<<< Updated upstream
import './App.css';
=======
// App.js
>>>>>>> Stashed changes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import StreamList from './components/StreamList';
import Movies from './components/Movies';
import Cart from './components/Cart';
import About from './components/About';
<<<<<<< Updated upstream
=======
import TMDBMovies from './components/TMDBMovies';
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<StreamList />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
<<<<<<< Updated upstream
=======
        <Route path="/tmdb" element={<TMDBMovies />} />  {/* New route */}
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;
