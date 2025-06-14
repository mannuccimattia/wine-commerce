import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import WineCard from '../components/WineCard'
import GlobalContext from '../contexts/globalContext'

const Homepage = () => {
    const [wines, setWines] = useState([]);
    const { setIsLoading } = useContext(GlobalContext);

    const fetchWines = () => {
        setIsLoading(true);
        axios.get('http://localhost:3000/api/wines', { timeout: 20000 })
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
        fetchWines();
    }, []);

    return (
        <>
            <div className="homepage-background">
                <h1 className="text-primary mb-3">Bool Wines</h1>
                <h2 className="mb-4 fst-italic">The Best Homewine only for you</h2>
                <div className="row gy-4">
                    {wines.map((wine) => (
                        <WineCard wine={wine} key={`wine-${wine.id}`} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Homepage;

