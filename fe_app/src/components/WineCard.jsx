import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import WineGlasses from './WineGlasses';

const WineCard = ({ wine }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/wine/${wine.id}`);
    };

    return (
        <Card className="h-100 wine-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <Card.Img
                variant="top"
                src={wine.image_front_url}
                alt={wine.name}
                style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="text-white">{wine.name}</Card.Title>
                <Card.Text className="text-white-50">
                    {wine.description}
                </Card.Text>
                <div className="mb-2">
                    <WineGlasses condition={wine.condition || "Good"} />
                </div>
                <div className="mt-auto">
                    <p className="text-white mb-2">€ {wine.price}</p>
                </div>
            </Card.Body>
        </Card>
    );
};

export default WineCard;

