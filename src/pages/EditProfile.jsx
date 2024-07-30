import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { doc, getDoc, setDoc } from "firebase/firestore";
import { storage, ref, uploadBytes, getDownloadURL, auth } from '../navigation/firebase-config'; // Adjust path as needed



import { db } from '../navigation/firebase-config';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

import LoadingIcon from '../assets/LoadingIcon';
import UploadMedia from '../assets/UploadMedia';
import ProfilePicture from '../assets/ProfilePicture';
import AddAchievementModal from '../assets/AddAchievementModal';
import AchievementCard from '../assets/AchievementCard';
import usePlacesAutocomplete from '../navigation/usePlacesAutocomplete';

export default function EditProfile() {
    const [data, setData] = useState({
        displayName: "",
        profilePicture: "",
        id : "",
        bio: "",
        tracks: [],
        trackNames:[],
        achievements: [],
        photos: [],
        location: "",
        locationCoords : [],
        tags: [],
        socials: {
            instagram: "",
            youtube: "",
            facebook: "",
            spotify: ""
        },
        video : ""
    });

    const [location , setLocation] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [achievementModal , setAchievementModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadPhotoCount, setUploadPhotoCount] = useState(1); // Start with 1 upload component
    const [uploadAudioCount, setUploadAudioCount] = useState(1); // Number of upload components to show
    const [selectedAudioFiles, setSelectedAudioFiles] = useState([]); // Array of selected audio files
    const [profilePicture, setProfilePicture] = useState(null);
    const user = auth.currentUser;
    const navigate = useNavigate();

    const handlePlaceSelect = (place) => {
        console.log(place.formatted_address);
        setData({
            ...data,
            location: place.formatted_address,
            locationCoords: [place.geometry.location.lat(), place.geometry.location.lng()]
        });
        setLocation(place.formatted_address);

        console.log(data);
    };

    const inputRef = usePlacesAutocomplete(handlePlaceSelect);
    useEffect(() => {

        if (data.location) {
            setLocation(data.location);
        }
        // console.log("My Data: ", data);
    }, [data.location]);

    useEffect(() => {
        // console.log("CurrUser: ", user);
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
                    } else if (file === -1) {
                        updatedData.photos[index] = null;
                    } else {
                        continue;
                    }
                }

                // remove all null
                updatedData.photos = updatedData.photos.filter(photo => photo !== null);

                for (let index = 0; index < selectedAudioFiles.length; index++) {
                    const file = selectedAudioFiles[index];

                    if (file instanceof File) {
                        console.log("File: ", file, "Index: ", index);
                        const storageRef = ref(storage, `media/${user.uid}/audio/${file.name}`);
                        await uploadBytes(storageRef, file);
                        const downloadURL = await getDownloadURL(storageRef);
                        updatedData.tracks[index] = downloadURL;
                    } else if (file === -1) {
                        updatedData.tracks[index] = null;
                    } else {
                        continue;
                    }
                }

                updatedData.tracks = updatedData.tracks.filter(track => track !== null);

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

    const handleSubmitAchievement = (achievementData) => {
        console.log(achievementData);
        setData(prevData => ({
            ...prevData,
            achievements: [...prevData.achievements, achievementData]
        }));
        setAchievementModal(false);
    };

    const handleChangeSocials = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            socials: {
                ...prevData.socials,
                [name]: value
            }
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
                                        required
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
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="location">
                                <Form.Label column sm={2}>Location</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder={"United States"}
                                        ref={inputRef}
                                        required
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
                                <Form.Label column sm={2}>Video Link</Form.Label>
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
                            <Form.Group as={Row} controlId="socials">
                                <Form.Label column sm={2}>Socials</Form.Label>
                                <Col sm={10}>
                                    <Form.Control
                                        type="text"
                                        name="instagram"
                                        value={data.socials.instagram}
                                        onChange={handleChangeSocials}
                                        placeholder={"Instagram"}
                                    />
                                    <Form.Control
                                        type="text"
                                        name="youtube"
                                        value={data.socials.youtube}
                                        onChange={handleChangeSocials}
                                        placeholder={"Youtube"}

                                    />
                                    <Form.Control
                                        type="text"
                                        name="facebook"
                                        value={data.socials.facebook}
                                        onChange={handleChangeSocials}
                                        placeholder={"Facebook"}

                                    />
                                    <Form.Control
                                        type="text"
                                        name="spotify"
                                        value={data.socials.spotify}
                                        onChange={handleChangeSocials}
                                        placeholder={"Spotify"}

                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                            
                    </Row>
                    
                </Container>
                

                <Container className="mb-5 border">
                    <h2>Upload Photos</h2>

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
                    
                    <Button onClick={handleAddPhotoUploadComponent} className="my-3" disabled={selectedFiles.length < uploadPhotoCount || uploadPhotoCount > 6}>
                        Add More Photos
                    </Button> 
                </Container>

                <Container className="mb-5 border">
                    <h2>Upload Audio</h2>

                    <Row>
                        {Array.from({ length: uploadAudioCount }, (_, index) => (
                            <Col xs={6} lg={4} key={index}>
                                <Form.Label>Track {index + 1} Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={`track${index}`}
                                    value={data.trackNames[index]}
                                    onChange={(e) => {
                                        const updatedTrackNames = [...data.trackNames];
                                        updatedTrackNames[index] = e.target.value;
                                        setData(prevData => ({ ...prevData, trackNames: updatedTrackNames }));
                                    }}
                                    placeholder={"Song Name"}
                                />
                                
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
                        className="my-3"
                        disabled={selectedAudioFiles.length < uploadAudioCount || uploadAudioCount > 3}
                    >
                        Add More Songs
                    </Button>
                </Container>

                <Container className="mb-5 border">

                    <h2>Achievements</h2>
                    
                    <AddAchievementModal show={achievementModal} handleClose={() => setAchievementModal(false)} handleSubmitAchievement={handleSubmitAchievement} />
                    {
                        data.achievements.map((achievement, index) => (
                            <Row key={index} className="mb-3">
                                <AchievementCard {...achievement} />
                            </Row>
                        ))
                    }
                    <Button onClick={() => setAchievementModal(true)}>Add Achievement</Button>
                </Container>


                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
}