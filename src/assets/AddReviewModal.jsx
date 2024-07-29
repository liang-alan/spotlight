import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { db, auth } from '../navigation/firebase-config';
import { collection, addDoc } from 'firebase/firestore';

export default function AddReviewModal(props) {
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const user = auth.currentUser;


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            // if description is longer than 650 char
            if (description.length > 650) {
                alert('Description is too long');
                return;
            }
            

            const reviewData = {
                rating,
                description,
                time: new Date().toISOString(),
                user: user.uid
            };

          
            const reviewsCollectionRef = collection(db, "users", props.pageid, "reviews");
            await addDoc(reviewsCollectionRef, reviewData);
            props.onReviewAdded();

                  
            alert('Review added successfully!');
            props.handleClose();
        } catch (error) {
            console.error('Error adding review: ', error);
            console.log(props);
            alert('Failed to add review.');
        }
    };

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control type="number" min="0" max="5" value={rating} onChange={(
                            e) => setRating(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />   
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
                    
}