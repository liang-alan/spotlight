import { getPosterInformation } from "../navigation/firebase-config";

import { useState, useEffect } from "react";
import {Row , Col, Container} from 'react-bootstrap';
import LoadingIcon from "./LoadingIcon";

export default function ChatUserCard(props) {

    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInfo();

    }, [props.id]);

    // useEffect(() => {
    //     console.log(userData);
    // }, [userData]);
    
    const fetchInfo = async () => {
        setIsLoading(true);
        const data = await getPosterInformation(props.id);
        setUserData(data);
        setIsLoading(false);
    }

    
    if (isLoading) {
        return <LoadingIcon />;
    }
    
    return (
        <div className="chat-user-card clickable" onClick={() => props.changeUser(props.id)}>
            <img src={userData.profilePicture} alt="profile" className="chat-user-image" /><p>{userData.displayName}</p>
        </div>
    );
}
    