import React, { useState, useEffect, useRef, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Flex, HStack, Button, VStack, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, SimpleGrid, Switch, Spinner, Circle, Divider, useColorMode } from '@chakra-ui/react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './LoginButton';

const deployURL = 'https://goldfishai.netlify.app';


function EmployerProfileBuilderContent({ selectedSubTab, setSelectedSubTab }) {
    const SubTabButton = ({ title, secondaryText, tabName }) => (
        <Box
            as="button"
            w='80%'
            alignSelf='center'
            variant='unstyled'
            onClick={() => setSelectedSubTab(tabName)}
            mb={2}
            _hover={{ bg: 'none' }}
            _active={{ bg: 'none' }}
            color='white'
        >
            <Flex justifyContent='space-between'>
                <VStack alignItems='flex-start' spacing={1}>
                    <Text fontWeight='bold'>{title}</Text>
                    <Text fontSize='sm'>{secondaryText}</Text>
                </VStack>
                <Circle size="40px" border="2px" borderColor='green.400' bg={selectedSubTab === tabName ? 'green.400' : 'transparent'} />
            </Flex>
        </Box>
    );

    return (
        <VStack align='start' spacing={4} p={4} color='white'>
            <Text fontSize='2xl' fontWeight='bold' mb={1}
            // alignSelf='center'
            >
                Employer Profile Builder
            </Text>
            <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
            <SubTabButton title='Company Info' secondaryText='Fill in' tabName='Company Info' />
            <SubTabButton title='Office Locations' secondaryText='Fill in' tabName='Office Locations' />
            <SubTabButton title='Company Logo' secondaryText='Browse & Upload' tabName='Company Logo' />
            <SubTabButton title='Medical Benefits' secondaryText='Fill in' tabName='Medical Benefits' />
            <SubTabButton title='Other Benefits' secondaryText='Fill in' tabName='Other Benefits' />
        </VStack>
    );
}

function EmployerProfileBuilderRightContent({ selectedSubTab }) {
    switch (selectedSubTab) {
        case 'Company Info':
            return <p>Company Info content goes here...</p>;
        case 'Office Locations':
            return <p>Office Locations content goes here...</p>;
        case 'Company Logo':
            return <p>Company Logo content goes here...</p>;
        case 'Medical Benefits':
            return <p>Medical Benefits content goes here...</p>;
        case 'Other Benefits':
            return <p>Other Benefits content goes here...</p>;
        default:
            return null;
    }
}

function JobPostingsContent() {
    return <Box>Job Postings Content</Box>;
}

function JobPostingsRightContent() {
    return <Box>Job Postings Right Content</Box>;
}

function AccountSettingsContent() {
    return <Box>Account Settings Content</Box>;
}

function AccountSettingsRightContent() {
    return <Box>Account Settings Right Content</Box>;
}

function MatchesContent() {
    return <Box>Matches Content</Box>;
}

function MatchesRightContent() {
    return <Box>Matches Right Content</Box>;
}

function EmployerProfile(returnURL) {
    const { isAuthenticated, isLoading, user, logout } = useAuth0();
    const { colorMode, toggleColorMode, colorScheme } = useColorMode();
    const [selectedTab, setSelectedTab] = useState("Employer Profile");
    const [selectedSubTab, setSelectedSubTab] = useState('Company Info');


    return (
        <Box bg='#051672' minHeight='100vh'>
            <Box bg='#051672' display='flex' justifyContent='space-between' alignItems='end' padding='1.5rem' borderBottom='1px solid gray'>
                <Box display='flex' alignItems='baseline' p={0}>
                    <ChakraLink as={RouterLink} to="/employer" style={{ textDecoration: 'none' }} display='inline-flex' alignItems='baseline'>
                        <Text fontSize={{ base: '3xl', md: '3xl', lg: '3xl' }} fontWeight='700' fontFamily='Poppins' color='#FAD156'>Goldfish</Text>
                        <Text ml={3} fontSize={{ base: '1xl', md: '1xl', lg: '1xl' }} fontWeight='700' fontFamily='Poppins' color='#FFFFFF'>ai</Text>
                    </ChakraLink>
                </Box>
                <HStack spacing={5} alignItems='top'>
                    {isLoading ? <Spinner /> :
                        <>
                            {(isAuthenticated) ?
                                <VStack spacing={1} alignItems='center'>
                                    <Avatar src={user.picture} name={user.name} alt='Profile' borderRadius='full' boxSize={45} />
                                    <Box bg='#FAD156' borderRadius='full' px={2}>
                                        <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} color='black'>{user.name}</Text>
                                    </Box>
                                </VStack>
                                : <LoginButton />}
                            <Menu>
                                <MenuButton as={IconButton} aria-label='Options' icon={<ChevronDownIcon />} variant='outline' color='white' />
                                <MenuList>
                                    {(isAuthenticated) ? <MenuItem>Profile</MenuItem> : <></>}
                                    {(isAuthenticated) ? <MenuItem>Saved Jobs</MenuItem> : <></>}
                                    <MenuItem>Settings</MenuItem>
                                    <MenuItem>About Us</MenuItem>
                                    <MenuItem>
                                        <SimpleGrid columns={2} spacing={3}>
                                            <div>Dark Mode</div>
                                            <Switch colorScheme='blue' onChange={toggleColorMode} isChecked={colorMode === 'dark'} />
                                        </SimpleGrid>
                                    </MenuItem>
                                    <MenuItem onClick={() => logout({
                                        logoutParams: {
                                            returnTo: returnURL
                                        }
                                    })}>
                                        Log out
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    }
                </HStack>
            </Box>
            <HStack spacing={2} justifyContent='center' marginTop={5}>
                <Box w='15%' h='80vh' bg='#051672'>
                    <VStack spacing='6%' alignItems='center'>
                        <Button
                            w='80%'
                            variant={selectedTab === "Employer Profile" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Employer Profile")}
                        >
                            Employer Profile
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Job Postings" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Job Postings")}
                        >
                            Job Postings
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Account Settings" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Account Settings")}
                        >
                            Account Settings
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Matches" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Matches")}
                        >
                            Matches
                        </Button>
                    </VStack>
                </Box>
                <Box w='1px' h='80vh' bg='gray' />
                <Box w='25%' h='80vh' bg='#051672'>
                    {selectedTab === 'Employer Profile' && <EmployerProfileBuilderContent selectedSubTab={selectedSubTab} setSelectedSubTab={setSelectedSubTab} />}
                    {selectedTab === 'Job Postings' && <JobPostingsContent />}
                    {selectedTab === 'Account Settings' && <AccountSettingsContent />}
                    {selectedTab === 'Matches' && <MatchesContent />}
                </Box>
                <Box w='1px' h='80vh' bg='gray' />
                <Box w='60%' h='80vh' bg='#051672'>
                    {selectedTab === 'Employer Profile' && <EmployerProfileBuilderRightContent />}
                    {selectedTab === 'Job Postings' && <JobPostingsRightContent />}
                    {selectedTab === 'Account Settings' && <AccountSettingsRightContent />}
                    {selectedTab === 'Matches' && <MatchesRightContent />}
                </Box>
            </HStack>
        </Box>
    );
};

export default EmployerProfile;