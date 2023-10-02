import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Text, SimpleGrid, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorMode, Switch } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
function DropdownMenu({ returnURL }) {
    const { isAuthenticated, logout } = useAuth0();
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    return (
        <Menu>
            <MenuButton as={IconButton} aria-label='Options' icon={<ChevronDownIcon />} variant='outline' color='white' />
            <MenuList>
                {isAuthenticated && <MenuItem onClick={() => navigate("/employer/profile")}>Profile</MenuItem>}
                {isAuthenticated && <MenuItem>Saved Jobs</MenuItem>}
                {isAuthenticated && <MenuItem>Settings</MenuItem>}
                <MenuItem>About Us</MenuItem>
                <MenuItem>
                    <SimpleGrid columns={2} spacing={3}>
                        <Text>Dark Mode</Text>
                        <Switch colorScheme='blue' id='darkModeSwitch' onChange={toggleColorMode} isChecked={colorMode === 'dark'} />
                    </SimpleGrid>
                </MenuItem>
                {isAuthenticated && <MenuItem onClick={() => logout({
                    logoutParams: {
                        returnTo: returnURL
                    }
                })}>
                    Log out
                </MenuItem>}
            </MenuList>
        </Menu>
    );
}


export default DropdownMenu;