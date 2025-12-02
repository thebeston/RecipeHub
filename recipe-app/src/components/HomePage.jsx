import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import RecipeCard from './RecipeCard';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

function HomePage({ onAddRecipeClick, onEditRecipe, refreshTrigger, favorites, onToggleFavorite, currentPage, onNavigate }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, [refreshTrigger]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/recipes');
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      const data = await response.json();
      setRecipes(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar 
        onAddRecipeClick={onAddRecipeClick}
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
      
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">
            Welcome to Recipe Hub
          </h1>
          <p className="lead text-muted">
            Discover and share amazing recipes from around the world
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <FaSpinner className="fa-spin text-primary" size={50} />
            <p className="mt-3 text-muted">Loading delicious recipes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FaExclamationTriangle className="me-2" size={24} />
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-4">
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-muted"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-muted mb-3">No Recipes Yet</h3>
            <p className="text-muted">
              Be the first to add a recipe to the collection!
            </p>
            <button 
              className="btn btn-primary btn-lg mt-3"
              onClick={onAddRecipeClick}
            >
              Add Your First Recipe
            </button>
          </div>
        )}

        {/* Recipe Cards Grid */}
        {!loading && !error && recipes.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">All Recipes ({recipes.length})</h2>
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-outline-primary active">
                  All
                </button>
                <button type="button" className="btn btn-outline-primary">
                  Vegetarian
                </button>
                <button type="button" className="btn btn-outline-primary">
                  Quick & Easy
                </button>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {recipes.map((recipe) => (
                <div key={recipe._id} className="col">
                  <RecipeCard 
                    recipe={recipe} 
                    onEdit={onEditRecipe}
                    isFavorite={favorites.includes(recipe._id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
