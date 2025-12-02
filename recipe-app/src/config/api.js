// API Configuration
// This file centralizes API URL configuration for easy deployment

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://recipe-miwc.onrender.com';

export const API_ENDPOINTS = {
  // Recipe CRUD operations
  getAllRecipes: `${API_BASE_URL}/api/recipes`,
  getRecipeById: (id) => `${API_BASE_URL}/api/recipes/${id}`,
  createRecipe: `${API_BASE_URL}/api/recipes`,
  updateRecipe: (id) => `${API_BASE_URL}/api/recipes/${id}`,
  deleteRecipe: (id) => `${API_BASE_URL}/api/recipes/${id}`,
  
  // Spoonacular API (via backend proxy)
  getSpoonacularRecipes: `${API_BASE_URL}/api/spoonacular/recipes/random`,
};

export default API_BASE_URL;
