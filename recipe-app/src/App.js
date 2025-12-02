import './App.css';
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import FavoritesPage from './components/FavoritesPage';
import DiscoverPage from './components/DiscoverPage';
import RecipeForm from './components/RecipeForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_ENDPOINTS } from './config/api';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [refreshRecipes, setRefreshRecipes] = useState(0);
  const [currentPage, setCurrentPage] = useState('home');
  const [favorites, setFavorites] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    fetchAllRecipes();
  }, [refreshRecipes]);

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.getAllRecipes);
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
    setSearchQuery(''); 
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleToggleFavorite = (recipeId) => {
    setFavorites((prevFavorites) => {
      let newFavorites;
      if (prevFavorites.includes(recipeId)) {
        newFavorites = prevFavorites.filter(id => id !== recipeId);
      } else {
        newFavorites = [...prevFavorites, recipeId];
      }

      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const getFavoriteRecipes = () => {
    return allRecipes.filter(recipe => favorites.includes(recipe._id));
  };

  const handleRecipeSubmit = async (recipeData) => {
    const { toast } = await import('react-toastify');
    
    try {
      const isEditing = editingRecipe !== null;
      const url = isEditing 
        ? API_ENDPOINTS.updateRecipe(editingRecipe._id)
        : API_ENDPOINTS.createRecipe;
      
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
        toast.success(isEditing ? 'Recipe updated successfully!' : 'Recipe created successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowForm(false);
        setEditingRecipe(null);

        setRefreshRecipes(prev => prev + 1);
      } else {
        toast.error('Error saving recipe: ' + result.error, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      toast.error('Failed to save recipe. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      {showForm ? (
        <RecipeForm 
          mode={editingRecipe ? 'edit' : 'create'}
          initialData={editingRecipe}
          onSubmit={handleRecipeSubmit} 
          onCancel={handleCloseForm} 
        />
      ) : currentPage === 'discover' ? (
        <DiscoverPage
          onAddRecipeClick={handleShowForm}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
      ) : currentPage === 'favorites' ? (
        <FavoritesPage
          onAddRecipeClick={handleShowForm}
          onEditRecipe={handleEditRecipe}
          favorites={getFavoriteRecipes()}
          onToggleFavorite={handleToggleFavorite}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
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
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}

export default App;
