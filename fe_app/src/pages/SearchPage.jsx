import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import WineCard from "../components/WineCard";

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [wines, setWines] = useState([]);

    useEffect(() => {
        const fetchWines = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/wines');
                setWines(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchWines();
    }, []);

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
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <Form.Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
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
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Ordina per...</option>
                        <option value="price_asc">Prezzo: dal più basso</option>
                        <option value="price_desc">Prezzo: dal più alto</option>
                        <option value="name_asc">Nome: A-Z</option>
                        <option value="name_desc">Nome: Z-A</option>
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
