import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import RecipeDetail from './RecipeDetail';
import { FaSpinner, FaExclamationTriangle, FaClock, FaLeaf, FaPlus, FaSearch, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../config/api';

const stripHtmlTags = (html) => {
  if (!html) return '';

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

function DiscoverPage({ onAddRecipeClick, currentPage, onNavigate, onSearch, searchQuery }) {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingRecipes, setAddingRecipes] = useState({});
  const [addedRecipes, setAddedRecipes] = useState(new Set()); 
  const [selectedRecipe, setSelectedRecipe] = useState(null); 
  const [searchInput, setSearchInput] = useState('');
  const [searching, setSearching] = useState(false);

  const [filters, setFilters] = useState({
    diet: [], 
    maxReadyTime: '',
    includeIngredients: '',
  });

  useEffect(() => {
    fetchRecipes();
    fetchExistingRecipes(); 
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, recipes, searchQuery]); 

  const fetchExistingRecipes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.getAllRecipes);
      if (response.ok) {
        const data = await response.json();

        const existingTitles = new Set(
          (data.data || []).map(recipe => recipe.title.toLowerCase().trim())
        );
        setAddedRecipes(existingTitles);
      }
    } catch (error) {
      console.error('Error fetching existing recipes:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_ENDPOINTS.getSpoonacularRecipes}?number=50`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recipes from Spoonacular API');
      }

      const data = await response.json();
      setRecipes(data.recipes || []);
      setFilteredRecipes(data.recipes || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async (query) => {
    if (!query.trim()) {
      fetchRecipes();
      return;
    }

    try {
      setSearching(true);
      setError(null);

      const response = await fetch(
        `${API_ENDPOINTS.searchSpoonacularRecipes}?query=${encodeURIComponent(query)}&number=20`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search recipes from Spoonacular API');
      }

      const data = await response.json();
      setRecipes(data.results || []);
      setFilteredRecipes(data.results || []);
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError(err.message);
      toast.error(`Search failed: ${err.message}`);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchRecipes(searchInput);
  };

  const applyFilters = () => {
    let filtered = [...recipes];

    if (filters.diet && filters.diet.length > 0) {
      filtered = filtered.filter(recipe => {

        return filters.diet.every(dietType => {
          if (dietType === 'vegetarian') return recipe.vegetarian;
          if (dietType === 'vegan') return recipe.vegan;
          if (dietType === 'glutenFree') return recipe.glutenFree;
          if (dietType === 'dairyFree') return recipe.dairyFree;
          return false;
        });
      });
    }

    if (filters.maxReadyTime) {
      filtered = filtered.filter(recipe => 
        recipe.readyInMinutes <= parseInt(filters.maxReadyTime)
      );
    }

    if (filters.includeIngredients) {
      const ingredients = filters.includeIngredients.toLowerCase().split(',').map(i => i.trim());
      filtered = filtered.filter(recipe => {
        const recipeIngredients = recipe.extendedIngredients
          .map(ing => ing.name.toLowerCase())
          .join(' ');
        return ingredients.some(ing => recipeIngredients.includes(ing));
      });
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => {

        if (recipe.title.toLowerCase().includes(query)) {
          return true;
        }

        if (recipe.extendedIngredients && recipe.extendedIngredients.some(ing => 
          ing.name.toLowerCase().includes(query) || ing.original.toLowerCase().includes(query)
        )) {
          return true;
        }

        if (recipe.summary && recipe.summary.toLowerCase().includes(query)) {
          return true;
        }
        return false;
      });
    }

    setFilteredRecipes(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleDietFilterToggle = (dietType) => {
    setFilters(prev => {
      const currentDiet = prev.diet || [];
      const isSelected = currentDiet.includes(dietType);
      
      return {
        ...prev,
        diet: isSelected
          ? currentDiet.filter(d => d !== dietType) 
          : [...currentDiet, dietType] 
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      diet: [],
      maxReadyTime: '',
      includeIngredients: '',
    });
  };

  const handleAddToCollection = async (spoonacularRecipe) => {

    const normalizedTitle = spoonacularRecipe.title.toLowerCase().trim();
    if (addedRecipes.has(normalizedTitle)) {
      toast.warning('This recipe is already in your collection!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setAddingRecipes(prev => ({ ...prev, [spoonacularRecipe.id]: true }));

    try {

      const recipeData = {
        title: spoonacularRecipe.title,
        ingredients: spoonacularRecipe.extendedIngredients.map(ing => ing.original),
        dietaryRestrictions: {
          vegetarian: spoonacularRecipe.vegetarian || false,
          vegan: spoonacularRecipe.vegan || false,
          glutenFree: spoonacularRecipe.glutenFree || false,
          dairyFree: spoonacularRecipe.dairyFree || false,
        },
        duration: spoonacularRecipe.readyInMinutes.toString(),
        instructions: stripHtmlTags(
          spoonacularRecipe.instructions || 
          spoonacularRecipe.analyzedInstructions?.[0]?.steps
            .map((step, index) => `${index + 1}. ${step.step}`)
            .join('\n') || 
          'No instructions available.'
        ),
        imageUrl: spoonacularRecipe.image || '',
      };

      const response = await fetch(API_ENDPOINTS.createRecipe, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      const result = await response.json();

      if (result.success) {

        setAddedRecipes(prev => new Set([...prev, normalizedTitle]));
        
        toast.success('Recipe added to your collection!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error('Failed to add recipe: ' + result.error, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast.error('Failed to add recipe. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setAddingRecipes(prev => ({ ...prev, [spoonacularRecipe.id]: false }));
    }
  };

  const handleViewRecipe = (spoonacularRecipe) => {

    const formattedRecipe = {
      _id: `spoonacular-${spoonacularRecipe.id}`, 
      title: spoonacularRecipe.title,
      ingredients: spoonacularRecipe.extendedIngredients.map(ing => ing.original),
      dietaryRestrictions: {
        vegetarian: spoonacularRecipe.vegetarian || false,
        vegan: spoonacularRecipe.vegan || false,
        glutenFree: spoonacularRecipe.glutenFree || false,
        dairyFree: spoonacularRecipe.dairyFree || false,
      },
      duration: spoonacularRecipe.readyInMinutes.toString(),
      instructions: stripHtmlTags(
        spoonacularRecipe.instructions || 
        spoonacularRecipe.analyzedInstructions?.[0]?.steps
          .map((step, index) => `${index + 1}. ${step.step}`)
          .join('\n') || 
        'No instructions available.'
      ),
      imageUrl: spoonacularRecipe.image || '',
      servings: spoonacularRecipe.servings,
      createdAt: new Date().toISOString(),
      isFromSpoonacular: true, 
    };
    setSelectedRecipe(formattedRecipe);
  };

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        onEdit={null} 
        onDelete={null} 
        onToggleFavorite={null} 
        isFavorite={false}
      />
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <Navbar 
        onAddRecipeClick={onAddRecipeClick}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onSearch={onSearch}
        searchQuery={searchQuery}
      />
      
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-success mb-3">
            Discover New Recipes
          </h1>
          <p className="lead text-muted">
            Explore thousands of recipes from around the world
          </p>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <FaSearch className="me-2" />
              Search & Filter Recipes
            </h5>
            
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="input-group input-group-lg">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for recipes (e.g., pasta, chicken, tacos)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button 
                  className="btn btn-primary" 
                  type="submit"
                  disabled={searching}
                >
                  {searching ? (
                    <>
                      <FaSpinner className="fa-spin me-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch className="me-2" />
                      Search API
                    </>
                  )}
                </button>
                {searchInput && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      fetchRecipes();
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <small className="text-muted">
                Search Spoonacular's database of thousands of recipes
              </small>
            </form>

            <div className="row g-3">
              
              <div className="col-md-4">
                <label className="form-label fw-bold">Dietary Restrictions</label>
                <div className="card bg-light border-0">
                  <div className="card-body py-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="filter-vegetarian"
                        checked={filters.diet.includes('vegetarian')}
                        onChange={() => handleDietFilterToggle('vegetarian')}
                      />
                      <label className="form-check-label" htmlFor="filter-vegetarian">
                        Vegetarian
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="filter-vegan"
                        checked={filters.diet.includes('vegan')}
                        onChange={() => handleDietFilterToggle('vegan')}
                      />
                      <label className="form-check-label" htmlFor="filter-vegan">
                        Vegan
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="filter-glutenFree"
                        checked={filters.diet.includes('glutenFree')}
                        onChange={() => handleDietFilterToggle('glutenFree')}
                      />
                      <label className="form-check-label" htmlFor="filter-glutenFree">
                        Gluten Free
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="filter-dairyFree"
                        checked={filters.diet.includes('dairyFree')}
                        onChange={() => handleDietFilterToggle('dairyFree')}
                      />
                      <label className="form-check-label" htmlFor="filter-dairyFree">
                        Dairy Free
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Max Cooking Time</label>
                <select 
                  className="form-select"
                  value={filters.maxReadyTime}
                  onChange={(e) => handleFilterChange('maxReadyTime', e.target.value)}
                >
                  <option value="">Any Time</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="25">25 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="75">1 hour 15 minutes</option>
                  <option value="90">1 hour 30 minutes</option>
                  <option value="105">1 hour 45 minutes</option>
                  <option value="120">2 hours</option>
                  <option value="150">2 hours 30 minutes</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                  <option value="300">5 hours</option>
                  <option value="360">6 hours</option>
                  <option value="420">7+ hours</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label fw-bold">Ingredients You Have</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., chicken, tomato"
                  value={filters.includeIngredients}
                  onChange={(e) => handleFilterChange('includeIngredients', e.target.value)}
                />
                <small className="text-muted">Separate with commas</small>
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <FaSpinner className="fa-spin text-success" size={50} />
            <p className="mt-3 text-muted">Discovering amazing recipes...</p>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FaExclamationTriangle className="me-2" size={24} />
            <div>
              <strong>Error:</strong> {error}
              <br />
              <small>Please make sure you have added your Spoonacular API key in the backend/config.env file.</small>
            </div>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="mb-4">
            <h2 className="fw-bold">
              {searchQuery || filters.diet.length > 0 || filters.maxReadyTime || filters.includeIngredients
                ? `Found ${filteredRecipes.length} recipes`
                : `Showing ${filteredRecipes.length} recipes`}
            </h2>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && filteredRecipes.length === 0 && (
          <div className="text-center py-5">
            <h3 className="text-muted mb-3">No recipes found</h3>
            <p className="text-muted">
              Try adjusting your filters or{' '}
              <button 
                className="btn btn-link p-0"
                onClick={clearFilters}
              >
                clear all filters
              </button>
            </p>
          </div>
        )}

        {!loading && !error && filteredRecipes.length > 0 && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="col">
                <div className="card h-100 shadow-sm hover-shadow transition">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="card-img-top"
                    style={{
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold mb-3">{recipe.title}</h5>

                    <div className="mb-3">
                      <span className="badge bg-primary">
                        <FaClock className="me-1" />
                        {recipe.readyInMinutes} min
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex flex-wrap gap-1">
                        {recipe.vegetarian && (
                          <span className="badge bg-success bg-opacity-10 text-success border border-success">
                            <FaLeaf className="me-1" size={10} />
                            Vegetarian
                          </span>
                        )}
                        {recipe.vegan && (
                          <span className="badge bg-success bg-opacity-10 text-success border border-success">
                            <FaLeaf className="me-1" size={10} />
                            Vegan
                          </span>
                        )}
                        {recipe.glutenFree && (
                          <span className="badge bg-info bg-opacity-10 text-info border border-info">
                            Gluten Free
                          </span>
                        )}
                        {recipe.dairyFree && (
                          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning">
                            Dairy Free
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 flex-grow-1">
                      <h6 className="text-muted small mb-2">Ingredients:</h6>
                      <ul className="small text-muted mb-0 ps-3">
                        {recipe.extendedIngredients.slice(0, 3).map((ingredient, index) => (
                          <li key={index}>{ingredient.original}</li>
                        ))}
                        {recipe.extendedIngredients.length > 3 && (
                          <li className="text-primary">
                            + {recipe.extendedIngredients.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleViewRecipe(recipe)}
                      >
                        <FaEye className="me-2" />
                        View Recipe
                      </button>

                      {addedRecipes.has(recipe.title.toLowerCase().trim()) ? (
                        <button 
                          className="btn btn-secondary"
                          disabled
                        >
                          <FaPlus className="me-2" />
                          Already in Collection
                        </button>
                      ) : (
                        <button 
                          className="btn btn-success"
                          onClick={() => handleAddToCollection(recipe)}
                          disabled={addingRecipes[recipe.id]}
                        >
                          {addingRecipes[recipe.id] ? (
                            <>
                              <FaSpinner className="fa-spin me-2" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <FaPlus className="me-2" />
                              Add to My Collection
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="card-footer bg-transparent border-top-0">
                    <small className="text-muted">
                      Servings: {recipe.servings} | Source: Spoonacular
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .fa-spin {
          animation: fa-spin 1s infinite linear;
        }
        @keyframes fa-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default DiscoverPage;
