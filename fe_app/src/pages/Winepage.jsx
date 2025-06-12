import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import Stars from '../components/Stars';
import ReviewForm from '../components/ReviewForm';
import GlobalContext from '../contexts/globalContext';

const Winepage = () => {
    const { id } = useParams();
    const [wine, setWine] = useState({});
    const { setIsLoading } = useContext(GlobalContext);

    const fetchWine = () => {
        setIsLoading(true);
        axios.get(`http://127.0.0.1:3000/wines/${id}`, { timeout: 2000 })
            .then((response) => {
                console.log(response.data);
                setWine(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchWine();
    }, []);

    return (
        <div className="container py-4">
            <div className="row mb-4">
                <div className="col-12 col-md-6 col-lg-4 mb-3">
                    <img src={wine.image} className="img-fluid rounded shadow" alt={wine.title} />
                </div>
                <div className="col-12 col-md-6 col-lg-8">
                    <h1 className="mb-2">{wine.title}</h1>
                    <h5 className="text-muted">Cantina: {wine.director}</h5>
                    <Stars vote={wine.average_vote || 0} />
                    <h6 className="mt-3">Anno: {wine.release_year}</h6>
                    <p className="mt-3">{wine.description}</p>
                </div>
            </div>

            <div className="row gy-4">
                <div className="col-12">
                    <h3 className="mb-3">Recensioni della community</h3>
                </div>

                {wine.reviews && wine.reviews.length > 0 ? (
                    wine.reviews.map((review) => (
                        <div className="col-12" key={`review-${review.id}`}>
                            <ReviewCard review={review} />
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-muted">Nessuna recensione ancora.</p>
                    </div>
                )}

                <div className="col-12">
                    <ReviewForm wine_id={wine.id} reloadReviews={fetchWine} />
                </div>
            </div>
        </div>
    );
};

export default Winepage;
