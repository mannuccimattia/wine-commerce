import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Stars from '../components/Stars';
import GlobalContext from '../contexts/globalContext';

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
                    <Stars vote={wines.average_vote || 0} />
                    <h5 className='mt-3'>Produttore:{wines.winesmaker}</h5>
                    <h5 className="mt-3">Anno: {wines.price}</h5>
                    <p className="mt-3">{wines.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Winepage;
