import { Container, Col, Row } from 'react-bootstrap';

import './styles.css';

import defaultPicture from '../img/logo-square.png';
export default function AchievementCard(props) {

    const formatDate = (dateString) => {
        let d = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',

        };

        return d.toLocaleString('en-US', options);
    }

    return (
        <Container className="border achievement-container">
            <Row >
                <Col className="d-grid" xs={12} lg={3}>
                    <img src={
                        props.image ? props.image : defaultPicture
                    } alt="achievement" className="achievement-image" />
                </Col>
                <Col xs={12} lg={9} className="text-start">
                    <h3>{props.title}</h3>
                    <h4 className="review-metadata">{formatDate(props.date)}</h4>
                    <p>{props.description}</p>      
                </Col>
            </Row>
            
        </Container>
    );
}