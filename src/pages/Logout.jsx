import { auth, signOut } from "../navigation/firebase-config";
import { useEffect } from "react";

export default function Logout() {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("An error has occured while signing out: ", error);
        }
    };

    useEffect(() => {
        handleSignOut();
    }, []);
    
    return <div>
        <h1>Logout</h1>
    </div>;
}