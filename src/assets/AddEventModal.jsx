import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { db, storage } from '../navigation/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';



export default function AddEventModal(props) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        

        try {
            // Upload image to Firebase Storage
            if (image !== null) {
                const imageRef = ref(storage, `events/${image.name}`);
                await uploadBytes(imageRef, image);
                setImageUrl(await getDownloadURL(imageRef));
            }

            // if description is longer than 650 char
            if (description.length > 650) {
                alert('Description is too long');
                return;
            }
            

            const eventData = {
                title,
                date,
                time,
                location,
                description,
                image: imageUrl === undefined ? null : imageUrl,
                user: props.uid
            };

            // Store event data in Firestore with an auto-generated ID
            const eventCollectionRef = collection(db, 'events');
            await addDoc(eventCollectionRef, eventData);

            alert('Event added successfully!');
            props.handleClose();
        } catch (error) {
            console.error('Error adding event: ', error);
            console.log(props);
            alert('Failed to add event.');
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <Modal show={props.show} onHide={props.handleClose}>
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
