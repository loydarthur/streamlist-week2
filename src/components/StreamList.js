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
