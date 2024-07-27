import { useContext, useEffect } from 'react';
import Context from '../navigation/context';

export default function Profile() {
    const { user } = useContext(Context);

    return <div>
        <h1>Profile</h1>
        <h2>{user.displayName}</h2>
    </div>;
}