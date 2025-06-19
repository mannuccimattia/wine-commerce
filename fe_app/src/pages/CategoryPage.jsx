import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import WineCard from '../components/WineCard';
import GlobalContext from '../contexts/globalContext';

const CategoryPage = () => {
    const { id } = useParams();
    const [wines, setWines] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const { setIsLoading } = useContext(GlobalContext);

    useEffect(() => {
        setIsLoading(true);
        // Chiamata per ottenere i vini della categoria specifica
        axios.get(`http://localhost:3000/api/wines/category/${id}`)
            .then(response => {
                setWines(response.data);
                // Assumendo che il primo vino abbia il nome della categoria
                if (response.data.length > 0) {
                    setCategoryName(response.data[0].category_name);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error loading products:', error);
                setIsLoading(false);
            });
    }, [id]);

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">{categoryName || 'Categoria'}</h2>
            <div className="row gy-4">
                {wines.length > 0 ? (
                    wines.map(wine => (
                        <div key={wine.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <WineCard
                                wine={{
                                    ...wine,
                                    image_url: wine.image_front_url, // Adattato al tuo schema DB
                                    price: parseFloat(wine.price)
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center">No product found.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;