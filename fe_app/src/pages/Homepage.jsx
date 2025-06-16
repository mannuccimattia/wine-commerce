import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import WineCard from '../components/WineCard'
import GlobalContext from '../contexts/globalContext'
import CategoriesCard from '../components/CategoriesCard'
import HeroCarousel from '../components/HeroCarousel';
import BestSellers from '../components/BestSellers';

const Homepage = () => {
    const [wines, setWines] = useState([]);
    const { setIsLoading } = useContext(GlobalContext);

    const fetchWines = () => {
        setIsLoading(true);
        axios.get('http://localhost:3000/api/wines', { timeout: 20000 })
            .then((response) => {
                setWines(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchWines();
    }, []);

    return (
        <>
            <HeroCarousel />
            <div className="homepage-background">
                <CategoriesCard />
                <BestSellers />
            </div>
        </>
    );
};

export default Homepage;

