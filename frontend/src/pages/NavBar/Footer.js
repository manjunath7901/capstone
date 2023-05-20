import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-light fixed-bottom">
            <Container>
                <Row>
                    <Col className="text-center">
                        <p>&copy; 2023 Your Website. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
