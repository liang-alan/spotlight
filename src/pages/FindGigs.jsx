import EventCard from "../assets/EventCard";
import AddEventModal from "../assets/AddEventModal";

import { useState, useEffect} from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";


import { collection, getDocs ,query, orderBy, where, limit, startAfter,and, or } from "firebase/firestore";

import { db, auth } from '../navigation/firebase-config';

import LoadingIcon from "../assets/LoadingIcon";

import { motion } from 'framer-motion';
import { Form, Row, Col } from "react-bootstrap";
import '../assets/styles.css';


export default function FindGigs() {
    

    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [searchParam, setSearchParam] = useState('');
    const [sortOrder, setSortOrder] = useState('date'); // Default sort order


    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const user = auth.currentUser;

    const fetchEvents = async (next = false) => {
        try {
            const eventCollectionRef = collection(db, 'events');
            let eventQuery;
            setSearchParam(searchParam.trim().toLowerCase());
            if (searchParam) { // TRYING TO QUERY MULTIPLE THINGS
                alert('Searching for: ' + searchParam);
                setIsLoading(true);

                if (next && lastDoc) {
                    eventQuery = query(
                        eventCollectionRef,
                        or(
                            and(where('title_lowercase', '>=', searchParam),
                                where('title_lowercase', '<=', searchParam + '\uf8ff')),
                            and(where('description_lowercase', '>=', searchParam),
                                where('description_lowercase', '<=', searchParam + '\uf8ff'))
                        ),
                        limit(10),
                        orderBy(sortOrder),
                        startAfter(lastDoc)
                    );
                } else {
                    eventQuery = query(
                        eventCollectionRef,
                        or(
                            and(where('title_lowercase', '>=', searchParam),
                                where('title_lowercase', '<=', searchParam + '\uf8ff')),
                            and(where('description_lowercase', '>=', searchParam),
                                where('description_lowercase', '<=', searchParam + '\uf8ff'))
                            
                        ),
                        limit(10),
                        orderBy(sortOrder)
                    );
                }

            } else {
                if (next && lastDoc) {
                    eventQuery = query(eventCollectionRef, orderBy(sortOrder), startAfter(lastDoc), limit(10));
                } else {
                    setIsLoading(true);
                    eventQuery = query(eventCollectionRef, orderBy(sortOrder), limit(10));
                }


            }

            
            const eventSnapshot = await getDocs(eventQuery);
            const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (eventSnapshot.docs.length < 10) {
                setHasMore(false);
            }

            setEvents(prevEvents => next ? [...prevEvents, ...eventList] : eventList);
            setLastDoc(eventSnapshot.docs[eventSnapshot.docs.length - 1]);
        } catch (error) {
            console.error("Error fetching events: ", error);
        }
        setIsLoading(false);

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

    const submitQuery = (e) => {
        e.preventDefault();
        console.log('Search Param:', searchParam.trim().toLowerCase());
        fetchEvents();
    }

    const handleSortChange = (order) => {
        setSortOrder(order);
    };


    return <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}

        >
        <h1>Find Events</h1>
        <AddEventModal show={showModal} handleClose={handleClose} uid={user.uid} refreshEvents={refreshEvents} />
        <div className="events-container">
            <Form onSubmit={submitQuery}>
                <Form.Group as={Row} className="mb-3" controlId="query">
                    <Col className="mb-3 d-flex">
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={searchParam}
                            onChange = {(e) => setSearchParam(e.target.value)

                            } />
                        <Button variant="primary" type="submit">
                            Search
                        </Button>
                        <DropdownButton
                            id="dropdown-basic-button"
                            title="Sort By"
                            onSelect={handleSortChange}
                            className="ms-2"
                        >
                            <Dropdown.Item eventKey="date">Date</Dropdown.Item>
                            <Dropdown.Item eventKey="location">Location</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    
                </Form.Group>
            </Form>

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