import { Row, Col, Container, Button } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

import '../assets/styles.css';

import { IoChatboxEllipsesOutline } from "react-icons/io5";



export default function UserCard(props) {

    const navigate = useNavigate();

    const handleGetProfile = () => {
        console.log(props.uid);
        navigate(`/profile/${props.uid}`);
    }

    const handleStartChat = () => {
        navigate(`/chats/${props.uid}`);
    }

    return (
        <div>
            <Row className="user-card">
                <Col xs={12} md={3}>
                    <Row className="d-flex justify-content-center">
                        <img src={props.profilePicture} alt="User" className="user-image img-fluid" />
                    </Row>
                    <Row>
                        <Col xs={12} md={12}>
                            <Button onClick={handleStartChat}><IoChatboxEllipsesOutline /> Chat</Button>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={9} className="clickable" onClick={handleGetProfile}>
                    <h3 className="text-start">{props.displayName}</h3>
                    <Row className=" tags-container  text-start">
                        {props.tags && props.tags.length > 0 ? (
                            <span>
                                {props.tags.map((tag, index) => {
                                    return <p key={index} className="tag">{tag}</p>;
                                })}
                            </span>
                        ) : null}
                    </Row>
                    <p className="text-start">{props.bio}</p>
                </Col>
            </Row>
        </div>
    );

    

}