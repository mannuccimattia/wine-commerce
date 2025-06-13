import React, { useEffect, useState, useContext } from 'react'; // Hook di React
import axios from 'axios'; // Libreria per le chiamate HTTP
import WineCard from '../components/WineCard'; // Componente per visualizzare il singolo vino
import GlobalContext from '../contexts/globalContext'; // Context per lo stato globale

// Definizione del componente principale SearchPage
const SearchPage = () => {
    // Dichiarazione degli stati usando useState
    const [search, setSearch] = useState(''); // Stato per il testo di ricerca
    const [category, setCategory] = useState(''); // Stato per la categoria selezionata
    const [wines, setWines] = useState([]); // Array dei vini dal database
    const [sortBy, setSortBy] = useState(''); // Criterio di ordinamento selezionato
    const { setIsLoading } = useContext(GlobalContext); // Stato globale per il loading

    // Funzione per recuperare i vini dal server
    const fetchWines = () => {
        setIsLoading(true); // Attiva l'indicatore di caricamento
        axios.get('http://localhost:3000/api/wines')
            .then((res) => {
                setWines(res.data); // Salva i vini nello state
                setIsLoading(false); // Disattiva l'indicatore di caricamento
            })
            .catch(() => setIsLoading(false)); // Gestione degli errori
    };

    // Hook useEffect per caricare i vini al mount del componente
    useEffect(() => {
        fetchWines();
    }, []); // Array vuoto significa che viene eseguito solo al mount

    // Funzione per ordinare i vini in base al criterio selezionato
    const sortWines = (wines) => {
        if (!sortBy) return wines; // Se non c'è criterio, ritorna l'array originale

        return [...wines].sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': // Ordine crescente di prezzo
                    return a.price - b.price;
                case 'price-desc': // Ordine decrescente di prezzo
                    return b.price - a.price;
                case 'name-asc': // Ordine alfabetico A-Z
                    return a.name.localeCompare(b.name);
                case 'name-desc': // Ordine alfabetico Z-A
                    return b.name.localeCompare(a.name);
                case 'recent': // Dal più recente (anno del vino)
                    return b.vintage - a.vintage; // Assumendo che il campo si chiami 'year'
                default:
                    return 0;
            }
        });
    };

    // Filtra i vini in base al testo di ricerca e alla categoria
    const filteredWines = wines.filter((wine) =>
        wine.name.toLowerCase().includes(search.toLowerCase()) && // Filtra per nome
        (category ? wine.category === category : true) // Filtra per categoria se selezionata
    );

    // Applica l'ordinamento ai vini già filtrati
    const sortedAndFilteredWines = sortWines(filteredWines);

    // Estrae le categorie uniche per il menu a tendina
    const uniqueCategories = [...new Set(wines.map(w => w.category))];

    // Rendering del componente
    return (
        <div className="container">
            <h1 className="text-primary mb-3">Cerca un vino</h1>

            {/* Sezione dei filtri di ricerca */}
            <div className="mb-4 row">
                {/* Input per la ricerca testuale */}
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Cerca per nome..."
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* Select per il filtro delle categorie */}
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Categoria</option>
                        {uniqueCategories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                {/* Select per l'ordinamento */}
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Ordina per...</option>
                        <option value="price-asc">Prezzo: dal più basso</option>
                        <option value="price-desc">Prezzo: dal più alto</option>
                        <option value="name-asc">Nome: A-Z</option>
                        <option value="name-desc">Nome: Z-A</option>
                        <option value="recent">Più recenti</option>
                    </select>
                </div>
            </div>

            {/* Griglia dei risultati */}
            <div className="row gy-4">
                {sortedAndFilteredWines.length ? (
                    // Mappa i vini filtrati e ordinati in cards
                    sortedAndFilteredWines.map(wine => (
                        <WineCard key={`wine-${wine.id}`} wine={wine} />
                    ))
                ) : (
                    // Messaggio se non ci sono risultati
                    <p>Nessun vino trovato.</p>
                )}
            </div>
        </div>
    );
};

// Esporta il componente per l'uso in altre parti dell'applicazione
export default SearchPage;
