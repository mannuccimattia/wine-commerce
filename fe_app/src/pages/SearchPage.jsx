import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import WineCard from '../components/WineCard';
import GlobalContext from '../contexts/globalContext';

const SearchPage = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [wines, setWines] = useState([]);
    const { setIsLoading } = useContext(GlobalContext);

    const fetchWines = () => {
        setIsLoading(true);
        axios.get('http://localhost:3000/api/wines')
            .then((res) => {
                setWines(res.data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchWines();
    }, []);

    const filteredWines = wines.filter((wine) =>
        wine.name.toLowerCase().includes(search.toLowerCase()) &&
        (category ? wine.category === category : true)
    );

    const uniqueCategories = [...new Set(wines.map(w => w.category))];

    return (
        <div className="container">
            <h1 className="text-primary mb-3">Cerca un vino</h1>

            <div className="mb-4 row">
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="Cerca per nome..."
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Tutte le categorie</option>
                        {uniqueCategories.map((cat, i) => (
                            <option key={i} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row gy-4">
                {filteredWines.length ? (
                    filteredWines.map(wine => (
                        <WineCard key={`wine-${wine.id}`} wine={wine} />
                    ))
                ) : (
                    <p>Nessun vino trovato.</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
