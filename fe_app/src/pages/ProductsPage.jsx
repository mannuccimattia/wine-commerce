import { useEffect, useContext } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import WineCard from "../components/WineCard";
import { SearchContext } from '../contexts/SearchContext';
import Loader from "../components/Loader";

const ProductsPage = () => {
    const { searchState, setSearchState } = useContext(SearchContext);
    const { searchTerm, categoryFilter, sortBy, wines } = searchState;


    useEffect(() => {

        const fetchWines = async () => {
            const endpoint = "http://localhost:3000/api/wines"
            try {
                const response = await axios.get(endpoint);
                setSearchState(prev => ({ ...prev, wines: response.data }));
            } catch (error) {
                console.error('Error:', error);
            }
        };

        setTimeout(() => {
            fetchWines();
        }, 500);

        return () => {
            setSearchState(prev => ({
                ...prev,
                searchTerm: "",
                categoryFilter: "",
                sortBy: "",
                wines: []
            }));
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
        const matchesCategory = !categoryFilter || wine.category.id == Number(categoryFilter);
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
            <h1 className="text-white mb-4">Search</h1>

            <Row className="mb-4">
                <div className="col-md-4 mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <Form.Select
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Categorie</option>
                        <option value="1">Rossi</option>
                        <option value="2">Bianchi</option>
                        <option value="3">Spumanti</option>
                        <option value="4">Champagne</option>
                    </Form.Select>
                </div>
                <div className="col-md-4 mb-3">
                    <Form.Select
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="">Sort by</option>
                        <option value="price_asc">Price (asc)</option>
                        <option value="price_desc">Price (desc)</option>
                        <option value="name_asc">Name: A-Z</option>
                        <option value="name_desc">Name: Z-A</option>
                        <option value="year_desc">Most Recent</option>
                    </Form.Select>
                </div>
            </Row>
            {wines.length === 0 ? (
                <Loader />
            ) : (
                <Row className="g-4">
                    {sortedWines.map((wine) => (
                        <Col key={wine.id} xs={12} sm={6} md={4} lg={3}>
                            <WineCard wine={wine} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ProductsPage;
