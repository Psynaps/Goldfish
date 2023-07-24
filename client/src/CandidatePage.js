import React, { useState, useEffect, useCallback } from 'react';
import { Stack, Box, Text, Circle, Button, Icon, Flex, HStack, VStack, Spinner, Avatar, Heading, Image, Input } from '@chakra-ui/react';
import { ArrowUpIcon, ArrowRightIcon, ArrowDownIcon, EmailIcon } from '@chakra-ui/icons';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { LoginButton } from './LoginButton';
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import goldfishLogo from './images/logo.png';
import DropdownMenu from './DropdownMenu';
import jellyfishImg from './images/jellyfish.svg';
import netImg from './images/net.svg';
import goldfishImg from './images/goldfish-swimming.png';
import lightRaysImg from './images/lightrays.png';
import rock1Img from './images/rock1.svg';
import rock2Img from './images/rock2.svg';
// import jellyfishImg from './images/jellyfish-test.png';

function CandidatePage(returnURL) {
    const { isAuthenticated, isLoading, user } = useAuth0();
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
                                    <Box as="span"> to swim in the job market. </Box>
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
                                    float to you.{' '}
                                </Text>
                            </Stack>
                            <Stack direction="row" justify="center" align="center">
                                <Button textAlign="center" colorScheme='pink'>Start Cruising </Button>
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
                paddingStart="80px"
                paddingEnd="64px"
                paddingTop="80px"
                justify="flex-start"
                align="flex-start"
                alignSelf="stretch"
            >
                <Stack
                    paddingX="64px"
                    justify="flex-start"
                    align="flex-start"
                    spacing="48px"
                    alignSelf="stretch"
                >
                    <Stack
                        justify="flex-start"
                        align="flex-start"
                        spacing="0px"
                        overflow="hidden"
                        alignSelf="stretch"
                    >
                        <Stack
                            justify="flex-start"
                            align="center"
                            spacing="0px"
                            alignSelf="stretch"
                        >
                            <Stack
                                justify="flex-start"
                                align="center"
                                spacing="25px"
                                alignSelf="stretch"
                            >
                                <Stack
                                    paddingY="16px"
                                    justify="flex-start"
                                    align="flex-start"
                                    alignSelf="stretch"
                                >
                                    <Stack
                                        padding="36px"
                                        borderRadius="20px"
                                        direction="row"
                                        justify="flex-start"
                                        align="center"
                                        borderColor="#FFFFFF"
                                        borderStartWidth="1px"
                                        borderEndWidth="1px"
                                        borderTopWidth="1px"
                                        borderBottomWidth="1px"
                                        alignSelf="stretch"
                                    >
                                        <Text
                                            fontFamily="Inter"
                                            lineHeight="1.2"
                                            fontWeight="bold"
                                            fontSize="30px"
                                            color="#FFFFFF"
                                            flex="1"
                                        >
                                            What level of experience do you have in implementing APIs on
                                            behalf of prospective customers?
                                        </Text>
                                    </Stack>
                                </Stack>
                                <Stack
                                    justify="flex-start"
                                    align="center"
                                    spacing="60px"
                                    alignSelf="stretch"
                                >
                                    <Stack
                                        paddingStart="40px"
                                        paddingTop="10px"
                                        justify="center"
                                        align="flex-start"
                                        spacing="24px"
                                        alignSelf="stretch"
                                    >
                                        <Stack
                                            padding="36px"
                                            borderRadius="10px"
                                            direction="row"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="green.500"
                                            borderStartWidth="1px"
                                            borderEndWidth="1px"
                                            borderTopWidth="1px"
                                            borderBottomWidth="1px"
                                            alignSelf="stretch"
                                            background="rgba(255, 255, 255, 0.2)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.5"
                                                fontWeight="regular"
                                                fontSize="24px"
                                                color="white"
                                                flex="1"
                                            >
                                                No experience
                                            </Text>
                                        </Stack>
                                        <Stack
                                            padding="36px"
                                            borderRadius="10px"
                                            direction="row"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="white"
                                            borderStartWidth="1px"
                                            borderEndWidth="1px"
                                            borderTopWidth="1px"
                                            borderBottomWidth="1px"
                                            alignSelf="stretch"
                                            background="rgba(255, 255, 255, 0.2)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.5"
                                                fontWeight="regular"
                                                fontSize="24px"
                                                color="white"
                                                flex="1"
                                            >
                                                Beginner: Have participated in API implementation for
                                                customers with support from a team, but have not led the
                                                process.
                                            </Text>
                                        </Stack>
                                        <Stack
                                            padding="36px"
                                            borderRadius="10px"
                                            direction="row"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="white"
                                            borderStartWidth="1px"
                                            borderEndWidth="1px"
                                            borderTopWidth="1px"
                                            borderBottomWidth="1px"
                                            alignSelf="stretch"
                                            background="rgba(255, 255, 255, 0.2)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.5"
                                                fontWeight="regular"
                                                fontSize="24px"
                                                color="white"
                                                flex="1"
                                            >
                                                Intermediate: Have regularly led the process of
                                                implementing APIs for customers, with an understanding of
                                                the associated practices and protocols.
                                            </Text>
                                        </Stack>
                                        <Stack
                                            padding="36px"
                                            borderRadius="10px"
                                            direction="row"
                                            justify="center"
                                            align="center"
                                            spacing="16px"
                                            borderColor="white"
                                            borderStartWidth="1px"
                                            borderEndWidth="1px"
                                            borderTopWidth="1px"
                                            borderBottomWidth="1px"
                                            alignSelf="stretch"
                                            background="rgba(255, 255, 255, 0.2)"
                                        >
                                            <Text
                                                fontFamily="Inter"
                                                lineHeight="1.5"
                                                fontWeight="regular"
                                                fontSize="24px"
                                                color="white"
                                                flex="1"
                                            >
                                                Advanced: Have extensive experience in independently
                                                leading the process of API implementation for a variety of
                                                customers, with the ability to troubleshoot issues and
                                                optimize the process.
                                            </Text>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack
                            paddingTop="80px"
                            paddingBottom="16px"
                            direction="row"
                            justify="center"
                            align="center"
                            spacing="40px"
                            overflow="hidden"
                            alignSelf="stretch"
                        >
                            <Stack justify="center" align="center" spacing="56px" flex="1">
                                <Stack
                                    direction="row"
                                    justify="center"
                                    align="flex-start"
                                    spacing="9.44px"
                                >
                                    <Stack
                                        direction="row"
                                        justify="flex-start"
                                        align="flex-start"
                                        spacing="36px"
                                    >
                                        <Stack
                                            direction="row"
                                            justify="flex-start"
                                            align="flex-start"
                                            spacing="0px"
                                        >
                                            <Circle
                                                size="80px"
                                                borderColor="green.500"
                                                borderStartWidth="3.54px"
                                                borderEndWidth="3.54px"
                                                borderTopWidth="3.54px"
                                                borderBottomWidth="3.54px"
                                            />
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justify="flex-start"
                                            align="flex-start"
                                            spacing="0px"
                                        >
                                            <Circle
                                                size="80px"
                                                borderColor="white"
                                                borderStartWidth="1.18px"
                                                borderEndWidth="1.18px"
                                                borderTopWidth="1.18px"
                                                borderBottomWidth="1.18px"
                                            />
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justify="flex-start"
                                            align="flex-start"
                                            spacing="0px"
                                        >
                                            <Circle
                                                size="80px"
                                                borderColor="white"
                                                borderStartWidth="1.18px"
                                                borderEndWidth="1.18px"
                                                borderTopWidth="1.18px"
                                                borderBottomWidth="1.18px"
                                            />
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justify="flex-start"
                                            align="flex-start"
                                            spacing="0px"
                                        >
                                            <Circle
                                                size="80px"
                                                borderColor="white"
                                                borderStartWidth="1.18px"
                                                borderEndWidth="1.18px"
                                                borderTopWidth="1.18px"
                                                borderBottomWidth="1.18px"
                                            />
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justify="flex-start"
                                            align="flex-start"
                                            spacing="0px"
                                        >
                                            <Circle
                                                size="80px"
                                                borderColor="white"
                                                borderStartWidth="1.18px"
                                                borderEndWidth="1.18px"
                                                borderTopWidth="1.18px"
                                                borderBottomWidth="1.18px"
                                            />
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justify="flex-start"
                                            align="flex-start"
                                            spacing="0px"
                                        >
                                            <Circle
                                                size="80px"
                                                borderColor="white"
                                                borderStartWidth="1.18px"
                                                borderEndWidth="1.18px"
                                                borderTopWidth="1.18px"
                                                borderBottomWidth="1.18px"
                                            />
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justify="flex-start"
                                            align="flex-start"
                                            spacing="0px"
                                        >
                                            <Circle
                                                size="80px"
                                                borderColor="white"
                                                borderStartWidth="1.18px"
                                                borderEndWidth="1.18px"
                                                borderTopWidth="1.18px"
                                                borderBottomWidth="1.18px"
                                            />
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justify="flex-start"
                                            align="flex-start"
                                            spacing="0px"
                                        >
                                            <Circle
                                                size="80px"
                                                borderColor="white"
                                                borderStartWidth="1.18px"
                                                borderEndWidth="1.18px"
                                                borderTopWidth="1.18px"
                                                borderBottomWidth="1.18px"
                                            />
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justify="flex-start"
                                            align="flex-start"
                                            spacing="0px"
                                        >
                                            <Circle
                                                size="80px"
                                                borderColor="white"
                                                borderStartWidth="1.18px"
                                                borderEndWidth="1.18px"
                                                borderTopWidth="1.18px"
                                                borderBottomWidth="1.18px"
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack direction="row" justify="center" align="center">
                                    <Button textAlign="center" size='lg' colorScheme='orange' rightIcon={<ArrowRightIcon />}>See Matches</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
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
                                            <span>For those </span>
                                            <Box as="span" color="pink.500">
                                                always
                                            </Box>
                                            <Box as="span"> looking, but </Box>
                                            <Box as="span" color="pink.500">
                                                rarely
                                            </Box>
                                            <Box as="span"> interviewing. </Box>
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
                                            We know great employees like you rarely take interviews.
                                            We’ve designed Goldfish to support the pragmatic job-seeker,
                                            starting wih{' '}
                                        </span>
                                        <Box as="span" color="orange.200">
                                            sales engineers
                                        </Box>
                                        <Box as="span">. </Box>
                                    </Text>
                                </Stack>
                                <Stack direction="row" justify="center" align="center">
                                    <Button size='lg' textAlign="center" colorScheme='pink' rightIcon={<EmailIcon />}>Joins the new school</Button>
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
                                        >
                                            Bringing candidates to the center of searching...
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
                backgroundOrigin='padding-box'
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
                        height="1440px"
                        maxWidth="100%"
                        border='0'
                    // pb={30}
                    // background="#FFFFFF"
                    >
                        <Box>
                            <Box>
                                <Stack
                                    padding="8px"
                                    direction="row"
                                    justify="center"
                                    align="center"
                                    width="461px"
                                    maxWidth="100%"
                                    pb={20}
                                >

                                    <Heading as='h2' size='2xl' color="orange.500"
                                        // width="445px"
                                        maxWidth="100%">
                                        How we match candidates.
                                    </Heading>
                                </Stack>
                            </Box>
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
                                            Your Career Goals{' '}
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
                                                Management Track
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
                                                ME Specialization
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
                                                Industry Niche{' '}
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
                                                Mission Focus
                                            </Text>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                        <Box>
                            <Stack
                                direction="row"
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
                                            Your Skill Background{' '}
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
                                                Industry Certs
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
                                                Technical Skills
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
                                                Deal Experience
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
                                                Tool Familiarity
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
                                                Flexibility Needs
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
                                                Wellness Benefits
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
                            paddingX="80px"
                            paddingY="64px"
                            direction="row"
                            justify="flex-start"
                            align="flex-start"
                            spacing="0px"
                            alignSelf="stretch"
                        >
                            <Stack paddingEnd="90px" justify="flex-start" align="flex-start">
                                <Stack
                                    padding="8px"
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
                                            TLDR: We put job seekers first.{' '}
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
                                    <Button size='lg' textAlign="center" colorScheme='pink' variant='outline'>
                                        <Heading as='h2' size='sm'>Return to questions</Heading></Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Flex
                            direction={{ base: "column", lg: "row" }}
                            align="center"
                            // spacing="-50px"
                            alignSelf="stretch"
                        >
                            <Stack
                                padding="6.58px"
                                justify="center"
                                align="center"
                                spacing="6.58px"
                                height="480px"
                                flexBasis={{ base: "100%", lg: "50%" }}
                                // bg='red'
                                backgroundImage={rock1Img}
                                backgroundSize='contain'
                                backgroundRepeat='no-repeat'
                            >
                                <Stack
                                    paddingX="14.56px"
                                    paddingBottom="5.82px"
                                    borderRadius="14.56px"
                                    justify="center"
                                    align="center"
                                    spacing="16px"
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
                                            fontWeight="bold"
                                            fontSize="24px"
                                            color="#FFFFFF"
                                            width="471.77px"
                                            height="296.31px"
                                            maxWidth="95%"
                                            textAlign='left'
                                        >
                                            We make recommendations based on best fit scores, never the
                                            subscription status of companies in our network. Creating
                                            meaningful matches is always our top priority.{' '}
                                        </Text>
                                    </Box>
                                </Stack>
                            </Stack>
                            <Stack
                                padding="6.47px"
                                // pl='-50ox'
                                justify="center"
                                align="center"
                                spacing="6.47px"
                                height="480px"
                                flexBasis={{ base: "100%", lg: "50%" }}
                                backgroundImage={rock2Img}
                                backgroundSize='contain'
                                backgroundRepeat='no-repeat'
                            >
                                <Stack
                                    paddingX="14.29px"
                                    pt={12}
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
                                            fontWeight="bold"
                                            fontSize="24px"
                                            color="#FFFFFF"
                                            width="463px"
                                            height="288px"
                                            maxWidth="100%"
                                            textAlign='left'
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
                    paddingX="80px"
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
                                        padding="8px"
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
                                                        Join our weekly newsletter.{' '}
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
                                                        We continuously learn new things about the sales
                                                        engineering job market. Our newsletter shares
                                                        interview tips, skill development spotlights, and
                                                        salary trends to keep you in the current.{' '}
                                                    </Text>
                                                </Stack>
                                            </Stack>
                                            <Stack
                                                direction="row"
                                                justify="center"
                                                align="center"
                                                width="794px"
                                                maxWidth="100%"
                                            >
                                                <Stack direction="row" justify="center" align="center">
                                                    <Button size='lg' textAlign="center" rightIcon={<EmailIcon />}>Email</Button>
                                                </Stack>
                                                {/* // TODO: Turn into input email */}
                                                <Input id='email' placeholder="example@domain.com" type='email' color='white' />
                                                {/* <Stack
                                                    paddingX="20px"
                                                    borderRadius="10px"
                                                    direction="row"
                                                    justify="center"
                                                    align="center"
                                                    borderColor="#FFFFFF"
                                                    borderStartWidth="2px"
                                                    borderEndWidth="2px"
                                                    borderTopWidth="2px"
                                                    borderBottomWidth="2px"
                                                    flex="1"
                                                    alignSelf="stretch"
                                                /> */}

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
export default CandidatePage;