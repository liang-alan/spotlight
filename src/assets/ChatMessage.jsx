import { db, auth, getPosterInformation } from '../navigation/firebase-config';

import { Row, Col, Container } from 'react-bootstrap';

import {useEffect , useState} from 'react';


export default function ChatMessage(props) {

    const [userId, setUserId] = useState(auth.currentUser.uid);

    const formatDate = (dateString) => {
        let d = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };

        return d.toLocaleString('en-US', options);
    }

    if (userId === props.sender) {
        return (
            <Container className="chat-message self">
                <p>{props.msg}</p>
                <p className="timestamp">{formatDate(props.timestamp)}</p>
            </Container>
        );
    } else {
        return (
            <Container className="chat-message other">
                <p>{props.msg}</p>
                <p className="timestamp">{formatDate(props.timestamp)}</p>
            </Container>
        );
    }
}