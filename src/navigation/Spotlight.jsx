import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Context from './context';
import {useState} from 'react';


export default function Spotlight() {
    const [user, setUser] = useState({});

    return <div>
        <NavBar />
        <Context.Provider value={{user,setUser}}>
            <Outlet />
        </Context.Provider>
    </div>;
}