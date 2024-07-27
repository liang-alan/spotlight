import { useContext, useEffect } from 'react';
import {useParams } from 'react-router-dom';
import Context from '../navigation/context';

export default function Profile() {
    const { userId } = useParams();
    const { user } = useContext(Context);

    useEffect(() => {
        console.log(userId);
    }, [userId]);

    return <div>
        <h1>Profile</h1>
        <h2>{user.displayName}</h2>
        <h3>User ID: {userId}</h3>
    </div>;
}