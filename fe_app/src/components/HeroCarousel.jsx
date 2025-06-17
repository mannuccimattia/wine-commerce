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
                        <h3>Boolze: where wine journey beigns.</h3>
                        <p>Between sun-kissed rows and selected grapes, our passion is born. Boolze starts from the earth, from tradition, to bring you authentic, carefully chosen wines straight to your door.</p>
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
                        <h3>Every bottle has a story. We tell it to you.</h3>
                        <p>Our wineries guard time, knowledge and identity. On Boolze you find wines that speak of real territories, with the scent of wood and the magic of waiting.</p>
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
                        <h3>The moment is now. Wine, on Boolze.</h3>
                        <p>Red or white? Straight or sparkling? Whatever your taste, you'll find the perfect goblet for every occasion at Boolze. Because choosing a wine should be simple. And special.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
};

export default HeroCarousel;