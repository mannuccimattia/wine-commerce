import React from 'react';
import { Carousel, Container } from 'react-bootstrap';

const HeroCarousel = () => {
    return (
        <Container fluid className="px-0" style={{ maxWidth: '1300px', margin: '0 auto' }}>
            <Carousel fade>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/imgs/carousel/Wine-hero-1.png"
                        alt="First slide"
                        style={{
                            height: '80vh',
                            objectFit: 'cover'
                        }}
                    />
                    <Carousel.Caption>
                        <h3>Boolze: dove inizia il viaggio del vino</h3>
                        <p>Tra filari baciati dal sole e uve selezionate nasce la nostra passione. Boolze parte dalla terra, dalla tradizione, per portarti vini autentici, scelti con cura, direttamente a casa tua.</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/imgs/carousel/Wine-hero-2.png"
                        alt="Second slide"
                        style={{
                            height: '80vh',
                            objectFit: 'cover'
                        }}
                    />
                    <Carousel.Caption>
                        <h3>Ogni bottiglia ha una storia. Noi te la raccontiamo.</h3>
                        <p>Le nostre cantine custodiscono tempo, sapere e identità. Su Boolze trovi vini che parlano di territori veri, con il profumo del legno e la magia dell’attesa.</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/imgs/carousel/Wine-hero-3.png"
                        alt="Third slide"
                        style={{
                            height: '80vh',
                            objectFit: 'cover'
                        }}
                    />
                    <Carousel.Caption>
                        <h3>Il momento è ora. Il vino, su Boolze.</h3>
                        <p>Rosso o bianco? Liscio o frizzante? Qualunque sia il tuo gusto, su Boolze trovi il calice perfetto per ogni occasione. Perché scegliere un vino deve essere semplice. E speciale.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
};

export default HeroCarousel;