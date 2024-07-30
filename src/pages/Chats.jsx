import { useContext, useEffect, useState, useRef} from 'react';
import { doc, getDoc, collection, getDocs, setDoc, updateDoc, arrayUnion} from "firebase/firestore";
import { db, auth, getPosterInformation } from '../navigation/firebase-config';
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';


import LoadingIcon from '../assets/LoadingIcon';

import '../assets/styles.css';
import defaultPFP from '../img/default-pfp.jpg';

import ChatUserCard from '../assets/ChatUserCard';
import ChatMessage from '../assets/ChatMessage';




export default function Chats() {

    const [isLoading, setIsLoading] = useState(true);
    const [currUser, setCurrUser] = useState([]);
    const [currUserData , setCurrUserData] = useState([]);
    const [userList, setUserList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const { senderId } = useParams();
    const userId = auth.currentUser.uid;
    const chatEndRef = useRef(null);
    const navigate = useNavigate();


    const fetchMessagesSingle= async () => {
        const usersRef = doc(db, "users", userId, "messages", currUser);
        if (usersRef) {
            const userSnapshot = await getDoc(usersRef);
            setMessages(userSnapshot.data().messages);
        } else {
            console.log("No such document!");
        }
    }


    const fetchSenderList = async () => {
        setIsLoading(true);
        const usersRef = collection(db, "users", userId, "messages");
        const userSnapshot = await getDocs(usersRef);
        const usersList = userSnapshot.docs.map((doc) =>
        {
            return [doc.id ,doc.data()];
        });
        fetchProfilePicture();
        setUserList(usersList);
        if (usersList.length > 0) {
            fetchUserData(usersList[0][0]);
            setCurrUser(usersList[0][0]);
            setMessages(usersList[0][1].messages);
        } else {
            setCurrUser(null);
            setCurrUserData(null);
            setMessages(null);
        }

        setIsLoading(false);
    }

    const createNewChatter = async () => {
        // console.log(senderId);
        const userRef = doc(db, "users", userId, "messages", senderId);

        // Ensure the userRef document exists and has a messages field
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists() || !userSnapshot.data().messages) {
            await setDoc(userRef, { messages: [] }, { merge: true });
        }
    };

    useEffect(() => {
        // console.log(senderId);
        if (senderId) {
            createNewChatter();
        }
        fetchSenderList();

    }, [senderId]);

    const fetchUserData = async (id) => {
        setIsLoading(true);
        const data = await getPosterInformation(id);
        // console.log(data); 
        setCurrUserData(data);
        setIsLoading(false);
    }

    // const findMessages = async (id) => {
    //     setIsLoading(true);
    //     userList.forEach(user => {
    //         if (user[0] === id) {
    //             setIsLoading(false);
    //             setMessages(user[1].messages);
    //         }
    //     });
    //     setIsLoading(false);
    // }


   

    const handleChangeUser = (user) => {
        setCurrUser(user);
    }

    useEffect(() => {
        if (currUser.length > 0) {
            fetchUserData(currUser);
            fetchMessagesSingle();
        }
    }, [currUser]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const myMessage = {
                msg: messageContent,
                sender: userId,
                timestamp: new Date().toISOString()
            };

            const userRef = doc(db, "users", userId, "messages", currUser);
            const otherUserRef = doc(db, "users", currUser, "messages", userId);

            // Ensure the userRef document exists and has a messages field
            const userSnapshot = await getDoc(userRef);
            if (!userSnapshot.exists() || !userSnapshot.data().messages) {
                await setDoc(userRef, { messages: [] }, { merge: true });
            }

            // Ensure the otherUserRef document exists and has a messages field
            const otherUserSnapshot = await getDoc(otherUserRef);
            if (!otherUserSnapshot.exists() || !otherUserSnapshot.data().messages) {
                await setDoc(otherUserRef, { messages: [] }, { merge: true });
            }

            await updateDoc(userRef, {
                messages: arrayUnion(myMessage)
            });

            await updateDoc(otherUserRef, {
                messages: arrayUnion(myMessage)
            });

            setMessageContent('');
            fetchMessagesSingle();

        } catch (error) {
            console.error('Error sending message: ', error);
        }
    }
    

    const fetchProfilePicture = async () => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setProfilePictureUrl(data.profilePicture);
        } else {
            setProfilePictureUrl(defaultPFP);
        }
    };

    const handleClick = () => {
        navigate(`/profile/${currUser}`);
    }

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (isLoading) {
        return <LoadingIcon />;
    }

    return <div>
        <h1>Chats</h1>
        <Container className="chat-container">
            <Row>
                <Col xs={4} className="text-start chat-users">
                    <h3>Users</h3>
                    {isLoading ? (
                        <LoadingIcon />
                    ) : userList && userList.length > 0 ? (
                        userList.map(user => (
                            <ChatUserCard key={user[0]} id={user[0]} changeUser={handleChangeUser} />
                        ))
                    ) : (
                        <p>{"No users found :("}</p>
                    )}

                </Col>
                {currUser ? (
                    <Col xs={8} className="text-start chat-messages">
                        <Row className="chat-header clickable" onClick={handleClick}>
                            <Col xs={2} className="text-start" style={{ height: '100%' }}>
                                <img src={currUserData.profilePicture} alt="profile" className="chat-user-image" />
                            </Col>
                            <Col xs={10} className="text-start d-flex align-items-center" style={{ height: '100%' }}>
                                <h3>{currUserData.displayName}</h3>
                            </Col>
                        </Row>
                        <Row className="chat-body">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                messages.length > 0 ? (
                                    <>
                                        {messages.map(message => (
                                            <ChatMessage
                                                key={message.timestamp}
                                                {...message}
                                                otherPFP={currUserData.profilePicture}
                                                yourPFP={profilePictureUrl}
                                            />
                                        ))}
                                        <div ref={chatEndRef} />
                                    </>
                                ) : (
                                    <p>There are no messages right now. Be the first!</p>
                                )
                            )}
                        </Row>
                        <Row className="chat-input">
                            <Col xs={12} className="text-start align-items-center">
                                <Form onSubmit={handleSendMessage}>
                                    <Form.Group className="mb-3 d-flex">
                                        <Form.Control
                                            type="text"
                                            placeholder="Type a message..."
                                            className="flex-grow-1 me-2"
                                            value={messageContent}
                                            onChange={(e) => setMessageContent(e.target.value)}
                                        />
                                        <Button variant="primary" type="submit">
                                            Send
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                ) : (
                        <div/>
                )}
                
            </Row>
            
        </Container>
    </div>;
}