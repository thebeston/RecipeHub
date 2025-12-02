import React, { useState } from 'react';
import { FaClock, FaLeaf, FaHeart, FaRegHeart, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import ConfirmModal from './ConfirmModal';

function RecipeCard({ recipe, onEdit, onDelete, onViewRecipe, isFavorite = false, onToggleFavorite }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(recipe._id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete(recipe._id);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(recipe);
  };

  const handleViewRecipe = () => {
    onViewRecipe(recipe);
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
    <div className="card h-100 shadow-sm hover-shadow transition" style={{ position: 'relative' }}>
      
      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="card-img-top"
          style={{
            height: '200px',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={handleViewRecipe}
        />
      ) : (
        <div
          className="card-img-top bg-gradient"
          style={{
            height: '200px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            cursor: 'pointer',
          }}
          onClick={handleViewRecipe}
        >
          🍳
        </div>
      )}

      <div className="card-body d-flex flex-column">
        
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold mb-0 flex-grow-1">{recipe.title}</h5>
          <button
            className="btn btn-link text-danger p-0 ms-2"
            onClick={handleToggleFavorite}
            style={{ fontSize: '1.5rem' }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="mb-3">
          <span className="badge bg-primary">
            <FaClock className="me-1" />
            {recipe.duration} min
          </span>
        </div>

        {activeDietaryRestrictions.length > 0 && (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-1">
              {activeDietaryRestrictions.slice(0, 3).map((restriction) => (
                <span
                  key={restriction}
                  className="badge bg-success bg-opacity-10 text-success border border-success"
                >
                  <FaLeaf className="me-1" size={10} />
                  {formatRestriction(restriction)}
                </span>
              ))}
              {activeDietaryRestrictions.length > 3 && (
                <span className="badge bg-secondary">
                  +{activeDietaryRestrictions.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mb-3 flex-grow-1">
          <h6 className="text-muted small mb-2">Ingredients:</h6>
          <ul className="small text-muted mb-0 ps-3">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
            {recipe.ingredients.length > 3 && (
              <li className="text-primary">+ {recipe.ingredients.length - 3} more...</li>
            )}
          </ul>
        </div>

        <div className="d-grid gap-2">
          <button className="btn btn-primary" onClick={handleViewRecipe}>
            <FaEye className="me-2" />
            View Recipe
          </button>
          <div className="btn-group" role="group">
            <button 
              className="btn btn-outline-primary"
              onClick={handleEdit}
              title="Edit recipe"
            >
              <FaEdit className="me-1" /> Edit
            </button>
            <button 
              className="btn btn-outline-danger"
              onClick={handleDeleteClick}
              title="Delete recipe"
            >
              <FaTrash className="me-1" /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="card-footer bg-transparent border-top-0">
        <small className="text-muted">
          Added {new Date(recipe.createdAt).toLocaleDateString()}
        </small>
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

      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default RecipeCard;
