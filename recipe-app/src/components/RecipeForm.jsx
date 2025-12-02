import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPlusCircle, FaClock, FaFileAlt, FaCheck, FaSave, FaTimes, FaImage, FaTimesCircle } from 'react-icons/fa';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

function RecipeForm({ mode = 'create', initialData = null, onSubmit, onCancel }) {

  const [formData, setFormData] = useState({
    title: '',
    ingredients: [''],
    dietaryRestrictions: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
    },
    duration: '30',
    instructions: '',
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({
    title: '',
    ingredients: '',
    instructions: '',
  });

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
        },
        duration: initialData.duration || '30',
        instructions: initialData.instructions || '',
        imageUrl: initialData.imageUrl || '',
      });
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [mode, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, imageUrl: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: '' });
    setImagePreview(null);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });

    if (errors.ingredients) {
      setErrors({ ...errors, ingredients: '' });
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    });
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData({ ...formData, ingredients: newIngredients });
    }
  };

  const handleDietaryChange = (restriction) => {
    setFormData({
      ...formData,
      dietaryRestrictions: {
        ...formData.dietaryRestrictions,
        [restriction]: !formData.dietaryRestrictions[restriction],
      },
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    const filledIngredients = formData.ingredients.filter((ing) => ing.trim() !== '');
    if (filledIngredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
      isValid = false;
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Recipe instructions are required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {

      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter((ing) => ing.trim() !== ''),
      };

      onSubmit(cleanedData);

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
          imageUrl: '',
        });
        setImagePreview(null);
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

            <div className="mb-4">
              <label className="form-label fw-bold fs-5">
                <FaImage className="me-1" /> Recipe Image
              </label>
              <div className="card bg-light border">
                <div className="card-body">
                  {imagePreview ? (
                    <div className="position-relative">
                      <img 
                        src={imagePreview} 
                        alt="Recipe preview" 
                        className="img-fluid rounded mb-3"
                        style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                        onClick={handleRemoveImage}
                      >
                        <FaTimesCircle /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <FaImage size={50} className="text-muted mb-3" />
                      <p className="text-muted">No image added yet</p>
                    </div>
                  )}
                  
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label htmlFor="imageUpload" className="btn btn-outline-primary w-100">
                        <FaImage className="me-1" /> Upload Image
                      </label>
                      <input
                        type="file"
                        id="imageUpload"
                        className="d-none"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Or paste image URL..."
                        value={formData.imageUrl}
                        onChange={handleImageUrlChange}
                      />
                    </div>
                  </div>
                  <small className="text-muted d-block mt-2">
                    Upload an image (max 5MB) or paste an image URL
                  </small>
                </div>
              </div>
            </div>

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