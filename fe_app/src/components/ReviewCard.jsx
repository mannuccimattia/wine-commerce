import React from 'react';

const ReviewCard = ({ review }) => {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{review.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Voto: {review.vote}/5</h6>
                <p className="card-text">{review.text}</p>
            </div>
        </div>
    );
};

export default ReviewCard;

