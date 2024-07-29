import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Context from "./context";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import defaultPFP from '../img/default-pfp.jpg';
import SpotlightBanner from '../img/logo-banner.png';

import '../assets/styles.css';


export default function NavBar() {
    const { user } = useContext(Context);

    const [profilePictureUrl, setProfilePictureUrl] = useState(defaultPFP);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfilePictureUrl(data.profilePicture || defaultPFP);
            } else {
                setProfilePictureUrl(defaultPFP);
            }
        };

        if (user && user.uid) {
            fetchProfilePicture();
        }
    }, [user, defaultPFP]);


    return <Navbar bg="dark" variant="dark" fixed="top" expand="lg" className="navbar" >
        <Container>
            <Navbar.Brand>
                <img src={SpotlightBanner} className="navbar-logo d-none d-lg-block" alt="Logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse >
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/chats" className="navbar-spacing">Messages</Nav.Link>
                    <Nav.Link as={Link} to="/find-artists" className="navbar-spacing">Find Artists</Nav.Link>
                    <Nav.Link as={Link} to="/find-gigs" className="navbar-spacing">Find Events</Nav.Link>
                    {/* <Nav.Link as={Link} to="/login" className="navbar-spacing">Login</Nav.Link> */}
                    <NavDropdown title={<img
                            src={profilePictureUrl}
                            alt="Profile"
                            style={{ width: '25px', height: '25px', borderRadius: '50%' }}
                    />} id="profile-dropdown" className="navbar-spacing">
                        <NavDropdown.Item as={Link} to={`/profile/${user.uid}`}>View My Profile</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/edit-profile">Edit My Profile</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/logout">Log Out</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;

}