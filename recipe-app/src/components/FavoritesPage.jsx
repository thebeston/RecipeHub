import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import RecipeCard from './RecipeCard';
import RecipeDetail from './RecipeDetail';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../config/api';

function FavoritesPage({ onAddRecipeClick, onEditRecipe, favorites, onToggleFavorite, currentPage, onNavigate, onSearch, searchQuery: propSearchQuery }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState(propSearchQuery || '');
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  useEffect(() => {

    if (searchQuery.trim() === '') {
      setFilteredFavorites(favorites);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = favorites.filter(recipe => {

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
      setFilteredFavorites(filtered);
    }
  }, [searchQuery, favorites]);

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
        isFavorite={favorites.some(fav => fav._id === selectedRecipe._id)}
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
          <h1 className="display-4 fw-bold text-danger mb-3">
            <FaHeart className="me-3" />
            My Favorite Recipes
          </h1>
          <p className="lead text-muted">
            All your beloved recipes in one place
          </p>
        </div>

        {favorites.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-4">
              <FaHeart size={80} className="text-muted" />
            </div>
            <h3 className="text-muted mb-3">No Favorite Recipes Yet</h3>
            <p className="text-muted">
              Start adding recipes to your favorites by clicking the heart icon on any recipe card!
            </p>
          </div>
        )}

        {favorites.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">
                {searchQuery ? `Search Results (${filteredFavorites.length})` : `Favorite Recipes (${favorites.length})`}
              </h2>
              {searchQuery && (
                <div className="alert alert-info mb-0 py-2" role="alert">
                  Searching for: <strong>{searchQuery}</strong>
                </div>
              )}
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="text-center py-5">
                <h3 className="text-muted mb-3">No favorite recipes found</h3>
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
                {filteredFavorites.map((recipe) => (
                  <div key={recipe._id} className="col">
                    <RecipeCard 
                      recipe={recipe} 
                      onEdit={onEditRecipe}
                      onDelete={handleDeleteRecipe}
                      onViewRecipe={handleViewRecipe}
                      isFavorite={true}
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

export default FavoritesPage;
