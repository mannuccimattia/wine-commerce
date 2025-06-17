import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className="bg-dark text-white mt-5 py-4">
            <Container>
                <Row className="justify-content-between align-items-center text-center gy-3">
                    <Col sm={12} md={4} className="text-secondary">
                        <h5 className="mb-3">Boolze Commerce</h5>
                        <p className="mb-1">Email: info@boolze.com</p>
                        <p className="mb-1">Tel: +39 02 1234567</p>
                        <p className="mb-1">P.IVA: 12345678901</p>
                    </Col>
                    <Col sm={12} md={4} className="text-center">
                        <img
                            src="/imgs/logo/boolze-high-resolution-logo-grayscale-transparent-cut.png"
                            alt="logo-footer"
                            className="img-fluid"
                        />

                    </Col>
                    <Col sm={12} md={4} className="text-secondary">
                        <p className="small">
                            © 2025 Boolze Commerce.
                            <br />
                            All rights reserved
                        </p>
                        <h5>Follow us!</h5>
                        <div className="d-flex gap-3 justify-content-center">
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
