import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import RecipeCard from './RecipeCard';
import { FaSpinner, FaHeart } from 'react-icons/fa';

function FavoritesPage({ onAddRecipeClick, onEditRecipe, favorites, onToggleFavorite, currentPage, onNavigate }) {
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
          <h1 className="display-4 fw-bold text-danger mb-3">
            <FaHeart className="me-3" />
            My Favorite Recipes
          </h1>
          <p className="lead text-muted">
            All your beloved recipes in one place
          </p>
        </div>

        {/* Empty State */}
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

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">Favorite Recipes ({favorites.length})</h2>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {favorites.map((recipe) => (
                <div key={recipe._id} className="col">
                  <RecipeCard 
                    recipe={recipe} 
                    onEdit={onEditRecipe}
                    isFavorite={true}
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

export default FavoritesPage;
