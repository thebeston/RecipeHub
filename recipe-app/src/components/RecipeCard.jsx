import React from 'react';
import { FaClock, FaLeaf, FaHeart, FaRegHeart, FaEdit } from 'react-icons/fa';

function RecipeCard({ recipe, onEdit, isFavorite = false, onToggleFavorite }) {
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(recipe._id);
    }
  };

  // Get active dietary restrictions
  const activeDietaryRestrictions = recipe.dietaryRestrictions
    ? Object.keys(recipe.dietaryRestrictions).filter(
        (key) => recipe.dietaryRestrictions[key] === true
      )
    : [];

  // Format dietary restriction names
  const formatRestriction = (restriction) => {
    return restriction
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="card h-100 shadow-sm hover-shadow transition" style={{ cursor: 'pointer' }}>
      {/* Card Image Placeholder */}
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
        }}
      >
        🍳
      </div>

      {/* Card Body */}
      <div className="card-body d-flex flex-column">
        {/* Title */}
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

        {/* Duration */}
        <div className="mb-3">
          <span className="badge bg-primary">
            <FaClock className="me-1" />
            {recipe.duration} min
          </span>
        </div>

        {/* Dietary Restrictions */}
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

        {/* Ingredients Preview */}
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

        {/* Instructions Preview */}
        <p className="card-text text-muted small mb-3">
          {recipe.instructions.substring(0, 100)}
          {recipe.instructions.length > 100 && '...'}
        </p>

        {/* Action Buttons */}
        <div className="d-grid gap-2">
          <div className="btn-group" role="group">
            <button className="btn btn-primary">View Recipe</button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => onEdit(recipe)}
            >
              <FaEdit />
            </button>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer bg-transparent border-top-0">
        <small className="text-muted">
          Added {new Date(recipe.createdAt).toLocaleDateString()}
        </small>
      </div>

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
