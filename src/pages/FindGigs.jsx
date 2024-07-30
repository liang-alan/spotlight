import EventCard from "../assets/EventCard";
import AddEventModal from "../assets/AddEventModal";

import { useState, useEffect} from "react";
import { Button } from "react-bootstrap";


import { collection, getDocs ,query, limit, startAfter } from "firebase/firestore";

import { db, auth } from '../navigation/firebase-config';

import LoadingIcon from "../assets/LoadingIcon";

import { motion } from 'framer-motion';
import '../assets/styles.css';


export default function FindGigs() {
    

    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const user = auth.currentUser;

    const fetchEvents = async (next = false) => {
        try {
            const eventCollectionRef = collection(db, 'events');
            let eventQuery;

            if (next && lastDoc) {
                eventQuery = query(eventCollectionRef, startAfter(lastDoc), limit(10)); 
            } else {
                setIsLoading(true);
                eventQuery = query(eventCollectionRef, limit(10)); 
            }

            const eventSnapshot = await getDocs(eventQuery);
            const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (eventSnapshot.docs.length < 10) {
                setHasMore(false);
            }

            setEvents(prevEvents => next ? [...prevEvents, ...eventList] : eventList);
            setLastDoc(eventSnapshot.docs[eventSnapshot.docs.length - 1]);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching events: ", error);
            setIsLoading(false);
        }
    };
    const loadMore = () => {
        fetchEvents(true);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    if (isLoading) {
        return <LoadingIcon />;
    }

    const refreshEvents = () => {
        fetchEvents();
    }

    return <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}

        >
        <h1>Find Events</h1>
        <AddEventModal show={showModal} handleClose={handleClose} uid={user.uid} refreshEvents={refreshEvents} />
        <div className="events-container">
            <Button variant="primary" className="add-event-button" onClick={handleShow}>
                Create an Event
            </Button>
            {events.map(event => (
                <EventCard
                    key={event.id}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    description={event.description}
                    image={event.image}
                    user={event.user}
                />
            ))}
        </div>
        {hasMore && <Button onClick={loadMore}>Load More</Button>}

    </motion.div>;
}