import React, { useState, useEffect, useRef, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Flex, HStack, Button, VStack, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, SimpleGrid, Switch, Spinner, Circle, Divider, useColorMode, FormControl, FormLabel, Input, FormErrorMessage, } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
// import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './LoginButton';

const deployURL = 'https://goldfishai.netlify.app';

const subTabs = [
    'Company Info',
    'Office Locations',
    'Company Logo',
    'Medical Benefits',
    'Other Benefits',
];

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

const EmployerProfileBuilderRightContent = ({
    selectedSubTab,
    setSelectedSubTab,
    formData,
    setFormData,
    userInfo // assume this is passed from parent component
}) => {
    const defaultValues = {
        name: userInfo?.name,
        website: userInfo?.website,
        linkedin: userInfo?.linkedin,
        logo: userInfo?.logo,
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset // reset method from useForm to update defaultValues
    } = useForm({ defaultValues });

    useEffect(() => {
        reset(defaultValues);
    }, [userInfo, reset]);

    const currentIndex = subTabs.indexOf(selectedSubTab);
    const nextSubTab = currentIndex < subTabs.length - 1 ? subTabs[currentIndex + 1] : null;
    const prevSubTab = currentIndex > 0 ? subTabs[currentIndex - 1] : null;

    const onSubmit = (data) => {
        setFormData(prev => ({ ...prev, [selectedSubTab]: data }));

        // If the submission is successful
        if (nextSubTab) {
            setSelectedSubTab(nextSubTab);
        }
    };
    if (selectedSubTab === 'Company Info') {
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align='start' spacing={4} p={4} color='white'>
                    <Text fontSize='2xl' fontWeight='bold' mb={5}>Basic info</Text>
                    <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
                    <VStack spacing={4} pl={25} alignItems='start' w='100%'>
                        <FormControl isInvalid={errors.name}>
                            <FormLabel htmlFor="name">Company Name or DBA</FormLabel>
                            <Input id="name" {...register("name", { required: "This is required" })} w='95%' alignSelf='center' />
                            <FormErrorMessage>
                                {errors.name && errors.name.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.website}>
                            <FormLabel htmlFor="website">Website</FormLabel>
                            <Input id="website" {...register("website", { required: "This is required" })} w='95%' alignSelf='center' />
                            <FormErrorMessage>
                                {errors.website && errors.website.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="linkedin">LinkedIn Profile (Optional)</FormLabel>
                            <Input id="linkedin" {...register("linkedin")} w='95%' alignSelf='center' />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="logo">Logo Upload</FormLabel>
                            <Input type="file" id="logo" {...register("logo")} w='95%' alignSelf='center' />
                        </FormControl>
                        <HStack>
                            <Button
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type="submit"
                            >
                                <Text>Next</Text>
                            </Button>
                            <Button
                                colorScheme="teal"
                                disabled={!prevSubTab}
                                onClick={() => prevSubTab && setSelectedSubTab(prevSubTab)}
                            >
                                <Text>Back</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        );
    }
};

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
    const [formData, setFormData] = useState({});


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
                            <Text isTruncated>Employer Profile</Text>
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Job Postings" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Job Postings")}
                        >
                            <Text isTruncated>Job Postings </Text>
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Account Settings" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Account Settings")}
                        >
                            <Text isTruncated> Account Settings</Text>
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Matches" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Matches")}
                        >
                            <Text isTruncated> Matches</Text>
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
                    <EmployerProfileBuilderRightContent
                        selectedSubTab={selectedSubTab}
                        setSelectedSubTab={setSelectedSubTab}
                        formData={formData}
                        setFormData={setFormData}
                        userInfo={{ 'name': 'test' }}
                    />
                    {selectedTab === 'Job Postings' && <JobPostingsRightContent />}
                    {selectedTab === 'Account Settings' && <AccountSettingsRightContent />}
                    {selectedTab === 'Matches' && <MatchesRightContent />}
                </Box>
            </HStack>
        </Box>
    );
};

export default EmployerProfile;