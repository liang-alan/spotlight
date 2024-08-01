import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { db, storage } from '../navigation/firebase-config';
import { collection, addDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AddAchievementModal(props){
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {


            // if description is longer than 650 char
            if (description.length > 650) {
                alert('Description is too long');
                return;
            }
            // Upload image to Firebase Storage
            if (image !== null) {
                const imageRef = ref(storage, `media/${props.userId}/achievements/${image.name}`);
                await uploadBytes(imageRef, image);
                setImageUrl(await getDownloadURL(imageRef));
            } else {
                const achievementData = {
                    title,
                    date,
                    description,
                    image: imageUrl === undefined ? null : imageUrl,
                };





                props.handleSubmitAchievement(achievementData);
                // clera fields 
                setTitle('');
                setDate('');
                setDescription('');
                setImage(null);
                
            }

            
            
           
            

        } catch (error) {
            console.error('Error adding achievement: ', error);
            console.log(props);
            alert('Failed to add achievement.');
        }
    };

    useEffect(() => {
        if (imageUrl === null) {
            return;
        }
        const achievementData = {
            title,
            date,
            description,
            image: imageUrl === undefined ? null : imageUrl,
        };
        // clera fields 
        setTitle('');
        setDate('');
        setDescription('');
        setImage(null);


        props.handleSubmitAchievement(achievementData);
    }, [imageUrl]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Achievement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={title} onChange={(
                            e) => setTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" value={date} onChange={(
                            e) => setDate(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" value={description} onChange={(
                            e) => setDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                    </Form.Group>
                    
        
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )



};