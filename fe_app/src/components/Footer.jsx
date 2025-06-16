import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5 py-4">
            <Container>
                <Row className="justify-content-between align-items-center">
                    <Col md={4}>
                        <h5>Contatti</h5>
                        <p className="mb-1">Email: info@boolze.com</p>
                        <p className="mb-1">Tel: +39 02 1234567</p>
                        <p className="mb-1">P.IVA: 12345678901</p>
                    </Col>
                    <Col md={4} className="text-center">
                        <h5 className="mb-3">Boolze Commerce</h5>
                        <p className="small">
                            © {new Date().getFullYear()} Boolze Commerce.
                            <br />
                            Tutti i diritti riservati.
                        </p>
                    </Col>
                    <Col md={4} className="text-end">
                        <h5>Seguici sui social</h5>
                        <div className="d-flex gap-3 justify-content-end">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
                                <i className="fab fa-facebook fa-lg"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                                <i className="fab fa-instagram fa-lg"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
                                <i className="fab fa-twitter fa-lg"></i>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
