import './App.css';
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import FavoritesPage from './components/FavoritesPage';
import RecipeForm from './components/RecipeForm';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [refreshRecipes, setRefreshRecipes] = useState(0);
  const [currentPage, setCurrentPage] = useState('home');
  const [favorites, setFavorites] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Fetch all recipes
  useEffect(() => {
    fetchAllRecipes();
  }, [refreshRecipes]);

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setAllRecipes(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleShowForm = () => {
    setEditingRecipe(null);
    setShowForm(true);
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleToggleFavorite = (recipeId) => {
    setFavorites((prevFavorites) => {
      let newFavorites;
      if (prevFavorites.includes(recipeId)) {
        newFavorites = prevFavorites.filter(id => id !== recipeId);
      } else {
        newFavorites = [...prevFavorites, recipeId];
      }
      // Save to localStorage
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const getFavoriteRecipes = () => {
    return allRecipes.filter(recipe => favorites.includes(recipe._id));
  };

  const handleRecipeSubmit = async (recipeData) => {
    try {
      const isEditing = editingRecipe !== null;
      const url = isEditing 
        ? `http://localhost:5000/api/recipes/${editingRecipe._id}`
        : 'http://localhost:5000/api/recipes';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      const result = await response.json();

      if (result.success) {
        alert(isEditing ? 'Recipe updated successfully!' : 'Recipe created successfully!');
        setShowForm(false);
        setEditingRecipe(null);
        // Trigger refresh of recipes list
        setRefreshRecipes(prev => prev + 1);
      } else {
        alert('Error saving recipe: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  };

  return (
    <div className="App">
      {showForm ? (
        <RecipeForm 
          mode={editingRecipe ? 'edit' : 'create'}
          initialData={editingRecipe}
          onSubmit={handleRecipeSubmit} 
          onCancel={handleCloseForm} 
        />
      ) : currentPage === 'favorites' ? (
        <FavoritesPage
          onAddRecipeClick={handleShowForm}
          onEditRecipe={handleEditRecipe}
          favorites={getFavoriteRecipes()}
          onToggleFavorite={handleToggleFavorite}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      ) : (
        <HomePage 
          onAddRecipeClick={handleShowForm}
          onEditRecipe={handleEditRecipe}
          refreshTrigger={refreshRecipes}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
