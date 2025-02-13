import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css'; // Import the new CSS file

function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/">StreamList</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;
