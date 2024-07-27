import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuth, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { storage, ref, uploadBytes, getDownloadURL } from '../navigation/firebase-config'; // Adjust path as needed



import { db } from '../navigation/firebase-config';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

import LoadingIcon from '../assets/LoadingIcon';
import UploadMedia from '../assets/UploadMedia';
import ProfilePicture from '../assets/ProfilePicture';


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
        tags: [],
        socials: {
            instagram: "",
            youtube: "",
            facebook: "",
            spotify: ""
        },
        video : ""
    });

    const [isLoading, setIsLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadPhotoCount, setUploadPhotoCount] = useState(1); // Start with 1 upload component
    const [uploadAudioCount, setUploadAudioCount] = useState(1); // Number of upload components to show
    const [selectedAudioFiles, setSelectedAudioFiles] = useState([]); // Array of selected audio files
    const [profilePicture, setProfilePicture] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log("CurrUser: ", user);
        const fetchUserData = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(docSnap.data());
                    setUploadPhotoCount(docSnap.data().photos.length);
                    setUploadAudioCount(docSnap.data().tracks.length);
                    setSelectedAudioFiles(docSnap.data().tracks);
                    setSelectedFiles(docSnap.data().photos);
                    setProfilePicture(docSnap.data().profilePicture);
                    console.log("Document data:", docSnap.data());
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
                setIsLoading(true);
                const updatedData = { ...data };

                if (profilePicture instanceof File) {
                    const storageRef = ref(storage, `media/${user.uid}/profilePicture/${profilePicture.name}`);
                    await uploadBytes(storageRef, profilePicture);
                    const downloadURL = await getDownloadURL(storageRef);
                    updatedData.profilePicture = downloadURL;
                }

                for (let index = 0; index < selectedFiles.length; index++) {
                    const file = selectedFiles[index];

                    if (file instanceof File) {
                        console.log("File: ", file, "Index: ", index);
                        const storageRef = ref(storage, `media/${user.uid}/images/${file.name}`);
                        await uploadBytes(storageRef, file);
                        const downloadURL = await getDownloadURL(storageRef);
                        updatedData.photos[index] = downloadURL;
                    } else {
                        continue;
                    }
                }

                for (let index = 0; index < selectedAudioFiles.length; index++) {
                    const file = selectedAudioFiles[index];

                    if (file instanceof File) {
                        console.log("File: ", file, "Index: ", index);
                        const storageRef = ref(storage, `media/${user.uid}/audio/${file.name}`);
                        await uploadBytes(storageRef, file);
                        const downloadURL = await getDownloadURL(storageRef);
                        updatedData.tracks[index] = downloadURL;
                    } else {
                        continue;
                    }
                }

                console.log("Updated data: ", updatedData);
                const userDocRef = doc(db, "users", user.uid);
                await setDoc(userDocRef, updatedData, { merge: true });
                alert('Profile updated successfully!');
                navigate(`/profile/${user.uid}`);
            } catch (error) {
                console.error("Error updating profile: ", error);
                alert('Error updating profile.');
            } finally {
                setIsLoading(false);
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

    const handleFileSelect = (file, index) => {
        setSelectedFiles(prevFiles => {
            const updatedFiles = [...prevFiles];
            updatedFiles[index] = file;
            console.log(updatedFiles, "has been placed at index", index);
            return updatedFiles;
        });
    };
    const handleAudioFileSelect = (file, index) => {
        setSelectedAudioFiles(prevFiles => {
            const updatedFiles = [...prevFiles];
            updatedFiles[index] = file;
            return updatedFiles;
        });
    };

    const handleProfilePictureSelect = (file) => {
        setProfilePicture(file);
    };

    const handleAddPhotoUploadComponent = () => {
        setUploadPhotoCount(prevCount => prevCount + 1);
    };
    const handleAddAudioUploadComponent = () => {
        setUploadAudioCount(prevCount => prevCount + 1);
    };

    if (isLoading) {
        return <LoadingIcon />;
    }

    return (
        <Container>
            <h1>Edit Profile</h1>
            <Form onSubmit={handleSubmit}>
                <Container className="mb-5">
                    <Row>
                        <Col xs={6} lg={3}>
                            <ProfilePicture
                                onFileSelect={handleProfilePictureSelect}
                                url={data.profilePicture}
                            />
                            
                        </Col>
                        <Col xs={6} lg={9}>
                            <Form.Group as={Row} controlId="displayName">
                                <Form.Label column sm={2}>Display Name</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="displayName"
                                        value={data.displayName}
                                        onChange={handleChange}
                                        placeholder={"Mariah Carey"}
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
                                        placeholder={"I love to sing!"}
                                        rows={6}
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
                                        placeholder={"United States"}

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
                                        placeholder={"Singer, Pianist, Solo, Songwriter"}

                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="video">
                                <Form.Label column sm={2}>Featured Video</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="url"
                                        name="video"
                                        value={data.video}
                                        onChange={handleChange}
                                        placeholder={"e.g. https://www.youtube.com/watch?v=abcdefg"}
                                    />

                                </Col>
                            </Form.Group>
                        </Col>
                            
                    </Row>
                    
                </Container>
                

                <h2>Upload Photos</h2>
                <Container className="mb-5 border">
                    <Row>
                        {Array.from({ length: uploadPhotoCount }, (_, index) => (
                            <Col xs={6} lg={4} key={index}>
                            <UploadMedia
                                type="image"
                                onFileSelect={handleFileSelect}
                                url={data.photos[index]}
                                index={index}
                            />
                        </Col>
                        ))}
                    </Row>
                    
                    <Button onClick={handleAddPhotoUploadComponent} className="mt-3" disabled={selectedFiles.length < uploadPhotoCount || uploadPhotoCount > 6}>
                        Add More Photos
                    </Button> 
                </Container>

                <h2>Upload Audio</h2>
                <Container className="mb-5 border">
                    <Row>
                        {Array.from({ length: uploadAudioCount }, (_, index) => (
                            <Col xs={6} lg={4} key={index}>
                                <UploadMedia
                                    type="audio"
                                    onFileSelect={handleAudioFileSelect}
                                    url={data.tracks[index]}
                                    index={index}
                                />
                            </Col>
                            
                        ))}
                    </Row>
                    
                    <Button
                        onClick={handleAddAudioUploadComponent}
                        className="mt-3"
                        disabled={selectedAudioFiles.length < uploadAudioCount || uploadAudioCount > 3}
                    >
                        Add More Songs
                    </Button>
                </Container>

                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
}