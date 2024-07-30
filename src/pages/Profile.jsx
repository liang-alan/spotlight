import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from '../navigation/firebase-config';
import { Row, Col, Carousel, Button, Form} from 'react-bootstrap';
import { motion } from 'framer-motion';
 

import LoadingIcon from '../assets/LoadingIcon';
import Vinyl from '../assets/Vinyl';
import { FaMapPin, FaSpotify, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import '../assets/styles.css';
import defaultPFP from '../img/default-pfp.jpg';
import AddReviewModal from '../assets/AddReviewModal';
import ReviewCard from '../assets/ReviewCard';

export default function Profile() {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [firstAnimationComplete, setFirstAnimationComplete] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviews, setReviews] = useState([]);

    const navigate = useNavigate();

    const fetchData = async () => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setData(docSnap.data());

            const img = new Image();
            img.src = docSnap.data().profilePicture;
            img.onload = () => setIsImageLoaded(true);

            console.log(docSnap.data());

        } else {
            navigate('/404');
        }

        
        setIsLoading(false);
    };

    const fetchReviews = async () => {
        setIsLoading(true);
        const reviewRef = collection(db, "users", userId, "reviews");
        const reviewSnapshot = await getDocs(reviewRef);
        const reviewList = reviewSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(reviewList);
        setIsLoading(false);
    }


    useEffect(() => { //search user
        fetchData();
        fetchReviews();
    }, [userId]);

    if (isLoading || !isImageLoaded) {
        return <LoadingIcon />;
    }

    const handleChatRequest = () => {
        console.log('Chat request');
        navigate(`/chats/${userId}`);
    };
    const socialArray = data.socials ? Object.entries(data.socials).sort(([keyA], [keyB]) => {
        return keyA.localeCompare(keyB); 
    }) : [];
    const staggerDelay = 0.4; // for vinyl

    const handleClose = () => setShowReviewModal(false);

    const handleReviewAdded = () => {
        // console.log('Review added');
        fetchReviews();
        setShowReviewModal(false);
    }

    return <div>
        <h1 className="mb-5">{data.displayName}</h1>
        <motion.div
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1 , ease: 'easeOut' }}
            onAnimationComplete={() => setFirstAnimationComplete(true)}

        >
            <Row className="profile-row">
                <Col xs={12} lg={3} style={{ position: 'relative' }}>
                    <img src={data.profilePicture} alt="Profile Picture" className="profile-picture-square" />
                </Col>
                
                <Col xs={12} lg={9} className="text-start">
                    <Row>
                        {data.tracks.map((track, index) => (
                            <Col xs={4} key={index} style={{ position: 'relative' }}>
                                <motion.div
                                    initial={{ opacity: 0, x: -250, scale:0.6 }} // Initial state: hidden and shifted left
                                    animate={{
                                        opacity: firstAnimationComplete ? 1 : 0,
                                        x: firstAnimationComplete ? 0 : -250,
                                        scale: firstAnimationComplete ? 1 : 0.5
                                    }} // Final state: fully visible and in place
                                    transition={{
                                        delay: index * staggerDelay , // Stagger animation
                                        duration: 0.6, // Animation duration
                                        ease: 'easeOut'
                                    }}
                                >
                                    <Vinyl track={track} name={data.trackNames[index]} />
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            <Row className="profile-row">
                <Col xs={12} lg={3} className="profile-column-spacing">{
                    data.location ? <p> <FaMapPin /> {data.location}</p> : null
                }
                    {
                        data.tags ? <p>Tags: {data.tags.join(', ')}</p> : null
                    }
                    <Row>
                        {
                            socialArray.map(([key, value]) => {
                                if (!value) {
                                    return null;
                                }
                                return <Col key={key} xs={6} className="text-start">
                                    <a href={value} target="_blank" rel="noreferrer">{
                                        key === 'spotify' ? <FaSpotify className="profile-social-icon"/> :
                                            key === 'instagram' ? <FaInstagram className="profile-social-icon" /> :
                                                key === 'facebook' ? <FaFacebook className="profile-social-icon" /> :
                                                    key === 'youtube' ? <FaYoutube className = "profile-social-icon"/> : null
                                    }</a>
                                </Col>;
                            })
                        }
                    </Row>

                    {
                        // dont display chat button if this is your profile
                        auth.currentUser.uid === userId ? null : <Row>
                            <Button variant="primary" onClick={handleChatRequest}>Chat</Button>
                        </Row>
                    }
                    
                </Col>
                <Col xs={12} lg={9} className="text-start profile-column-spacing">
                    <h2>About {`${data.displayName}`}</h2>
                    <p>{data.bio}</p>
                </Col>
            </Row>
            <Row className="profile-row">
                <Carousel className="profile-carousel">
                    {data.photos.map((photo, index) => (
                        <Carousel.Item key={index} className="profile-carousel-image">
                            <img
                                className="d-block w-100"
                                src={photo}
                                alt={`Slide ${index}`}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
                
            </Row>
            {data.video &&
                <Row className="profile-row">
                    <div>
                        <h2>Highlighted Video</h2>
                        <iframe
                            src={"https://www.youtube.com/embed/" + data.video.split('watch?v=')[1]}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="YouTube video player"
                            className="profile-video"
                        ></iframe>
                    </div>
                </Row>}
            
            <Row className="profile-row">
                <AddReviewModal show={showReviewModal} handleClose={handleClose} pageid={userId} onReviewAdded={handleReviewAdded} />
                <h2>Reviews</h2>
                <Button className="my-5" onClick={() => setShowReviewModal(true)}>Leave a Review</Button>
                {reviews && <div>
                    {reviews.map((review, index) => (
                        <ReviewCard
                            key={index}
                            {...review}
                        />
                    ))}

                </div>
                }
                {!reviews && <p className="text-start">Be the first to leave a review!</p>}  
                
                

            </Row>
            
            

        </motion.div>
    </div>;
}