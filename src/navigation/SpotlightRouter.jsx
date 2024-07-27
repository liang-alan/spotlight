import { BrowserRouter, Route, Routes } from 'react-router-dom';

//** Import Pages **/
import Spotlight from './Spotlight';
///
import Chats from '../pages/Chats';
import FindArtists from '../pages/FindArtists';
import FindGigs from '../pages/FindGigs';
import Login from '../pages/Login';
import Profile from '../pages/Profile';

export default function SpotlightRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Spotlight />}>
                    <Route path="chats" element={<Chats />} />
                    <Route path="find-artists" element={<FindArtists />} />
                    <Route path="find-gigs" element={<FindGigs />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="login" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}