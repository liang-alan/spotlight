import EventCard from "../assets/EventCard";
import AddEventModal from "../assets/AddEventModal";

import { useState, useEffect} from "react";
import { Button } from "react-bootstrap";


import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

import { db } from '../navigation/firebase-config';

import LoadingIcon from "../assets/LoadingIcon";


export default function FindGigs() {
    

    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventCollectionRef = collection(db, 'events');
                const eventSnapshot = await getDocs(eventCollectionRef);
                const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEvents(eventList);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching events: ", error);
            }
        };

        fetchEvents();
    }, []);

    if (isLoading) {
        return <LoadingIcon />;
    }

    return <div>
        <h1>Find Events</h1>
        <Button variant="primary" onClick={handleShow}>
            Add Event
        </Button>
        <AddEventModal show={showModal} handleClose={handleClose} uid={user.uid} />
        <div className="events-container">
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
    </div>;
}