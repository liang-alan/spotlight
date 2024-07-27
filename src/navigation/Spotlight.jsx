import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Context from './context';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from '../pages/Login';
import LoadingIcon from '../assets/LoadingIcon';

export default function Spotlight() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    if (isLoading) {   
        return <LoadingIcon />;
    }

    return (
        <Context.Provider value={{ user, setUser }}>
            {user ? (
                <div>
                    <NavBar/>
                    <Outlet />
                </div>
            ) : (
                <Login />
            )}
        </Context.Provider>
    );
}