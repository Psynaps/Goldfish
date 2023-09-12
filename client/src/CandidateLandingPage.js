import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stack, Box, Text, Circle, Button, Icon, Flex, HStack, VStack, Spinner, Avatar, Heading, Image, Input, Switch } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowRightIcon, ArrowDownIcon, EmailIcon } from '@chakra-ui/icons';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { LoginButton } from './LoginButton';
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import goldfishLogo from './images/logo.svg';
import DropdownMenu from './DropdownMenu';
import jellyfishImg from './images/jellyfish.svg';
import netImg from './images/net.svg';
import goldfishImg from './images/goldfish-swimming.png';
import lightRaysImg from './images/lightrays.png';
import rock1Img from './images/rock1.svg';
import rock2Img from './images/rock2.svg';
import OnboardingQuestions from './OnboardingQuestions';
// import jellyfishImg from './images/jellyfish-test.png';

function CandidateLandingPage(returnURL) {
    const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [hasLoaded, setHasLoaded] = useState(false);
    const questionsRef = useRef(null);
    const joinRef = useRef(null);
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");
    const [searchParams] = useSearchParams();

    const [apiURL] = useState((window.location.href.includes('localhost')) ? 'http://localhost:8080/api' : 'https://goldfishai-website.herokuapp.com/api');

    //useCallback function which runs on page load to check if the user has already
    // answered the onboarding questions by querying the server calling getUserAnswers and setting 
    // the selectedAnswers state to the response. Then it sets the hasLoaded state to true
    // so that the OnboardingQuestions component can render
    const fetchUserAnswers = useCallback(async () => {
        if (isAuthenticated) {
            try {
                const response = await axios.get(`${apiURL}/getUserAnswers?user_id=${user.sub}`);

                if (response.data.success) {
                    console.log('successfully retrieved user answers:', response.data);
                    setSelectedAnswers(response.data.answers);
                    setHasLoaded(true);
                }
                else {
                    console.log('error retrieving user answers:', response.data);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, [isAuthenticated, user, apiURL]);

    const changeNewsletterSubscription = async (user, email, subscribing) => {
        try {
            const payload = {
                user_id: user ? user.sub : null,
                email: email ? email : '',
                subscribing: subscribing,
            };

            const response = await axios.post(`${apiURL}/changeNewsletterSubscription`, payload);

            if (response.data.success) {
                console.log('Subscription status updated');
            }
        } catch (error) {
            console.error('Error updating subscription:', error);
        }
    };



    const getUserProfile = async (user_id) => {
        try {
            const response = await axios.get('/api/getUserProfile', {
                params: { user_id }
            });
            if (response.data.success) {
                setSubscribed(response.data.profile.subscribed_newsletter);
            }
        } catch (error) {
            console.error('An error occurred while fetching user profile:', error);
        }
    };

    const handleEmailClick = () => {
        changeNewsletterSubscription(null, email, true);
    };

    const handleSubscribedChange = (event) => {
        if (user && isAuthenticated) {
            setSubscribed(event.target.checked);
            changeNewsletterSubscription(user, user.email, event.target.checked);
        }
    };


    const scrollToQuestions = () => window.scrollTo({ behavior: 'smooth', top: questionsRef.current.offsetTop - 50 });

    const scrollToJoin = () => window.scrollTo({ behavior: 'smooth', top: joinRef.current.offsetTop - 50 });

    //useEffect to call fetchUserAnswers on page load
    useEffect(() => {
        fetchUserAnswers();
    }, [fetchUserAnswers]);

    useEffect(() => {
        if (user && isAuthenticated) {
            getUserProfile(user.user_id);
        }
    }, [user, isAuthenticated]);



    useEffect(() => {
        const refFromURL = searchParams.get('ref') || searchParams.get('Ref'); // get jobID from the query string, either case
        if (refFromURL === 'join') { // if jobID exists in the URL
            console.log('jumping back to ref');
            scrollToJoin();
        }
    }, [user, searchParams]);

    return (
        <Stack
            justify="flex-start"
            align="flex-start"
            spacing="0px"
            overflow="hidden"
            // width="1536px"
            maxWidth="100%"
            background="linear-gradient(142deg, #1f35a4 0%, #1c2b73 20.23%, #080e28 82.12%)"
            boxShadow="base"
        // background='red'
        >
            <Box backgroundImage={lightRaysImg} backgroundSize='contain' backgroundRepeat='no-repeat' w='100%'>
                <Flex
                    paddingX="64px"
                    paddingY="72px"
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
                        <ChakraLink as={RouterLink} to="/home" style={{ textDecoration: 'none' }} display='inline-flex' alignItems='baseline'>
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
                <Stack
                    // padding="80px"
                    p={20}
                    pb={0}
                    justify="flex-start"
                    align="flex-start"
                    alignSelf="stretch"
                >
                    <Stack
                        paddingX="64px"
                        paddingY="8px"
                        justify="flex-start"
                        align="flex-start"
                        spacing="48px"
                        alignSelf="stretch"
                    >
                        <Stack justify="flex-start" align="flex-start" alignSelf="stretch">
                            <Stack
                                padding="8px"
                                direction="row"
                                justify="flex-start"
                                align="flex-start"
                                overflow="hidden"
                            >
                                <Text
                                    fontFamily="Inter"
                                    lineHeight="1"
                                    fontWeight="bold"
                                    fontSize="48px"
                                    color="#FFFFFF"
                                    width="620px"
                                    maxWidth="100%"
                                >
                                    <span>We make it </span>
                                    <Box as="span" color="orange.500">
                                        easy
                                    </Box>
                                    <Box as="span"> to swim in the legal job market. </Box>
                                </Text>
                            </Stack>
                        </Stack>
                        <Stack
                            justify="flex-start"
                            align="flex-start"
                            spacing="32px"
                            alignSelf="stretch"
                        >
                            <Stack
                                padding="8px"
                                direction="row"
                                justify="flex-start"
                                align="flex-start"
                                overflow="hidden"
                            >
                                <Text
                                    fontFamily="Inter"
                                    lineHeight="1.5"
                                    fontWeight="regular"
                                    fontSize="24px"
                                    color="#FFFFFF"
                                    width="620px"
                                    maxWidth="100%"
                                >
                                    Answer simple questions and let meaningful career opportunities
                                    float to you.
                                </Text>
                            </Stack>
                            <Stack direction="row" justify="center" align="center">
                                <Button textAlign="center" colorScheme='pink' onClick={scrollToQuestions}>Start Cruising</Button>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack
                        paddingStart="320px"
                        paddingEnd="275px"
                        paddingY="8px"
                        direction="row"
                        justify="center"
                        align="flex-end"
                        spacing="48px"
                        alignSelf="stretch"
                    >
                        <Stack
                            direction="column"
                            justify="flex-start"
                            align="flex-start"
                            // spacing="21.69px"
                            st='-25px'
                            height="306px"
                        >
                            <Box opacity="0.5" alignItems='center' w='100%' >

                                <Circle
                                    size="49.39px"
                                    borderColor="#FFFFFF"
                                    borderWidth='0.59px'
                                    ml='-50px'
                                />
                                <Circle
                                    size="34.57px"
                                    borderColor="#FFFFFF"
                                    borderWidth='0.59px'
                                    ml='-25px'
                                />
                                <Circle
                                    size="25px"
                                    borderColor="#FFFFFF"
                                    borderWidth='0.59px'
                                />

                            </Box>
                            {/* {Goldfish} */}
                            <Image src={goldfishImg} alt='Goldfish' w='255px' h='268px' minWidth='255px' minHeight='268px' mt='-105px' ml='40px' />
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
            <Stack
                // paddingStart="80px"
                // paddingEnd="64px"
                paddingTop="30px"
                justify="flex-start"
                align="flex-start"
                alignSelf="stretch"
            >
                {isAuthenticated ?
                    <OnboardingQuestions innerRef={questionsRef} apiURL={apiURL} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} hasLoaded={hasLoaded} /> :
                    <Heading as='h1' pl={[16, 32]} ref={questionsRef} >Please log in to see and answer questions.</Heading>
                }
            </Stack>
            <Stack
                paddingX="80px"
                paddingY="32px"
                direction="row"
                justify="flex-start"
                align="flex-start"
                alignSelf="stretch"
            >
                <Stack
                    paddingStart="64px"
                    paddingY="32px"
                    direction="row"
                    justify="flex-start"
                    align="flex-start"
                    spacing="48px"
                    flex="1"
                >
                    <Stack
                        paddingTop="16px"
                        paddingBottom="8px"
                        justify="flex-start"
                        align="flex-start"
                        spacing="48px"
                        flex="1"
                        alignSelf="stretch"
                    >
                        <Stack
                            direction="row"
                            justify="flex-start"
                            align="flex-start"
                            spacing="40px"
                            alignSelf="stretch"
                        >
                            <Stack
                                paddingTop="208px"
                                paddingBottom="64px"
                                justify="flex-start"
                                align="flex-start"
                                spacing="48px"
                                flex="1"
                                alignSelf="stretch"
                            >
                                <Stack
                                    direction="row"
                                    justify="flex-start"
                                    align="flex-start"
                                    alignSelf="stretch"
                                >
                                    <Stack
                                        padding="8px"
                                        direction="row"
                                        justify="flex-start"
                                        align="flex-start"
                                        overflow="hidden"
                                        flex="1"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1"
                                            fontWeight="bold"
                                            fontSize="48px"
                                            color="white"
                                            flex="1"
                                        >
                                            <span>Your </span>
                                            <Box as="span" color="pink.500">
                                                skills
                                            </Box>
                                            <Box as="span"> take you beyond the shallow.</Box>
                                        </Text>
                                    </Stack>
                                </Stack>
                                <Stack
                                    padding="8px"
                                    direction="row"
                                    justify="flex-start"
                                    align="flex-start"
                                    overflow="hidden"
                                    alignSelf="stretch"
                                >
                                    <Text
                                        fontFamily="Inter"
                                        lineHeight="1.5"
                                        fontWeight="regular"
                                        fontSize="24px"
                                        color="#FFFFFF"
                                        flex="1"
                                    >
                                        <span>
                                            Our automated framework lets them shine to law firms who place a premium on your expertise.
                                        </span>
                                        {/* <Box as="span" color="orange.200">
                                            sales engineers
                                        </Box>
                                        <Box as="span">. </Box> */}
                                    </Text>
                                </Stack>
                                <Stack direction="row" justify="center" align="center">
                                    <Button ref={joinRef} size='lg' textAlign="center" colorScheme='pink' rightIcon={<EmailIcon />}
                                        onClick={() => { loginWithRedirect({ returnTo: `${window.location.origin}?ref=join` }); }}
                                    >Join the new school</Button>
                                </Stack>
                                <Stack
                                    paddingX="8px"
                                    paddingTop="208px"
                                    direction="row"
                                    justify="flex-start"
                                    align="flex-start"
                                    overflow="hidden"
                                    alignSelf="stretch"
                                >
                                    <Text
                                        fontFamily="Inter"
                                        lineHeight="1.33"
                                        fontWeight="bold"
                                        fontSize="24px"
                                        color="white"
                                        flex="1"
                                    >
                                        <span>Finding </span>
                                        <Box as="span" color="pink.500">
                                            meaningful
                                        </Box>
                                        <Box as="span"> work in the 🌊 requires three things... </Box>
                                    </Text>
                                </Stack>
                            </Stack>
                            <Stack justify="center" align="flex-start" flex="1">
                                <Stack
                                    justify="center"
                                    align="center"
                                    spacing="0px"
                                    alignSelf="stretch"
                                >
                                    <Box />
                                    <Stack
                                        paddingY="16px"
                                        direction="row"
                                        justify="flex-end"
                                        align="flex-end"
                                        spacing="0px"
                                        overflow="hidden"
                                        alignSelf="stretch"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.5"
                                            fontWeight="regular"
                                            fontSize="24px"
                                            color="orange.500"
                                            flex="1"
                                            textAlign="center"
                                            w='20%'
                                        >
                                            <Box>Bringing legal professionals</Box>
                                            to the center of searching...
                                        </Text>
                                        <ArrowDownIcon data-icon="CkArrowDown" />
                                    </Stack>
                                    <VStack alignItems='center'>
                                        <Circle size='12px' bg='white' mb='-10px' />
                                        <Box bg='white' w='3px' h={40} mb='-10px' justifySelf={'center'}></Box>
                                        <Image src={netImg} alt='Fishing Net' />
                                    </VStack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Box
                backgroundImage={jellyfishImg}
                backgroundSize={'2388px 1440px'}
                backgroundRepeat={'no-repeat'}
                // backgroundOrigin='padding-box'
                backgroundPosition='75% 20%'

            >
                <Stack
                    padding="64px 64px 0px 64px"
                    direction="row"
                    justify="flex-start"
                    align="flex-start"
                    spacing="0px"
                    borderColor="#FFFFFF"
                    borderTopWidth="1px"
                    borderBottomWidth="1px"
                    borderStyle="dashed"
                    alignSelf="stretch"
                // backgroundImage={jellyfishImg}
                // backgroundSize={'2400px 1440px'}
                // backgroundRepeat={'no-repeat'}
                // backgroundOrigin='padding-box'
                // background="linear-gradient(172deg, #0a1553 0%, #090f29 100%)"
                >
                    <Stack
                        justify="flex-start"
                        align="flex-start"
                        overflow="hidden"
                        width="2388px"
                        // height="1440px"
                        maxWidth="100%"
                        border='0'
                        p={['4', '4', '16']}
                        spacing={16}
                    // pb={30}
                    // background={["red", "red", "blue"]}
                    >
                        <Box>
                            <Box pb={20}>
                                <Stack
                                    paddingX="32px"
                                    paddingY="16px"
                                    borderRadius="10px"
                                    direction="row"
                                    justify="center"
                                    // align="center"
                                    // width="581px"
                                    w="55%"
                                    maxWidth="55%"
                                    background="#FFFFFF"
                                >
                                    <Text
                                        align="center"
                                        fontFamily="Inter"
                                        lineHeight="1"
                                        fontWeight="bold"
                                        fontSize="48px"
                                        color="blue.600"
                                        flex="1"
                                    >

                                        How we match legal support professionals
                                    </Text>
                                </Stack>
                            </Box>

                            <Stack
                                direction={['column', 'column', 'row', 'row']}
                                justify="flex-start"
                                align="flex-start"
                                spacing={16}
                            >
                                <Stack
                                    padding="20px"
                                    borderRadius="20px"
                                    justify="flex-start"
                                    align="flex-start"
                                    spacing="16px"
                                    borderColor="orange.500"
                                    borderWidth='2px'
                                    background="rgba(255, 255, 255, 0.08)"
                                    // width="345px"
                                    maxWidth="100%"
                                    backdropFilter="blur(2px)"
                                >
                                    <Stack
                                        paddingX="28px"
                                        paddingY="20px"
                                        borderRadius="10px"
                                        justify="center"
                                        align="center"
                                        width="288px"
                                        maxWidth="100%"
                                        background="pink.500"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.2"
                                            fontWeight="bold"
                                            fontSize="20px"
                                            color="white"
                                        >
                                            Your HR Preferences
                                        </Text>
                                    </Stack>
                                    <Stack
                                        paddingStart="20px"
                                        paddingEnd="16px"
                                        justify="flex-start"
                                        align="flex-start"
                                        spacing="12px"
                                        width="288px"
                                        maxWidth="100%"
                                    >
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.9)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                Salkary / Contract
                                            </Text>
                                        </Stack>
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.9)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                Coverage Needs
                                            </Text>
                                        </Stack>
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.9)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                401K / Savings
                                            </Text>
                                        </Stack>
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.9)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                Flexibility / Hours
                                            </Text>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack
                                    padding="20px"
                                    borderRadius="20px"
                                    justify="flex-start"
                                    align="flex-start"
                                    spacing="16px"
                                    borderColor="orange.500"
                                    borderWidth='2px'
                                    background="rgba(255, 255, 255, 0.08)"
                                    width="345px"
                                    maxWidth="100%"
                                    backdropFilter="blur(2px)"
                                >
                                    <Stack
                                        paddingX="28px"
                                        paddingY="20px"
                                        borderRadius="10px"
                                        justify="center"
                                        align="center"
                                        width="288px"
                                        maxWidth="100%"
                                        background="pink.500"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.2"
                                            fontWeight="bold"
                                            fontSize="20px"
                                            color="white"
                                        >
                                            Your Legal Expertise
                                        </Text>
                                    </Stack>
                                    <Stack
                                        paddingStart="20px"
                                        paddingEnd="16px"
                                        justify="flex-start"
                                        align="flex-start"
                                        spacing="12px"
                                        width="288px"
                                        maxWidth="100%"
                                    >
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.9)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                State level e-filing
                                            </Text>
                                        </Stack>
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.9)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                Legal Certifications
                                            </Text>
                                        </Stack>
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.9)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                Practice Niche
                                            </Text>
                                        </Stack>
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.9)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                Case Management
                                            </Text>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                        <Box>

                            <Stack
                                borderRadius="20px"
                                justify="flex-start"
                                align="flex-start"
                                spacing="64px"
                                pb={16}
                            >
                                <Stack
                                    padding="20px"
                                    borderRadius="20px"
                                    justify="flex-start"
                                    align="flex-start"
                                    spacing="16px"
                                    borderColor="orange.500"
                                    borderWidth='2px'
                                    background="rgba(255, 255, 255, 0.08)"
                                    width="345px"
                                    maxWidth="100%"
                                    backdropFilter="blur(2px)"
                                >
                                    <Stack
                                        paddingX="28px"
                                        paddingY="20px"
                                        borderRadius="10px"
                                        justify="center"
                                        align="center"
                                        width="288px"
                                        maxWidth="100%"
                                        background="pink.500"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.2"
                                            fontWeight="bold"
                                            fontSize="20px"
                                            color="white"
                                        >
                                            Technical Skills
                                        </Text>
                                    </Stack>
                                    <Stack
                                        paddingStart="20px"
                                        paddingEnd="16px"
                                        justify="flex-start"
                                        align="flex-start"
                                        spacing="12px"
                                        width="288px"
                                        maxWidth="100%"
                                    >
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.6)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                OCR & Processing
                                            </Text>
                                        </Stack>
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.6)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                Search Querying
                                            </Text>
                                        </Stack>
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.6)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                SQL Database
                                            </Text>
                                        </Stack>
                                        <Stack
                                            paddingX="28px"
                                            paddingY="20px"
                                            borderRadius="10px"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="cyan.500"
                                            borderWidth="2px"
                                            width='100%'
                                            maxWidth="100%"
                                            background="rgba(41, 41, 41, 0.6)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.2"
                                                fontWeight="bold"
                                                fontSize="20px"
                                                color="white"
                                            >
                                                Data Encryption
                                            </Text>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>

                    </Stack>
                </Stack>
            </Box>
            <Stack
                direction="row"
                justify="center"
                align="center"
                spacing="0px"
                alignSelf="stretch"
            >
                <Stack
                    paddingX="80px"
                    paddingTop="50px"
                    justify="flex-start"
                    align="flex-start"
                    spacing="0px"
                    overflow="hidden"
                    flex="1"
                    alignSelf="stretch"
                >
                    <Stack justify="center" align="flex-start" alignSelf="stretch">
                        <Stack
                            paddingX="70px"
                            pb="64px"
                            pt='104px'
                            direction="row"
                            justify="flex-start"
                            align="flex-start"
                            spacing="0px"
                            alignSelf="stretch"
                        >
                            <Stack paddingEnd="90px" justify="flex-start" align="flex-start">
                                <Stack
                                    // padding="8px"
                                    justify="center"
                                    align="center"
                                    spacing="48px"
                                >
                                    <Stack direction="row" justify="center" align="center">
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1"
                                            fontWeight="bold"
                                            fontSize="48px"
                                            color="#FFFFFF"
                                        >
                                            Our Bedrock Principles.
                                        </Text>
                                    </Stack>
                                    <Stack
                                        direction="row"
                                        justify="center"
                                        align="center"
                                        alignSelf="stretch"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.2"
                                            fontWeight="bold"
                                            fontSize="36px"
                                            color="pink.500"
                                        >
                                            TLDR: We put job seekers first.
                                        </Text>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack
                                paddingX="8px"
                                paddingY="30px"
                                justify="flex-start"
                                align="flex-start"
                                overflow="hidden"
                                width="400px"
                                alignSelf="stretch"
                                maxWidth="100%"
                            >
                                <Stack direction="row" justify="center" align="center">
                                    <Button size='lg' textAlign="center" colorScheme='pink' variant='outline' onClick={scrollToQuestions}>
                                        <Heading as='h2' size='sm'>Return to questions</Heading></Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Flex
                            direction={{ base: "column", lg: "row" }}
                            align="center"
                            pl={14}
                        // spacing="-50px"
                        // alignSelf="stretch"
                        >
                            <Stack
                                // padding="6.47px"
                                justify="center"
                                align="center"
                                alignSelf='center'
                                // spacing="6.47px"
                                height="480px"
                                flexBasis={{ base: "100%", lg: "50%" }}
                                backgroundImage={rock1Img}
                                backgroundPosition={{ base: "center", lg: "left" }}
                                backgroundSize='contain'
                                backgroundRepeat='no-repeat'
                            >
                                <Stack
                                    // paddingX="14.29px"
                                    // pt={1}
                                    borderRadius="14.29px"
                                    justify="center"
                                    align="center"
                                    spacing="16px"
                                    width="503.04px"
                                    maxWidth="100%"
                                >
                                    <Box
                                        paddingX="14.56px"
                                        paddingY="7.28px"
                                        borderRadius="7.28px"
                                        justify="center"
                                        align="center"
                                        spacing="5.82px"
                                        background="#727272"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.2"
                                            fontWeight="bold"
                                            fontSize="32.15px"
                                            color="#FFFFFF"
                                            textAlign='left'
                                        >
                                            Neutrality Always.{' '}
                                        </Text>
                                    </Box>
                                    <Box
                                        paddingX="5.82px"
                                        borderRadius="7.28px"
                                        justify="center"
                                        align="center"
                                        spacing="0px"
                                        height="221px"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.33"
                                            // fontWeight="bold"
                                            fontSize={{ base: "20px", lg: "24px" }}
                                            color="#FFFFFF"
                                            width="415px"
                                            // height="296px"
                                            maxWidth="95%"
                                            px={4}
                                            textAlign='center'
                                        >
                                            We make recommendations based on best fit scores, never the
                                            subscription status of companies in our network. Creating
                                            meaningful matches is always our top priority.{' '}
                                        </Text>
                                    </Box>
                                </Stack>
                            </Stack>
                            <Stack
                                // padding="6.47px"
                                // pl='-50ox'
                                justify="center"
                                align="center"
                                // spacing="6.47px"
                                height="480px"
                                flexBasis={{ base: "100%", lg: "50%" }}
                                backgroundImage={rock2Img}
                                backgroundPosition={{ base: "center", lg: "left" }}
                                backgroundSize='contain'
                                backgroundRepeat='no-repeat'
                            >
                                <Stack
                                    // paddingX="14.29px"
                                    // pt={1}
                                    borderRadius="14.29px"
                                    justify="center"
                                    align="center"
                                    spacing="16px"
                                    width="503.04px"
                                    maxWidth="100%"
                                >
                                    <Box
                                        paddingX="14.29px"
                                        paddingY="7.15px"
                                        borderRadius="7.15px"
                                        direction="row"
                                        justify="center"
                                        align="center"
                                        spacing="5.72px"
                                        background="#677361"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.2"
                                            fontWeight="bold"
                                            fontSize="32.03px"
                                            color="#FFFFFF"
                                            align='center'
                                        >
                                            Your data is private.{' '}
                                        </Text>
                                    </Box>
                                    <Box
                                        paddingX="5.72px"
                                        borderRadius="7.15px"
                                        direction="row"
                                        justify="center"
                                        align="center"
                                        spacing="5.72px"
                                        height="234px"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.33"
                                            // fontWeight="bold"
                                            fontSize="24px"
                                            color="#FFFFFF"
                                            width="415px"
                                            height="296.31px"
                                            maxWidth="95%"
                                            px={4}
                                            textAlign='center'
                                        >
                                            Opening up about your career is sensitive. Your data is
                                            private to you by default. We’ve built the tool so you
                                            always initiate any sharing of your data with employers.{' '}
                                        </Text>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Flex>
                    </Stack>
                </Stack>
            </Stack>
            <Stack
                paddingX="80px"
                paddingY="56px"
                direction="row"
                justify="flex-start"
                align="flex-start"
                spacing="0px"
                alignSelf="stretch"
            >
                <Stack
                    paddingX="70px"
                    paddingTop="64px"
                    justify="flex-end"
                    align="flex-start"
                    spacing="0px"
                    overflow="hidden"
                    flex="1"
                    alignSelf="stretch"
                >
                    <Stack justify="flex-start" align="flex-start" alignSelf="stretch">
                        <Stack justify="flex-start" align="flex-start" alignSelf="stretch">
                            <Stack
                                justify="flex-start"
                                align="flex-start"
                                spacing="32px"
                                alignSelf="stretch"
                            >
                                <Stack
                                    justify="flex-start"
                                    align="flex-start"
                                    alignSelf="stretch"
                                >
                                    <Stack
                                        // padding="8px"
                                        justify="center"
                                        align="flex-start"
                                        spacing="48px"
                                        alignSelf="stretch"
                                    >
                                        <Stack direction="row" justify="center" align="center">
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1"
                                                fontWeight="bold"
                                                fontSize="48px"
                                                color="white"
                                            >
                                                Swim with the school.{' '}
                                            </Text>
                                        </Stack>
                                        <Stack
                                            justify="center"
                                            align="flex-start"
                                            spacing="40px"
                                            alignSelf="stretch"
                                        >
                                            <Stack
                                                justify="center"
                                                align="center"
                                                spacing="36px"
                                                width="749px"
                                                maxWidth="100%"
                                            >
                                                <Stack
                                                    direction="row"
                                                    justify="center"
                                                    align="center"
                                                    alignSelf="stretch"
                                                >
                                                    <Text
                                                        fontFamily="Inter"
                                                        lineHeight="1.2"
                                                        fontWeight="bold"
                                                        fontSize="36px"
                                                        color="pink.500"
                                                        flex="1"
                                                    >
                                                        Join our weekly newsletter.
                                                    </Text>
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    justify="center"
                                                    align="center"
                                                    alignSelf="stretch"
                                                >
                                                    <Text
                                                        fontFamily="Inter"
                                                        lineHeight="1.5"
                                                        fontWeight="regular"
                                                        fontSize="24px"
                                                        color="white"
                                                        flex="1"
                                                    >
                                                        We continuously learn new things about the
                                                        legal job market. Our newsletter shares
                                                        interview tips, skill development spotlights, and
                                                        salary trends to keep you in the current.
                                                    </Text>
                                                </Stack>
                                            </Stack>
                                            <Stack
                                                direction="row"
                                                justify="left"
                                                align="center"
                                                width="794px"
                                                maxWidth="100%"
                                            >
                                                {user ? (
                                                    <>
                                                        <Text fontSize='lg' color='white'>Subscribed:</Text>
                                                        <Switch isChecked={subscribed} size='lg' onChange={(e) => handleSubscribedChange(e)} />
                                                    </>
                                                ) : (
                                                    <Stack direction="row" justify="center" align="center">
                                                        <Button size='lg' textAlign="center" onClick={handleEmailClick}>Email</Button>
                                                        <Input id='email' placeholder="example@domain.com" type='email' color='white' value={email} onChange={(e) => setEmail(e.target.value)} />

                                                    </Stack>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack justify="flex-end" align="flex-start" alignSelf="stretch">
                        <Stack
                            paddingX="8px"
                            paddingTop="300px"
                            direction="row"
                            justify="flex-start"
                            align="flex-start"
                            overflow="hidden"
                        >
                            <Text
                                fontFamily="Inter"
                                fontWeight="regular"
                                fontSize="30px"
                                color="#FFFFFF"
                            >
                                Goldfish AI L.L.C., 2023
                            </Text>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack >
    );
}
export default CandidateLandingPage;