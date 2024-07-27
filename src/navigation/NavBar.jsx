import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
    return <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
        <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse >
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/chats">Messages</Nav.Link>
                    <Nav.Link as={Link} to="/find-artists">Find Artists</Nav.Link>
                    <Nav.Link as={Link} to="/find-gigs">Find Events</Nav.Link>
                    <NavDropdown title="Profile" id="profile-dropdown">
                        <NavDropdown.Item as={Link} to="/profile">View My Profile</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/logout">Log Out</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;

}