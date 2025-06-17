import React, { useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Pulisci il carrello
        localStorage.removeItem('carrello');

        // Redirect automatico dopo 5 secondi
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Container className="py-5">
            <Card className="bg-dark text-white p-5 text-center">
                <i className="fas fa-check-circle text-success mb-4" style={{ fontSize: '4rem' }}></i>
                <h2 className="mb-4">Ordine Completato con Successo!</h2>
                <p className="mb-4">
                    Grazie per il tuo acquisto. Riceverai una email di conferma con i dettagli dell'ordine.
                </p>
                <p className="text-muted mb-4">
                    Verrai reindirizzato alla home page tra pochi secondi...
                </p>
                <Link to="/" className="btn btn-outline-light">
                    Torna alla Home
                </Link>
            </Card>
        </Container>
    );
};

export default SuccessPage;