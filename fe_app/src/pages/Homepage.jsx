// import axios from 'axios'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../contexts/globalContext'
import CategoriesCard from '../components/CategoriesCard'
import HeroCarousel from '../components/HeroCarousel';
import BestSellers from '../components/BestSellers';

const Homepage = () => {

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

