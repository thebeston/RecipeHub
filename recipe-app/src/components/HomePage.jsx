import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../config/api';

function HomePage({ onAddRecipeClick, onEditRecipe, refreshTrigger, favorites, onToggleFavorite, currentPage, onNavigate, onSearch, searchQuery: propSearchQuery }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState(propSearchQuery || '');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, [refreshTrigger]);

  useEffect(() => {

    if (searchQuery.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = recipes.filter(recipe => {

        if (recipe.title.toLowerCase().includes(query)) {
          return true;
        }

        if (recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(query)
        )) {
          return true;
        }

        if (recipe.instructions.toLowerCase().includes(query)) {
          return true;
        }

        if (recipe.dietaryRestrictions) {
          const restrictions = Object.keys(recipe.dietaryRestrictions).filter(
            key => recipe.dietaryRestrictions[key]
          );
          if (restrictions.some(restriction => 
            restriction.toLowerCase().includes(query)
          )) {
            return true;
          }
        }
        return false;
      });
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.getAllRecipes);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      const data = await response.json();
      setRecipes(data.data || []);
      setFilteredRecipes(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(API_ENDPOINTS.deleteRecipe(recipeId), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      setRecipes(recipes.filter(recipe => recipe._id !== recipeId));

      if (selectedRecipe && selectedRecipe._id === recipeId) {
        setSelectedRecipe(null);
      }

      toast.success('Recipe deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Error deleting recipe:', err);
      toast.error('Failed to delete recipe. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToList = () => {
    setSelectedRecipe(null);
  };

  const handleEditFromDetail = (recipe) => {
    setSelectedRecipe(null);
    onEditRecipe(recipe);
  };

  const handleDeleteFromDetail = async (recipeId) => {
    await handleDeleteRecipe(recipeId);
  };

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={handleBackToList}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
        isFavorite={favorites.includes(selectedRecipe._id)}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar 
        onAddRecipeClick={onAddRecipeClick}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      
      <div className="container py-5">
        
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">
            Welcome to Recipe Hub
          </h1>
          <p className="lead text-muted">
            Discover and share amazing recipes from around the world
          </p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <FaSpinner className="fa-spin text-primary" size={50} />
            <p className="mt-3 text-muted">Loading delicious recipes...</p>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FaExclamationTriangle className="me-2" size={24} />
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

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

        {!loading && !error && recipes.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">
                {searchQuery ? `Search Results (${filteredRecipes.length})` : `All Recipes (${recipes.length})`}
              </h2>
              {searchQuery && (
                <div className="alert alert-info mb-0 py-2" role="alert">
                  Searching for: <strong>{searchQuery}</strong>
                </div>
              )}
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="text-center py-5">
                <h3 className="text-muted mb-3">No recipes found</h3>
                <p className="text-muted">
                  Try searching with different keywords or{' '}
                  <button 
                    className="btn btn-link p-0"
                    onClick={() => setSearchQuery('')}
                  >
                    clear your search
                  </button>
                </p>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredRecipes.map((recipe) => (
                  <div key={recipe._id} className="col">
                    <RecipeCard 
                      recipe={recipe} 
                      onEdit={onEditRecipe}
                      onDelete={handleDeleteRecipe}
                      onViewRecipe={handleViewRecipe}
                      isFavorite={favorites.includes(recipe._id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
