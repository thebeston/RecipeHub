import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPlusCircle, FaClock, FaFileAlt, FaCheck, FaSave, FaTimes } from 'react-icons/fa';
import Navbar from './Navbar';

function RecipeForm({ mode = 'create', initialData = null, onSubmit, onCancel }) {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    ingredients: [''],
    dietaryRestrictions: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      lowCarb: false,
      keto: false,
      paleo: false,
    },
    duration: '30',
    instructions: '',
  });

  // Error state
  const [errors, setErrors] = useState({
    title: '',
    ingredients: '',
    instructions: '',
  });

  // Populate form if editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        title: initialData.title || '',
        ingredients: initialData.ingredients || [''],
        dietaryRestrictions: initialData.dietaryRestrictions || {
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          dairyFree: false,
          nutFree: false,
          lowCarb: false,
          keto: false,
          paleo: false,
        },
        duration: initialData.duration || '30',
        instructions: initialData.instructions || '',
      });
    }
  }, [mode, initialData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle ingredient changes
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
    // Clear ingredients error when user starts typing
    if (errors.ingredients) {
      setErrors({ ...errors, ingredients: '' });
    }
  };

  // Add ingredient field
  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    });
  };

  // Remove ingredient field
  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData({ ...formData, ingredients: newIngredients });
    }
  };

  // Handle dietary restriction checkbox changes
  const handleDietaryChange = (restriction) => {
    setFormData({
      ...formData,
      dietaryRestrictions: {
        ...formData.dietaryRestrictions,
        [restriction]: !formData.dietaryRestrictions[restriction],
      },
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    // Validate ingredients
    const filledIngredients = formData.ingredients.filter((ing) => ing.trim() !== '');
    if (filledIngredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
      isValid = false;
    }

    // Validate instructions
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Recipe instructions are required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Filter out empty ingredients
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter((ing) => ing.trim() !== ''),
      };

      onSubmit(cleanedData);

      // Reset form if creating
      if (mode === 'create') {
        setFormData({
          title: '',
          ingredients: [''],
          dietaryRestrictions: {
            vegetarian: false,
            vegan: false,
            glutenFree: false,
            dairyFree: false,
            nutFree: false,
            lowCarb: false,
            keto: false,
            paleo: false,
          },
          duration: '30',
          instructions: '',
        });
        setErrors({});
      }
    }
  };

  return (
    <>
      <Navbar onAddRecipeClick={onCancel} />
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card shadow-lg border-0">
              <div className="card-header text-white py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h3 className="mb-0 fw-bold">
                  {mode === 'create' ? <><FaPlus className="me-2" /> Create New Recipe</> : <><FaEdit className="me-2" /> Edit Recipe</>}
                </h3>
              </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="form-label fw-bold fs-5">
                Recipe Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                id="title"
                name="title"
                placeholder="e.g., Grandma's Chocolate Chip Cookies"
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && (
                <div className="invalid-feedback d-block">
                  <i className="bi bi-exclamation-circle"></i> {errors.title}
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div className="mb-4">
              <label className="form-label fw-bold fs-5">
                Ingredients <span className="text-danger">*</span>
              </label>
              <div className="bg-light p-3 rounded-3 border">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="input-group mb-2">
                    <span className="input-group-text bg-primary text-white fw-bold">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.ingredients && index === 0 ? 'is-invalid' : ''
                      }`}
                      placeholder="e.g., 2 cups all-purpose flour"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeIngredient(index)}
                        title="Remove ingredient"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                {errors.ingredients && (
                  <div className="alert alert-danger py-2 mb-2">
                    <i className="bi bi-exclamation-triangle"></i> {errors.ingredients}
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={addIngredient}
                >
                  <FaPlusCircle className="me-1" /> Add Another Ingredient
                </button>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="mb-4">
              <label className="form-label fw-bold fs-5">
                Dietary Restrictions <span className="text-muted small">(Select all that apply)</span>
              </label>
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="row g-3">
                    {Object.keys(formData.dietaryRestrictions).map((restriction) => (
                      <div key={restriction} className="col-md-6 col-lg-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={restriction}
                            checked={formData.dietaryRestrictions[restriction]}
                            onChange={() => handleDietaryChange(restriction)}
                            style={{ cursor: 'pointer' }}
                          />
                          <label 
                            className="form-check-label" 
                            htmlFor={restriction}
                            style={{ cursor: 'pointer' }}
                          >
                            {restriction
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (str) => str.toUpperCase())}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-4">
              <label htmlFor="duration" className="form-label fw-bold fs-5">
                <FaClock className="me-1" /> Cooking Duration
              </label>
              <select
                className="form-select form-select-lg"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1 hour 30 minutes</option>
                <option value="120">2 hours</option>
                <option value="150">2 hours 30 minutes</option>
                <option value="180">3 hours</option>
                <option value="240">4 hours</option>
                <option value="300">5+ hours</option>
              </select>
            </div>

            {/* Recipe Instructions */}
            <div className="mb-4">
              <label htmlFor="instructions" className="form-label fw-bold fs-5">
                <FaFileAlt className="me-1" /> Recipe Instructions <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                id="instructions"
                name="instructions"
                rows="10"
                placeholder="Write your recipe instructions here...&#10;&#10;Example:&#10;1. Preheat oven to 350°F&#10;2. Mix dry ingredients in a large bowl&#10;3. Add eggs and butter..."
                value={formData.instructions}
                onChange={handleInputChange}
                style={{ fontSize: '1rem', lineHeight: '1.6' }}
              ></textarea>
              {errors.instructions && (
                <div className="invalid-feedback d-block">
                  <i className="bi bi-exclamation-circle"></i> {errors.instructions}
                </div>
              )}
              <div className="form-text mt-2">
                <i className="bi bi-info-circle"></i> Be as detailed as possible. Include temperatures, times, and techniques.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 justify-content-end mt-4 pt-3 border-top">
              {onCancel && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={onCancel}
                >
                  <FaTimes className="me-1" /> Cancel
                </button>
              )}
              <button type="submit" className="btn btn-success btn-lg px-5 fw-bold">
                {mode === 'create' ? <><FaCheck className="me-1" /> Create Recipe</> : <><FaSave className="me-1" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default RecipeForm;