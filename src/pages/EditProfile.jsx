import { useContext, useEffect, useState } from 'react';

import { getAuth, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../navigation/firebase-config';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';


export default function EditProfile() {
    const [data, setData] = useState({
        displayName: "",
        profilePicture: "",
        id : "",
        bio: "",
        tracks: [],
        achievements: [],
        photos: [],
        location: "",
        tags: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const auth = getAuth();
    const user = auth.currentUser;
    
    useEffect(() => {
        console.log("CurrUser: ", user);
        const fetchUserData = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(docSnap.data());
                } else {
                    console.log("No such document!");
                }
                setIsLoading(false);
            }
        }
        fetchUserData();   
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                await setDoc(userDocRef, data, { merge: true });
                alert('Profile updated successfully!');
            } catch (error) {
                console.error("Error updating profile: ", error);
                alert('Error updating profile.');
            }
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <h1>Edit Profile</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="displayName">
                    <Form.Label column sm={2}>Display Name</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="displayName"
                            value={data.displayName}
                            onChange={handleChange}
                        />
                    </Col>  
                </Form.Group>

                <Form.Group as={Row} controlId="profilePicture">
                    <Form.Label column sm={2}>Profile Picture URL</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="profilePicture"
                            value={data.profilePicture}
                            onChange={handleChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="bio">
                    <Form.Label column sm={2}>Bio</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            as="textarea"
                            name="bio"
                            value={data.bio}
                            onChange={handleChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="location">
                    <Form.Label column sm={2}>Location</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="location"
                            value={data.location}
                            onChange={handleChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="tags">
                    <Form.Label column sm={2}>Tags</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="tags"
                            value={data.tags.join(', ')}
                            onChange={(e) => {
                                const tagsArray = e.target.value.split(',').map(tag => tag.trim());
                                setData(prevData => ({ ...prevData, tags: tagsArray }));
                            }}
                        />
                    </Col>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
}