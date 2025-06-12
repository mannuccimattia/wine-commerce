import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import GlobalContext from '../contexts/globalContext';
import WineGlasses from '../components/WineGlasses';

const Winepage = () => {
    const { id } = useParams();
    const [wines, setWines] = useState({});
    const { setIsLoading } = useContext(GlobalContext);

    const fetchWine = () => {
        setIsLoading(true);
        axios.get(`http://127.0.0.1:3000/api/wines/${id}`, { timeout: 2000 })
            .then((response) => {
                console.log(response.data);
                setWines(response.data);
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
                    <img src={wines.image} className="img-fluid rounded shadow" alt={wines.name} />
                </div>
                <div className="col-12 col-md-6 col-lg-8">
                    <h1 className="mb-2">{wines.name}</h1>
                    <h5 className="text-muted">Categoria: {wines.category}</h5>
                    <WineGlasses
                        condition={wines.bottle_condition || 0}
                    />

                    <h5 className='mt-3'>Produttore:{wines.winesmaker}</h5>
                    <h5 className="mt-3">Anno: {wines.price}</h5>
                    <p className="mt-3">{wines.description}</p>
                </div>
            </div>

            <div className="row gy-4">
                <div className="col-12">
                    <h3 className="mb-3">Recensioni della community</h3>
                </div>

                {wines.reviews && wines.reviews.length > 0 ? (
                    wines.reviews.map((review) => (
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
                    <ReviewForm wine_id={wines.id} reloadReviews={fetchWine} />
                </div>
            </div>
        </div>
    );
};

export default Winepage;
