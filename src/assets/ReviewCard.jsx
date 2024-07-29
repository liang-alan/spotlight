import { Row, Col, Container } from 'react-bootstrap';
import { auth, db } from '../navigation/firebase-config';
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingIcon from './LoadingIcon';

import { FaStar, FaRegStar } from "react-icons/fa";


import './styles.css';

export default function ReviewCard(props) {
    const [posterData, setPosterData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const getPosterInformation = async () => {
        const user = auth.currentUser;
        const docRef = doc(db, "users", props.user);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setPosterData(docSnap.data());
            // console.log(docSnap.data());
            setIsLoading(false);
        } else {
            console.log("No such document!");

        }
    }

    useEffect(() => {
        getPosterInformation();
    }, []);
    const formatDate = (dateString) => {
        let d = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        };

        return d.toLocaleString('en-US', options);
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} />);
            }  else {
                stars.push(<FaRegStar key={i} />);
            }
        }
        
        return stars;
    };

    const handleGetProfile = () => {
        navigate(`/profile/${props.user}`);
    }



    if (isLoading) {
        return <LoadingIcon />;
    }
    return (
        <Container className="review-card">
            <Row>
                <Col xs={12} md={12} className="text-start">
                    <p className="review-header">
                        <span className="clickable" onClick={handleGetProfile}>
                            <img src={posterData.profilePicture} alt="profile-picture" className="review-profile-picture" />
                            <span className="review-display-name">{posterData.displayName}</span>
                        </span>
                        
                        <span>{renderStars(props.rating)}</span>
                    </p>
                </Col>
                <Col xs={12} md={12} className="text-start review-metadata">
                    <p>{formatDate(props.time)}</p>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={12} className="text-start">
                    <p>{props.description}</p>
                    
                </Col>
            </Row>
        </Container>
    );
}

