import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { db, storage } from '../navigation/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import usePlacesAutocomplete from '../navigation/usePlacesAutocomplete';

const AddEventModal = (props) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [locationCoords, setLocationCoords] = useState([]);
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handlePlaceSelect = (place) => {
        console.log('Selected place:', place.formatted_address);
        setLocationCoords([place.geometry.location.lat(), place.geometry.location.lng()]);
        setLocation(place.formatted_address);
    };

    const inputRef = usePlacesAutocomplete(handlePlaceSelect);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (locationCoords.length === 0) {
            alert('Please select a location from the dropdown.');
            return;
        }
        try {
            if (image !== null) {
                const imageRef = ref(storage, `events/${image.name}`);
                await uploadBytes(imageRef, image);
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
            }

            if (description.length > 650) {
                alert('Description is too long');
                return;
            }

            const eventData = {
                title,
                date,
                time,
                location,
                locationCoords,
                description,
                image: imageUrl ? imageUrl : null,
                user: props.uid,
                title_lowercase: title.toLowerCase(), 
                description_lowercase: description.toLowerCase()
            };

            const eventCollectionRef = collection(db, 'events');
            await addDoc(eventCollectionRef, eventData);
            alert('Event added successfully!');
            props.handleClose();
            props.refreshEvents();
        } catch (error) {
            console.error('Error adding event: ', error);
            alert('Failed to add event.');
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <Modal show={props.show} onHide={props.handleClose} style={{ zIndex : 1050}}>
            <Modal.Header closeButton>
                <Modal.Title>Add Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter event title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Time</Form.Label>
                        <Form.Control
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter event location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            ref={inputRef}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter event description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Event
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default AddEventModal;
