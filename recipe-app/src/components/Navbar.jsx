import React, { useState } from 'react';
import { FaHome, FaBook, FaHeart, FaSearch, FaPlus, FaTimes } from 'react-icons/fa';

function Navbar({ onAddRecipeClick, currentPage, onNavigate, onSearch, searchQuery = '' }) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearchQuery);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
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
                className={`nav-link ${currentPage === 'discover' ? 'active' : ''}`}
                onClick={() => onNavigate && onNavigate('discover')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <FaSearch className="me-1" /> Discover
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
            <div className="input-group" style={{ minWidth: '250px' }}>
              <input
                className="form-control"
                type="search"
                placeholder="Search recipes..."
                aria-label="Search"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
              {localSearchQuery && (
                <button 
                  className="btn btn-outline-light" 
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search"
                >
                  <FaTimes />
                </button>
              )}
              <button className="btn btn-outline-light" type="submit">
                <FaSearch />
              </button>
            </div>
          </form>

          {currentPage === 'home' && (
            <button
              className="btn btn-warning fw-bold"
              onClick={onAddRecipeClick}
            >
              <FaPlus className="me-1" /> Add Recipe
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
