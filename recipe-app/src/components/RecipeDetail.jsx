import React, { useState } from 'react';
import Navbar from './Navbar';
import ConfirmModal from './ConfirmModal';
import { FaClock, FaLeaf, FaHeart, FaRegHeart, FaEdit, FaArrowLeft, FaTrash } from 'react-icons/fa';

function RecipeDetail({ recipe, onBack, onEdit, onDelete, isFavorite, onToggleFavorite, showActions = true, showDietaryTags = true, showEditDelete = true }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(recipe._id);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete(recipe._id);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const activeDietaryRestrictions = recipe.dietaryRestrictions
    ? Object.keys(recipe.dietaryRestrictions).filter(
        (key) => recipe.dietaryRestrictions[key] === true
      )
    : [];

  const formatRestriction = (restriction) => {
    return restriction
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <>
      <Navbar onAddRecipeClick={onBack} />
      <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container py-4">
          
          <button className="btn btn-outline-primary mb-4" onClick={onBack}>
            <FaArrowLeft className="me-2" /> Back to Recipes
          </button>

          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card shadow-lg border-0" style={{ position: 'relative' }}>
                
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="card-img-top"
                    style={{
                      height: '400px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    className="card-img-top bg-gradient"
                    style={{
                      height: '400px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '5rem',
                    }}
                  >
                    🍳
                  </div>
                )}

                <div className="card-body p-4">
                  
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h1 className="card-title fw-bold mb-0">{recipe.title}</h1>
                    {showActions && (
                      <div className="d-flex gap-2">
                        {onToggleFavorite && (
                          <button
                            className="btn btn-outline-danger"
                            onClick={handleToggleFavorite}
                            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {isFavorite ? <FaHeart /> : <FaRegHeart />}
                          </button>
                        )}
                        {showEditDelete && (
                          <>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => onEdit(recipe)}
                              title="Edit recipe"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={handleDeleteClick}
                              title="Delete recipe"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="badge bg-primary fs-6 px-3 py-2">
                      <FaClock className="me-2" />
                      {recipe.duration} minutes
                    </span>
                  </div>

                  {showDietaryTags && activeDietaryRestrictions.length > 0 && (
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3">Dietary Information</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {activeDietaryRestrictions.map((restriction) => (
                          <span
                            key={restriction}
                            className="badge bg-success bg-opacity-10 text-success border border-success fs-6 px-3 py-2"
                          >
                            <FaLeaf className="me-2" />
                            {formatRestriction(restriction)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">Ingredients</h5>
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <ul className="mb-0">
                          {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="mb-2 fs-6">
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">Instructions</h5>
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <p className="mb-0 fs-6" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                          {recipe.instructions}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-top pt-3 mt-4">
                    <small className="text-muted">
                      Added on {new Date(recipe.createdAt).toLocaleDateString()}
                      {recipe.updatedAt && recipe.updatedAt !== recipe.createdAt && (
                        <> • Last updated {new Date(recipe.updatedAt).toLocaleDateString()}</>
                      )}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export default RecipeDetail;
