import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stack, Box, Text, Circle, Button, Icon, Flex, HStack, VStack, Spinner, Avatar, Heading, Image, Input, Switch } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowRightIcon, ArrowDownIcon, EmailIcon, SmallAddIcon } from '@chakra-ui/icons';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { LoginButton } from './LoginButton';
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import goldfishLogo from './images/logo.svg';
import DropdownMenu from './DropdownMenu';
import CandidateAccountPage from './CandidateAccountPage';
import CandidateAnswerPage from './CandidateAnswersPage';
import CandidateProfilePage from './CandidateProfilePage';
import CandidateMatchesPage from './CandidateMatchesPage';

function CandidatePage(returnURL) {
    const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
    const [hasLoaded, setHasLoaded] = useState(false);
    const questionsRef = useRef(null);
    const joinRef = useRef(null);
    const [subscribed, setSubscribed] = useState(false);
    const [searchParams] = useSearchParams();
    const [userProfile, setUserProfile] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [hasLoadedProfile, setHasLoadedProfile] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Home');


    const [apiURL] = useState((window.location.href.includes('localhost')) ? 'http://localhost:8080/api' : 'https://goldfishai-website.herokuapp.com/api');

    const getUserProfile = async () => {
        try {
            const response = await axios.get(`${apiURL}/getUserProfile?user_id=${user.sub}&email=${user.email}`);
            if (response.data.success) {
                console.log('got user profile:', response.data);
                setUserProfile(response.data.profile);
                setUserAnswers(response.data.answers);
                console.log('set answers to:', response.data.answers);
                setHasLoadedProfile(true);
                // setSubscribed(response.data.profile.subscribed_newsletter);
            }
        } catch (error) {
            console.error('An error occurred while fetching user profile:', error);
        }
    };


    useEffect(() => {
        if (user && isAuthenticated) {
            getUserProfile();
        }
    }, [user, isAuthenticated]);


    useEffect(() => {
        const refFromURL = searchParams.get('ref') || searchParams.get('Ref'); // get jobID from the query string, either case
        if (refFromURL === 'join') { // if jobID exists in the URL
            console.log('jumping back to ref');
        }

        //if url ends in /account then set selected tab to account, same for /matches and /answer
        if (window.location.href.endsWith('/account')) {
            setSelectedTab('Account');
        } else if (window.location.href.endsWith('/matches')) {
            setSelectedTab('Matches');
        } else if (window.location.href.endsWith('/answer')) {
            setSelectedTab('Answer');
        }
    }, [searchParams]);


    const selectedPageContent = useCallback(() => {
        switch (selectedTab) {
            case 'Account':
                return <CandidateAccountPage apiURL={apiURL} userProfile={userProfile} hasLoadedProfile={hasLoadedProfile} />;
            case 'Matches':
                console.log('matches page selected');
                return <CandidateMatchesPage apiURL={apiURL}
                />;
                break;
            case 'Answer':
                console.log('answer page selected');
                return <CandidateAnswerPage apiURL={apiURL} userProfile={userProfile}
                    hasLoadedProfile={hasLoadedProfile}
                />;
            case 'Profile':
                console.log('profile page selected');
                return <CandidateProfilePage apiURL={apiURL} userProfile={userProfile}
                    userAnswers={userAnswers}
                    setUserAnswers={setUserAnswers}
                    hasLoadedProfile={hasLoadedProfile}
                />;
            default:
                return <Box p={16}>
                    <Heading as='h1' w='100%' h='100%'>
                        No Content Selected
                    </Heading>
                </Box>;
        }
    }, [selectedTab, userProfile, hasLoadedProfile, apiURL]);

    return (
        <Flex minHeight='100vh' minWidth='100%' flex='1 1 auto' direction='column'>

            <Box w='100%' background="linear-gradient(270deg, rgba(26,38,95,255) 50%, rgba(30,85,93,255) 90.0%)"
                borderBottomWidth="1px" borderStyle='solid' borderColor='white'>
                <Flex
                    paddingX="64px"
                    paddingY="32px"
                    direction="row"
                    justify="flex-start"
                    align="flex-end"
                    overflow="hidden"
                    height='35%'
                    alignSelf="stretch"
                    width='100%'
                    justifyContent='space-between'
                    alignItems='baseline'

                >

                    <HStack alignItems='baseline' p={0} >
                        <Image
                            borderRadius='25%'
                            boxSize='64px'
                            borderColor='white'
                            borderWidth='3px'
                            // border='10px solid white'
                            borderStyle='solid'
                            src={goldfishLogo}
                            alt='Goldfish Ai Logo'
                        />
                        <ChakraLink as={RouterLink} to="/candidate" style={{ textDecoration: 'none' }} display='inline-flex' alignItems='baseline'>
                            <Heading as='h2' size='lg' fontFamily='Poppins' color='white'>Goldfish AI</Heading>
                        </ChakraLink>
                    </HStack>
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
                                <DropdownMenu returnURL={window.location.href} />
                            </>
                        }
                    </HStack>
                </Flex>
            </Box>

            {(user && isAuthenticated) ? (


                <Stack
                    direction="row"
                    justify="flex-start"
                    align="flex-start"
                    spacing="0px"
                    overflow="hidden"
                    flex="1"
                    alignSelf="stretch"
                >
                    <Stack
                        paddingY="100px"
                        justify="flex-start"
                        align="center"
                        spacing="0px"
                        overflow="hidden"
                        borderColor="#FFFFFF"
                        borderEndWidth="1px"
                        // borderStyle="dashed"
                        width="200px"
                        minWidth='136px'
                        // maxWidth='200px'
                        // flex='1'
                        // maxWidth='50%'
                        alignSelf="stretch"
                        // maxWidth="100%"
                        background="linear-gradient(333deg, rgba(26,38,95,255) 60%,  rgba(30,85,93,255) 90%)"
                    >
                        <Button w='95%' h='72px' variant='ghost' color='white' onClick={() => { setSelectedTab('Home'); }}>
                            <Text fontFamily="Inter"
                                lineHeight="1.2"
                                fontWeight="bold"
                                fontSize="20px">
                                Home
                            </Text>
                        </Button>
                        <Button w='95%' h='72px' variant='ghost' color='white' onClick={() => { setSelectedTab('Matches'); }}>
                            <Text fontFamily="Inter"
                                lineHeight="1.2"
                                fontWeight="bold"
                                fontSize="20px">
                                Matches
                            </Text>
                        </Button>
                        <Button w='95%' h='72px' variant='ghost' color='white' onClick={() => { setSelectedTab('Answer'); }}>
                            <Text fontFamily="Inter"
                                lineHeight="1.2"
                                fontWeight="bold"
                                fontSize="20px">
                                Answer
                            </Text>
                        </Button>
                        <Button w='95%' h='72px' variant='ghost' color='white' onClick={() => { setSelectedTab('Profile'); }}>
                            <Text fontFamily="Inter"
                                lineHeight="1.2"
                                fontWeight="bold"
                                fontSize="20px">
                                Profile
                            </Text>
                        </Button>
                        <Button w='95%' h='72px' variant='ghost' color='white' onClick={() => { setSelectedTab('Account'); }}>
                            <Text fontFamily="Inter"
                                lineHeight="1.2"
                                fontWeight="bold"
                                fontSize="20px">
                                Account
                            </Text>
                        </Button>

                    </Stack>
                    <Stack
                        // paddingStart="64px"
                        // paddingEnd="32px"
                        // paddingTop="80px"
                        justify="flex-start"
                        align="flex-start"
                        // spacing="80px"
                        // flex="1"
                        // alignSelf="stretch"
                        w='100%'
                    >


                        {selectedPageContent()}
                    </Stack>
                </Stack>
            ) : <Box p={16}> <Heading as='h1' w='100%' h='100%'>Please Login</Heading></Box>}
            {/* <Stack justify="flex-end" alignSelf='flex-end' align="flex-start" w='100%' h='full' bg='blue.600' flex='1 1 auto' px={5}> */}

        </Flex >
    );
}
export default CandidatePage;;