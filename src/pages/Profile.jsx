import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useParams } from 'react-router-dom';
import LoadingIcon from '../assets/LoadingIcon';

export default function Profile() {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(userId);
    }, [userId]);

    const [profilePictureUrl, setProfilePictureUrl] = useState(defaultPFP);

    useEffect(() => { //search yser
        const fetchProfilePicture = async () => {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data());

            } else {
                navigate('/404');
            }
        };
        
    }, []);

    return <div>
        <h1>Profile</h1>
        <h3>User ID: {userId}</h3>
    </div>;
}