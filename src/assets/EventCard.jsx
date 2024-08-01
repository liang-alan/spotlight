import './styles.css'

import { Row, Col, Container } from 'react-bootstrap';
import {useState, useEffect} from 'react';
import { db } from '../navigation/firebase-config';
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import LoadingIcon from './LoadingIcon';

import { FaMapPin, FaCalendar } from "react-icons/fa";

import LogoSquare from '../img/logo-square.png';


export default function EventCard(props) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const navigate = useNavigate();
    function convertTime(time) {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        // Determine AM/PM suffix
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12;

        return `${hours}:${minutes} ${ampm}`;
    }

    useEffect(() => { //search user
        const fetchData = async () => {
            const docRef = doc(db, "users", props.user);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data());
            } 
            setIsLoading(false);
        };
        fetchData();

    }, []);

    useEffect(() => {
        //preload pfp
        const img = new Image();
        img.src = LogoSquare;


        if (props.image) {
            img.src = props.image;
        } 
        img.onload = () => setIsImageLoaded(true);

    }, [props.image]);
    
    const handleGetProfile = () => {
        navigate(`/profile/${props.user}`);
    }

    return <div>
        {(data && isImageLoaded) && (
            <Row className="event-card">
                <Col xs={12} md={4}>
                    <img src={props.image || LogoSquare} alt="Event" className="event-image img-fluid" />
                </Col>
                 <Col xs={12} md={8}>
            <h3 className="text-start">{props.title}</h3>
            <Row className="my-2 align-items-start">
                <Col xs={4} className="text-start clickable" onClick={handleGetProfile}>
                    <Row className="align-items-start">
                        <Col xs={2} className="p-0">
                            <img src={data.profilePicture} alt="Profile" className="profile-picture-small" />
                        </Col>
                        <Col xs={10}>
                            <p>{data.displayName}</p>
                        </Col>
                    </Row>
                </Col>
                <Col xs={4} className="text-start">
                    <p><FaCalendar /> {convertTime(props.time)}, {props.date}</p>
                </Col>
                <Col xs={4} className="text-start">
                    <p><FaMapPin /> {props.location}</p>
                </Col>
            </Row>
            <p className="text-start">{props.description}</p>
        </Col>
            </Row>
        )}
        {(!data || !isImageLoaded) && <LoadingIcon />}
    </div>
        
   ;
}