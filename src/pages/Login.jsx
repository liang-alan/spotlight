import { Button } from 'react-bootstrap';
import React from 'react';

export default function Login() {
    const loginWithGoogle = () => {
        console.log('Login with Google');
    }
    return <div>
        <h1>Login</h1>
        <Button variant="primary" size="lg" onClick={loginWithGoogle}>Login with Google</Button>
    </div>;
}