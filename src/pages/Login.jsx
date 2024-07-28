import { Alert, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../navigation/firebase-config';
import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { doc, setDoc } from "firebase/firestore";

import { db } from '../navigation/firebase-config';



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
    video: ""
  }

  const pushDefaultData = async (userId) => {
    console.log("Pushing default data for new user: ", userId);
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, defaultData);
  }


    const loginWithGoogle = async () => {
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          console.log("User signed in with Google: ");
          console.log(result.user);
          setUser(result.user);
          
          // Check user's creation time
          const creationTime = result.user.metadata.creationTime;
          const lastSignInTime = result.user.metadata.lastSignInTime;
          console.log("Creation time: ", creationTime);
          console.log("Last sign in time: ", lastSignInTime);
          if (creationTime === lastSignInTime) {
            // New user
            pushDefaultData(result.user.uid);
            navigate(`/edit-profile`);
          } else {
            // Existing user
            navigate(`/profile/${result.user.uid}`);
          }
            

        } catch (error) {
            console.error("An Error has occured while signing in with Google: ", error);
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
            alert("Successfully signed up!");
            navigate(`/edit-profile`); 

        } catch (error) {
            console.error("Error signing up: ", error.message);
            alert("Error signing up: ", error.message);
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
            alert("Error signing in: ", error.message);
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
      <h1 className="text-center my-4">Spotlight</h1>
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