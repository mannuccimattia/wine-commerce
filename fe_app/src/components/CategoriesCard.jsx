// Importazione delle dipendenze necessarie
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';  // Componenti Bootstrap per il layout
import { useNavigate } from 'react-router-dom';    // Hook per la navigazione

const CategoriesCard = () => {
    const navigate = useNavigate();

    // Array delle categorie con relative informazioni
    const categories = [
        {
            id: 1,                                     // ID univoco della categoria
            name: 'Red Wines',                       // Nome visualizzato
            image: '/imgs/categories/Red-Wine.jpg',    // Percorso immagine
            description: 'Discover our premium red wines cellar selection',
            link: '/categoria/1'                       // Link alla pagina della categoria
        },
        {
            id: 2,
            name: 'White Wines',
            image: '/imgs/categories/White-wine.jpg',
            description: 'Explore our tasty white wines collection',
            link: '/categoria/2'
        },
        {
            id: 3,
            name: 'Spumanti',
            image: '/imgs/categories/Spumante.jpg',
            description: 'Elevate every occasion with the best italian sparkles',
            link: '/categoria/3'
        },
        {
            id: 4,
            name: 'Champagne',
            image: '/imgs/categories/Champagne.jpg',
            description: 'Premium Champagnes, crafted for excellence',
            link: '/categoria/4'
        }
    ];

    return (
        // Contenitore principale con margini verticali
        <div className="container my-5">
            {/* Titolo della sezione categorie */}
            <h2 className="text-center mb-4 text-white">Our Collections</h2>

            {/* Grid system di Bootstrap per layout responsive */}
            <Row>
                {/* Mapping dell'array delle categorie per creare le card */}
                {categories.map((category) => (
                    // Colonna per ogni categoria - occupa 3 colonne su 12 in viewport md e superiori
                    <Col key={category.id} sm={12} md={6} lg={3} className="mb-4">
                        {/* Card cliccabile con effetto hover */}
                        <Card
                            className="h-100 shadow-sm hover-effect"
                            onClick={() => navigate(category.link)}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Immagine della categoria */}
                            <Card.Img
                                variant="top"
                                src={category.image}
                                alt={category.name}
                                style={{
                                    height: '200px',
                                    objectFit: 'cover'  // Mantiene le proporzioni dell'immagine
                                }}
                            />
                            {/* Corpo della card con titolo e descrizione */}
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="text-center">{category.name}</Card.Title>
                                <Card.Text className="text-center">{category.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CategoriesCard;
