import React, { useState, useEffect } from 'react';
import {
    Flex,
    VStack,
    HStack,
    Text,
    Button,
    Box,
    Image,
    Heading,
    IconButton,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

function CandidateMatchesPage({ apiURL }) {
    const { isAuthenticated, isLoading, user } = useAuth0();

    const [matches, setMatches] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasLoadedMatches, setHasLoadedMatches] = useState(false);
    const [errorLoadingMatches, setErrorLoadingMatches] = useState(false);

    //TODO: re-fetch matches both when the user answers more questions and on an error
    useEffect(() => {
        if (user) {
            // axios.get(`${apiURL}/getUserMatches?user_id=${user.sub}`)
            //     .then(response => {
            //         setMatches(response.data.matches);
            //         // console.log("Matches:", response.data.matches.length, response.data);
            //         setHasLoadedMatches(true);
            //     })
            //     .catch(error => {
            //         console.error("Error fetching matches:", error);
            //         setErrorLoadingMatches(true);
            //     });
        }
    }, [user, apiURL]);

    const nextMatch = () => {
        if (currentIndex < matches.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
        //test
    };

    const prevMatch = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <Flex
            justify="flex-start"
            align="flex-start"
            direction='column'
            paddingStart="64px"
            paddingEnd="32px"
            paddingTop="80px"
            w='100%'
            h='100%'
        >
            
            {/* {!hasLoadedMatches && ( 
                <VStack justify="center" align="center" w='100%' h='100%'>
                    <Text fontFamily="Inter" lineHeight="1.2" fontWeight="bold" fontSize="20px" color="#F2A5FF">
                        Loading Matches...
                    </Text>
                </VStack>
            )}
            */}
            {/* {hasLoadedMatches && ( */}
            {false && (
                <VStack justify="center" align="flex-start" w='100%' >
                    <Text fontFamily="Inter" lineHeight="1.2" fontWeight="bold" fontSize="20px" color="#F2A5FF">
                        {/* Your Matches {'test' + matches.length} */}
                    </Text>
                    <Text alignSelf='center'>Match {currentIndex + 1} of {matches.length}</Text>
                    <Flex direction='row' align='center' justify='space-between' w='100%'>
                        <IconButton
                            aria-label="Previous"
                            icon={<ArrowBackIcon />}
                            onClick={prevMatch}
                        />
                        <Box borderWidth='1px' borderRadius='md' w='60%' p={5}>
                            {matches[currentIndex] && (
                                <>
                                    {/* <Image boxSize='50px' objectFit='cover' src={matches[currentIndex].company_logo} alt={matches[currentIndex].company} /> */}
                                    {matches[currentIndex].company_logo ? <Image src={`data:image/jpeg;base64,${matches[currentIndex].company_logo}`} boxSize='75px' /> : <></>}

                                    <Heading as='h4' size='md'>{matches[currentIndex].company}</Heading>
                                    <Text>Job Title: {matches[currentIndex].job_title}</Text>
                                    <Text>
                                        Match Score:
                                        <br />
                                        Overall: {matches[currentIndex].match_score.overall}
                                        <br />
                                        Skills: {matches[currentIndex].match_score.skills}
                                        <br />
                                        Compensation: {matches[currentIndex].match_score.compensation}
                                        <br />
                                        Benefits: {matches[currentIndex].match_score.benefits}
                                    </Text>
                                </>
                            )}
                        </Box>
                        <IconButton
                            aria-label="Next"
                            icon={<ArrowForwardIcon />}
                            onClick={nextMatch}
                        />
                    </Flex>
                    <HStack spacing={8} alignSelf='center'> // Save and apply buttons with apply being green
                        {/* TODO: add functionality to save and apply buttons */}
                        <Button colorScheme='blue'>Save</Button>

                        <Button colorScheme='green'>Apply</Button>

                    </HStack>
                </VStack>
             )}*/
            
        </Flex>
    );
}

export default CandidateMatchesPage;
