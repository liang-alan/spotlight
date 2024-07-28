import { auth, signOut } from "../navigation/firebase-config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert("You have been signed out.");
            navigate("/login");
        } catch (error) {
            console.error("An error has occured while signing out: ", error);
        }
    };

    useEffect(() => {
        handleSignOut();
    }, []);
    
    return <div>
        <h1>Bye! See you soon!</h1>
    </div>;
}