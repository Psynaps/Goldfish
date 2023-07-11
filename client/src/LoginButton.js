import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, useColorModeValue } from '@chakra-ui/react';

function LoginButton() {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button onClick={() => loginWithRedirect({ returnTo: window.location.origin })} background='blue' borderRadius={15} color={useColorModeValue('white', 'white')}>
            Log In/Sign Up
        </Button>
    );
}

function LogoutButton({ returnURL }) {
    const { logout } = useAuth0();

    return <button className='LogoutButton' onClick={() => logout({ returnTo: returnURL })}>Log Out</button>;
}

export { LoginButton, LogoutButton };