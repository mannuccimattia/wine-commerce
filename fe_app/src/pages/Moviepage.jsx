import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import Stars from '../components/Stars';
import ReviewForm from '../components/ReviewForm';
import GlobalContext from '../contexts/globalContext';

const Moviepage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState({});
    const { setIsLoading } = useContext(GlobalContext)

    const fetchMovie = () => {
        setIsLoading(true)
        axios.get(`http://127.0.0.1:3000/movies/${id}`)
            .then((response) => {
                console.log(response.data);
                setMovie(response.data);
                setIsLoading(false)
            }, 2000)
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchMovie();
    }, []);

    return (
        <div className="container py-4">
            <div className="row mb-4">
                <div className="col-12 col-md-6 col-lg-4 mb-3">
                    <img src={movie.image} className="img-fluid rounded shadow" alt={movie.title} />
                </div>
                <div className="col-12 col-md-6 col-lg-8">
                    <h1 className="mb-2">{movie.title}</h1>
                    <h5 className="text-muted">Regia: {movie.director}</h5>
                    <Stars vote={movie.average_vote || 0} />
                    <h6 className="mt-3">Anno: {movie.release_year}</h6>
                    <p className="mt-3">{movie.description}</p>
                </div>
            </div>

            <div className="row gy-4">
                <div className="col-12">
                    <h3 className="mb-3">Recensioni della community</h3>
                </div>

                {movie.reviews && movie.reviews.length > 0 ? (
                    movie.reviews.map((review) => (
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
                    <ReviewForm movie_id={movie.id} reloadReviews={fetchMovie} />
                </div>
            </div>
        </div>
    );
};

export default Moviepage;
