<<<<<<< Updated upstream
import React, { useState } from 'react';
import { FaFilm, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import './StreamList.css'; // Import CSS file for styling

function StreamList() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState([

  ]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input.trim()) {
      setMovies([...movies, { id: Date.now(), name: input, completed: false }]);
      setInput("");
    }
  };

  const handleDelete = (id) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  const handleComplete = (id) => {
    setMovies(
      movies.map(movie => 
        movie.id === id ? { ...movie, completed: !movie.completed } : movie
      )
    );
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditText(name);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    setMovies(
      movies.map(movie => 
        movie.id === editId ? { ...movie, name: editText } : movie
      )
    );
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="streamlist-container">
      <h1>StreamList - Your Movie/TV Show List</h1>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Add a movie/show..."
        />
        <button type="submit"><FaFilm /> Add</button>
      </form>

      <ul className="movie-list">
        {movies.map(movie => (
          <li key={movie.id} className={movie.completed ? "completed" : ""}>
            {editId === movie.id ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <input 
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button type="submit"><FaCheck /></button>
              </form>
            ) : (
              <>
                <span>{movie.name}</span>
                <div className="actions">
                  <button onClick={() => handleComplete(movie.id)}><FaCheck /></button>
                  <button onClick={() => handleEdit(movie.id, movie.name)}><FaEdit /></button>
                  <button onClick={() => handleDelete(movie.id)}><FaTrash /></button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;
=======
// components/StreamList.js
import React, { useState, useEffect } from 'react';
import { FaFilm, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import './StreamList.css';

// Helper function to normalize titles by trimming and converting to lowercase.
const normalizeTitle = (title) => title.trim().toLowerCase();

function StreamList() {
  const [input, setInput] = useState('');
  const [movies, setMovies] = useState(() => {
    const storedMovies = localStorage.getItem('movies');
    return storedMovies ? JSON.parse(storedMovies) : [];
  });
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // Persist movies to Local Storage whenever movies state changes.
  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  // Function to search TMDB for a given query.
  const searchMovieOnTMDB = async (query) => {
    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching movie from TMDB');
    }
    const data = await response.json();
    return data.results;
  };

  // Validation logic: returns matching movie if found, otherwise undefined.
  const validateMovie = async (titleToValidate) => {
    const results = await searchMovieOnTMDB(titleToValidate);
    let matchingMovie;
    if (results && results.length > 0) {
      // Attempt an exact match.
      matchingMovie = results.find(
        (movie) =>
          movie.title &&
          normalizeTitle(movie.title) === normalizeTitle(titleToValidate)
      );
      // If no exact match, try a partial match.
      if (!matchingMovie) {
        const partialMatches = results.filter(
          (movie) =>
            movie.title &&
            normalizeTitle(movie.title).includes(normalizeTitle(titleToValidate))
        );
        if (partialMatches.length > 0) {
          matchingMovie = partialMatches[0]; // Choose the first partial match.
        }
      }
    }
    return matchingMovie;
  };

  // Handler for form submission (adding a movie).
  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    try {
      const matchingMovie = await validateMovie(trimmedInput);

      if (!matchingMovie) {
        setNotificationMessage("Movie not validated by TMDB. Adding movie anyway.");
        setTimeout(() => setNotificationMessage(''), 3000);
        setMovies([
          ...movies,
          {
            id: Date.now(),
            name: trimmedInput,
            verified: false,
            tmdbData: null,
          },
        ]);
      } else {
        setMovies([
          ...movies,
          {
            id: Date.now(),
            name: matchingMovie.title,
            verified: true,
            tmdbData: matchingMovie,
          },
        ]);
      }
      setInput('');
    } catch (error) {
      setNotificationMessage("Error validating movie. Please try again later.");
      setTimeout(() => setNotificationMessage(''), 3000);
    }
  };

  // Handler for edit submission (revalidate after editing).
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const trimmedEditText = editText.trim();
    if (!trimmedEditText) return;

    try {
      const matchingMovie = await validateMovie(trimmedEditText);
      setMovies(
        movies.map((movie) =>
          movie.id === editId
            ? {
                ...movie,
                name: matchingMovie ? matchingMovie.title : trimmedEditText,
                verified: matchingMovie ? true : false,
                tmdbData: matchingMovie || null,
              }
            : movie
        )
      );
      setEditId(null);
      setEditText('');
    } catch (error) {
      setNotificationMessage("Error validating movie on edit. Please try again later.");
      setTimeout(() => setNotificationMessage(''), 3000);
    }
  };

  const handleDelete = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  const handleComplete = (id) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id ? { ...movie, completed: !movie.completed } : movie
      )
    );
  };

  const handleEdit = (id, name) => {
    setEditId(id);
    setEditText(name);
  };

  return (
    <div className="streamlist-container">
      <h1>StreamList - Your Movie/TV Show List</h1>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a movie/show..."
        />
        <button type="submit">
          <FaFilm /> Add
        </button>
      </form>

      {/* Render the list of movies */}
      <ul className="movie-list">
        {movies.map((movie) => (
          <li key={movie.id} className={movie.completed ? "completed" : ""}>
            {editId === movie.id ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button type="submit">
                  <FaCheck />
                </button>
              </form>
            ) : (
              <>
                <span>
                  {movie.name}{' '}
                  {movie.verified && (
                    <>
                      <span className="verified-badge">Verified</span>
                      {movie.tmdbData && (
                        <a
                          href={`https://www.themoviedb.org/movie/${movie.tmdbData.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginLeft: '10px', color: '#0d47a1' }}
                        >
                          View on TMDB
                        </a>
                      )}
                    </>
                  )}
                </span>
                <div className="actions">
                  <button onClick={() => handleComplete(movie.id)}>
                    <FaCheck />
                  </button>
                  <button onClick={() => handleEdit(movie.id, movie.name)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(movie.id)}>
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Display the notification message at the bottom */}
      {notificationMessage && (
        <div
          className="notification-message"
          style={{ textAlign: 'center', marginTop: '20px', color: '#ff0000' }}
        >
          {notificationMessage}
        </div>
      )}
    </div>
  );
}

export default StreamList;
>>>>>>> Stashed changes
