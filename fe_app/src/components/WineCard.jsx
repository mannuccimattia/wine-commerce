import React from 'react';
import { Link } from 'react-router-dom';
import Stars from './Stars';

const WineCard = ({ wine }) => {
    const { id, name, category, price, image, average_vote } = wine;

    return (
        <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
                <img src={image} className="card-img-top img-fluid" alt={name} />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary">{name}</h5>
                    <Stars vote={average_vote || 0} />
                    <h6 className="card-subtitle mb-2 text-muted fst-italic">{category}</h6>
                    <p className="card-text flex-grow-1">{price}</p>
                    <Link to={`/wines/${id}`} className="btn btn-primary mt-auto">
                        Leggi tutto
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WineCard;

