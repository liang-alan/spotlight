import { auth, signOut } from "../navigation/firebase-config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();
    const [logoutSent , setLogoutSent] = useState(false);


    useEffect(() => {
        const handleSignOut = async () => {
            try {
                await signOut(auth);
                if (logoutSent) return;
                setLogoutSent(true);
                navigate("/login");
            } catch (error) {
                console.error("An error has occured while signing out: ", error);
            }
        };

        handleSignOut();
    }, []);
    
    return <div>
        <h1>Bye! See you soon!</h1>
    </div>;
}