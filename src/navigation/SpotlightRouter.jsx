import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useContext, useEffect } from 'react';

//** Import Pages **/
import Spotlight from './Spotlight';
///
import Chats from '../pages/Chats';
import FindArtists from '../pages/FindArtists';
import FindGigs from '../pages/FindGigs';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Logout from '../pages/Logout';
import EditProfile from '../pages/EditProfile';

import Context from '../navigation/context';


export default function SpotlightRouter() {
    const { user } = useContext(Context);
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Spotlight />}>
                    <Route path="chats" element={<Chats />} />
                    <Route path="find-artists" element={<FindArtists />} />
                    <Route path="find-gigs" element={<FindGigs />} />
                    <Route path="profile/:userId" element={<Profile />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="login" element={<Login />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="*" element={<h1>Hmmm.. you might be lost? Go back to the home page!</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}