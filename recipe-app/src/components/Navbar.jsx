import React, { useState } from 'react';
import { FaHome, FaBook, FaHeart, FaSearch, FaPlus } from 'react-icons/fa';

function Navbar({ onAddRecipeClick, currentPage, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add your search logic here
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="#home">
          Recipe Hub
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => onNavigate && onNavigate('home')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <FaHome className="me-1" /> Home
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'recipes' ? 'active' : ''}`}
                onClick={() => onNavigate && onNavigate('recipes')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <FaBook className="me-1" /> My Recipes
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentPage === 'favorites' ? 'active' : ''}`}
                onClick={() => onNavigate && onNavigate('favorites')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <FaHeart className="me-1" /> Favorites
              </button>
            </li>
          </ul>

          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search recipes..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: '250px' }}
            />
            <button className="btn btn-outline-light" type="submit">
              <FaSearch className="me-1" /> Search
            </button>
          </form>

          <button
            className="btn btn-warning fw-bold"
            onClick={onAddRecipeClick}
          >
            <FaPlus className="me-1" /> Add Recipe
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
