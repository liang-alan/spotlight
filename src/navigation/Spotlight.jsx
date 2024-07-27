import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Context from './context';
import {useState} from 'react';


export default function Spotlight() {
    const [user, setUser] = useState({});

    return <div>
        <Context.Provider value={{ user, setUser }}>
            <NavBar />
            <Outlet />
        </Context.Provider>
    </div>;
}