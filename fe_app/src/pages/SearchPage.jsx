import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import WineCard from "../components/WineCard";
import { SearchContext } from '../contexts/SearchContext';

const SearchPage = () => {
    const { searchState, setSearchState } = useContext(SearchContext);
    const { searchTerm, categoryFilter, sortBy, wines } = searchState;

    useEffect(() => {
        const fetchWines = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/wines');
                setSearchState(prev => ({ ...prev, wines: response.data }));
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (wines.length === 0) {
            fetchWines();
        }
    }, []);

    const handleSearchChange = (e) => {
        setSearchState(prev => ({ ...prev, searchTerm: e.target.value }));
    };

    const handleCategoryChange = (e) => {
        setSearchState(prev => ({ ...prev, categoryFilter: e.target.value }));
    };

    const handleSortChange = (e) => {
        setSearchState(prev => ({ ...prev, sortBy: e.target.value }));
    };

    const filteredWines = wines.filter(wine => {
        const matchesSearch = wine.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || wine.category == categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const sortedWines = [...filteredWines].sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
        if (sortBy === 'year_desc') return b.vintage - a.vintage; // Più recenti prima
        if (sortBy === 'year_asc') return a.vintage - b.vintage;  // Più vecchi prima
        return 0;
    });

    return (
        <Container className="py-4">
            <h1 className="text-white mb-4">Cerca un vino</h1>

            <Row className="mb-4">
                <div className="col-md-4 mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Cerca per nome..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <Form.Select
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Categoria</option>
                        <option value="1">Vini Rossi</option>
                        <option value="2">Vini Bianchi</option>
                        <option value="3">Spumanti</option>
                        <option value="4">Champagne</option>
                    </Form.Select>
                </div>
                <div className="col-md-4 mb-3">
                    <Form.Select
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="">Ordina per...</option>
                        <option value="price_asc">Prezzo: dal più basso</option>
                        <option value="price_desc">Prezzo: dal più alto</option>
                        <option value="name_asc">Nome: A-Z</option>
                        <option value="name_desc">Nome: Z-A</option>
                        <option value="year_desc">Recenti</option>
                    </Form.Select>
                </div>
            </Row>

            <Row className="g-4">
                {sortedWines.map((wine) => (
                    <Col key={wine.id} xs={12} sm={6} md={4} lg={3}>
                        <WineCard wine={wine} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SearchPage;
