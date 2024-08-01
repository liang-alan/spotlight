import { Alert, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, storage, getDownloadURL } from '../navigation/firebase-config';
import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { doc, setDoc, getDoc, collection } from "firebase/firestore";

import { db } from '../navigation/firebase-config';
import { getStorage, ref,  } from "firebase/storage";

import LogoBanner from '../img/logo-banner.png';



import Context from '../navigation/context';
import '../assets/styles.css';
import '../App.css';

import LoginBlockade from '../assets/LoginBlockade';
import { motion, useAnimation } from 'framer-motion';

import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const { user, setUser } = useContext(Context);
  const [ logIn, setLogIn ] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "", confirmPassword: "" });  
  const [animateBlockadeLeft, setAnimateBlockadeLeft] = useState({ opacity: 1, x: 0 });
  const [animateBlockadeRight, setAnimateBlockadeRight] = useState({ opacity: 1, x: 0 });
  const animationComplete = useRef(false);
  const navigate = useNavigate();
  
  const defaultData = {
    displayName: "",
    profilePicture: "",
    id: "",
    bio: "",
    tracks: [],
    trackNames: [],
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
    video: "",
    reviews: []
  }

  const getPhotoURL = async () => {
    try {
      const storageRef = ref(storage, 'default.jpg');
      const url = await getDownloadURL(storageRef);
      console.log('Download URL:', url);
      defaultData.profilePicture = url;
    } catch (error) {
      console.error('Error getting download URL:', error);
    }
  };

 


  const pushDefaultData = async (userId) => {
    console.log("Pushing default data for new user: ", userId);
    const photoURL = await getPhotoURL();
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {...defaultData, displayName: userId , profilePicture: photoURL});
  }

  const searchUser = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.displayName) {
          console.log("User found: ", userData.displayName);
          return userData.displayName;
        } else {
          console.log("User found but no displayName.");
          return null;
        }
      } else {
        console.log("No user found for UID: ", uid);
        return null;
      }
    } catch (error) {
      console.error("Error searching for user: ", error);
      return null;
    }
  };

    const loginWithGoogle = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          console.log("User signed in with Google: ");
          console.log(result.user);
          setUser(result.user);
          
          if (await searchUser(result.user.uid) === null) {
            
            // New user
            pushDefaultData(result.user.uid);
            navigate(`/edit-profile`);
          } else {
            // Existing user
            navigate(`/profile/${result.user.uid}`);
          }
            

        } catch (error) {
            console.error(error);
        }
    }
    const signUpWithEmail = async (e) => {
        e.preventDefault(); 

        if (credentials.password !== credentials.confirmPassword) {
            console.log("Passwords do not match");
            return;
        }
        try {
            const result = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            setUser(result.user);
            console.log("User signed up: ", result.user);
            pushDefaultData(result.user.uid);
            navigate(`/edit-profile`);
            alert("Successfully signed up!");
            navigate(`/edit-profile`); 

        } catch (error) {
            console.error("Error signing up: ", error.message);
            alert(error.message);
        }
    }
    const loginWithEmail = async (e) => {
        e.preventDefault(); 
        try {
            const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            setUser(result.user);
            console.log("User signed in: ", result.user);
            alert("Successfully signed in!");
            navigate(`/profile/${result.user.uid}`); 

        } catch (error) {
            console.error("Error signing in: ", error.message);
            alert(error.message);
        }
    }

    const handleSwitchRight = () => {
        if (animationComplete.current) {
            setAnimateBlockadeRight({ opacity: 0, x: '100%' });
            animationComplete.current = false; // Reset the animation state
        }
    }

    const handleSwitchLeft = () => {
        if (animationComplete.current) {
            setAnimateBlockadeLeft({ opacity: 0, x: '-100%' });
            animationComplete.current = false; // Reset the animation state
        }
    }

    const handleAnimationComplete = () => {
        if (!animationComplete.current) {
            setLogIn(!logIn);
            animationComplete.current = true; // Ensure it only runs once
            // Reset the animation state if necessary
            setAnimateBlockadeRight({ opacity: 1, x: 0 });
            setAnimateBlockadeLeft({ opacity: 1, x: 0 });
        }

    }
  return <div className="background-container">
    <div className="background-content">
      <img src={LogoBanner} alt="Logo Banner" className="login-banner" />
      <Container className="d-flex justify-content-center my-4">
        <Row>
          <Col xs={12} md={6} className="d-flex align-items-center login-column position-relative">
            {logIn ? (
              <LoginBlockade text={"Log In"} animate={animateBlockadeRight} onClick={handleSwitchRight} handleAnimationComplete={handleAnimationComplete} />
            ) : (
              <motion.div className=""
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <h2>Log In with Email</h2>
                <Form onSubmit={loginWithEmail}>
                  <Form.Group controlId="formLoginEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="formLoginPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mb-1">
                    Login
                  </Button>
                </Form>
              </motion.div>
            )}
          </Col>

          <Col xs={12} md={6} className="d-flex align-items-center login-column position-relative">
            {!logIn ? (
              <LoginBlockade text={"Sign Up"} animate={animateBlockadeLeft} onClick={handleSwitchLeft} handleAnimationComplete={handleAnimationComplete} />
            ) : (
              <motion.div className=""
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <h2>Sign Up with Email</h2>
                <Form onSubmit={signUpWithEmail}>
                  <Form.Group controlId="formSignInEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="formSignInPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="formSignInConfirmPassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={credentials.confirmPassword}
                      onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mb-1">
                    Sign Up
                  </Button>
                </Form>
              </motion.div>
            )}
          </Col>
        </Row>
      </Container>
      <Button
        variant="primary"
        size="lg"
        onClick={loginWithGoogle}
      >
        <Container>
          <Row>
            <Col className="d-flex align-items-center justify-content-between">
              <FaGoogle className="me-2" />
              Login with Google
            </Col>
          </Row>
        </Container>
      </Button>
    </div>
      
       
        
    </div>;
}