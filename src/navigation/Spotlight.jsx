import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function Spotlight() {
    return <div>
        <NavBar />
        <Outlet />
    </div>;
}