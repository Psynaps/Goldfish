import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Flex, Wrap, HStack, Button, Spacer, Select, VStack, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, SimpleGrid, Switch, Spinner, Circle, Divider, useColorMode, FormControl, FormLabel, Input, FormErrorMessage, } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
// import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './LoginButton';
import './App.css';

// const deployURL = 'https://goldfishai.netlify.app';

const subTabs = [
    'Company Info',
    'Office Locations',
    'Medical & Benefits',
    'Paid Time Off',
    '401k / Financial',
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
            <HStack justifyContent='space-between' alignItems='center' >
                <VStack alignItems='flex-start' textAlign={'left'} spacing={1} whiteSpace={'normal'} >
                    <Text fontWeight='bold' fontSize={['xs', 'sm', 'md']}>{title}</Text>
                    <Text fontSize={['2xs', 'xs']}>{secondaryText}</Text>
                </VStack>
                <Circle size={[6, 8]} border="2px" borderColor='green.400' bg={selectedSubTab === tabName ? 'green.400' : 'transparent'} />
            </HStack>
        </Box >
    );

    return (
        <VStack align='start' spacing={4} p={4} color='white'>
            <Text fontSize={{ base: 'lg', md: '2xl', lg: '3xl' }} fontWeight='bold' mb={1}
            // alignSelf='center'
            >
                Employer Profile Builder
            </Text>
            <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
            {subTabs.map((tabName) => <SubTabButton key={tabName} title={tabName} secondaryText='Fill in' tabName={tabName} />)}
        </VStack>
    );
}

const EmployerProfileBuilderRightContent = ({
    selectedSubTab,
    setSelectedSubTab,
    userInfo, // assume this is passed from parent component
    setUserInfo
}) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset // reset method from useForm to update defaultValues
    } = useForm({ userInfo });



    const currentIndex = subTabs.indexOf(selectedSubTab);
    const nextSubTab = currentIndex < subTabs.length - 1 ? subTabs[currentIndex + 1] : null;
    const prevSubTab = currentIndex > 0 ? subTabs[currentIndex - 1] : null;

    // console.log(currentIndex, nextSubTab, prevSubTab);
    const onSubmit = (data) => {
        setUserInfo(prev => ({ ...prev, ...data }));
        console.log('formData:', data);
        // If the submission is successful
        if (nextSubTab) {
            setSelectedSubTab(nextSubTab);
        }

    };



    const saveEmployerProfile = (data) => {
        const newUserInfo = { ...userInfo, ...data };
        setUserInfo(newUserInfo);
        console.log('saving employer profile...');
        console.log('userInfo:', userInfo);

    };

    useEffect(() => {
        console.log('userinfo', userInfo);
        reset(userInfo);

    }, [userInfo, reset]);

    if (selectedSubTab === subTabs[0]) {
        return (
            <form key={subTabs[0]} onSubmit={handleSubmit(onSubmit)}>
                <VStack align='start' spacing={4} p={4} color='white'>
                    <Text fontSize='2xl' fontWeight='bold' mb={5}>Basic info</Text>
                    <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
                    <VStack spacing={4} pl={25} alignItems='start' w='100%'>
                        <FormControl isInvalid={errors.companyName}>
                            <FormLabel htmlFor="companyName">Company Name or DBA</FormLabel>
                            <Input id="companyName" {...register("companyName", { required: "This is required" })} w='95%' alignSelf='center' />
                            <FormErrorMessage>
                                {errors.companyName && errors.companyName.message}
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
                            <Input type="file" id="logo" {...register("logo")} w='95%' p={2} alignSelf='center' />
                        </FormControl>
                        <HStack>
                            <Button
                                colorScheme="teal"
                                isDisabled={currentIndex === 0}
                                onClick={() => prevSubTab && setSelectedSubTab(prevSubTab)}
                            >
                                <Text>Back</Text>
                            </Button>
                            <Button
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type="submit"
                            >
                                <Text>Next</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        );
    }
    else if (selectedSubTab === subTabs[1]) {
        return (
            <form key={subTabs[1]} onSubmit={handleSubmit(onSubmit)}>
                <VStack align='start' spacing={4} p={4} color='white'>
                    <Text fontSize='2xl' fontWeight='bold' mb={5}>Geography</Text>
                    <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
                    <VStack spacing={4} pl={25} alignItems='start' w='100%'>
                        <FormControl isInvalid={errors.office1}>
                            <FormLabel htmlFor="office1">HQ (Main Office)</FormLabel>
                            <Input id="office1" {...register("office1", { required: "This is required" })} w='95%' alignSelf='center' />
                            <FormErrorMessage>
                                {errors.office1 && errors.office1.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="office2">Office Hub 2 (Optional)</FormLabel>
                            <Input id="office2" {...register("office2")} w='95%' alignSelf='center' />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="office3">Office Hub 3 (Optional)</FormLabel>
                            <Input id="office3" {...register("office3")} w='95%' alignSelf='center' />
                        </FormControl>
                        <HStack>
                            <Button
                                colorScheme="teal"
                                isDisabled={!prevSubTab}
                                onClick={() => prevSubTab && setSelectedSubTab(prevSubTab)}
                            >
                                <Text>Back</Text>
                            </Button>
                            <Button
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type="submit"
                            >
                                <Text>Next</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        );
    }
    else if (selectedSubTab === subTabs[2]) {
        return (
            <form key={subTabs[2]} onSubmit={handleSubmit(onSubmit)}>
                <VStack align='start' spacing={4} p={4} color='white'>
                    <Text fontWeight='bold' mb={5} fontSize={{ base: 'lg', md: '2xl', lg: '3xl' }}>Medical Benefits</Text>
                    <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
                    <VStack spacing={4} pl={25} alignItems='start' w='100%'>
                        <FormControl isInvalid={errors.medical1}>
                            <FormLabel htmlFor="medical1">What percentage of health insurance premium costs does your company cover for your employees?</FormLabel>
                            {/* <Input id="medical1" {...register("medical1")} w='95%' alignSelf='center' /> */}
                            <Select id="medical1" {...register("medical1", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>Less than 25%</option>
                                <option value='1' style={{ color: 'black' }}>Between 25% and 50%</option>
                                <option value='2' style={{ color: 'black' }}>Between 50% and 75%</option>
                                <option value='3' style={{ color: 'black' }}>More than 75% but less than 100%</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.medical1 && errors.medical1.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.medical2}>
                            <FormLabel htmlFor="medical2">What percentage of dental insurance premium costs does your company cover for your employees?</FormLabel>
                            <Select id="medical2" {...register("medical2", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>Less than 25%</option>
                                <option value='1' style={{ color: 'black' }}>Between 25% and 50%</option>
                                <option value='2' style={{ color: 'black' }}>Between 50% and 75%</option>
                                <option value='3' style={{ color: 'black' }}>More than 75% but less than 100%</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.medical2 && errors.medical2.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.medical3}>
                            <FormLabel htmlFor="medical3">What percentage of vision insurance premium costs does your company cover for your employees?</FormLabel>
                            <Select id="medical3" {...register("medical3", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>We do not cover health insurance premium costs</option>
                                <option value='1' style={{ color: 'black' }}>Less than 25%</option>
                                <option value='2' style={{ color: 'black' }}>Between 25% and 50%</option>
                                <option value='3' style={{ color: 'black' }}>Between 50% and 75%</option>
                                <option value='4' style={{ color: 'black' }}>More than 75% but less than 100%</option>
                                <option value='5' style={{ color: 'black' }}>100%</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.medical3 && errors.medical3.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.medical4}>
                            <FormLabel htmlFor="medical4">Does your company cover dependents (spouse, children) under its medical insurance plan?</FormLabel>
                            <Select id="medical4" {...register("medical4", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>No</option>
                                <option value='1' style={{ color: 'black' }}>Yes</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.medical4 && errors.medical4.message}
                            </FormErrorMessage>
                        </FormControl>
                        <HStack>
                            <Button
                                colorScheme="teal"
                                isDisabled={!prevSubTab}
                                onClick={() => prevSubTab && setSelectedSubTab(prevSubTab)}
                            >
                                <Text>Back</Text>
                            </Button>
                            <Button
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type="submit"
                            >
                                <Text>Next</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        );
    }
    else if (selectedSubTab === subTabs[3]) {
        return (
            <form key={subTabs[3]} onSubmit={handleSubmit(onSubmit)}>
                <VStack align='start' spacing={4} p={4} color='white'>
                    <Text fontWeight='bold' mb={5} fontSize={{ base: 'lg', md: '2xl', lg: '3xl' }}>Paid Time Off</Text>
                    <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
                    <VStack spacing={4} pl={25} alignItems='start' w='100%'>
                        <FormControl isInvalid={errors.pto1}>
                            <FormLabel htmlFor="pto1">How many days of paid time off (PTO) are new employees entitled to annually?</FormLabel>
                            {/* <Input id="medical1" {...register("medical1")} w='95%' alignSelf='center' /> */}
                            <Select id="pto1" {...register("pto1", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>We do not offer PTO</option>
                                <option value='0' style={{ color: 'black' }}>We do not offer PTO</option>
                                <option value='1' style={{ color: 'black' }}>Less than 10 days</option>
                                <option value='2' style={{ color: 'black' }}>10-15 days</option>
                                <option value='3' style={{ color: 'black' }}>16-20 days</option>
                                <option value='4' style={{ color: 'black' }}>21-25 days</option>
                                <option value='5' style={{ color: 'black' }}>26-30 days</option>
                                <option value='6' style={{ color: 'black' }}>31-35 days</option>
                                <option value='7' style={{ color: 'black' }}>Unlimited; practically accceptable to take more than 35 days. </option>
                            </Select>
                            <FormErrorMessage>
                                {errors.pto1 && errors.pto1.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.pto2}>
                            <FormLabel htmlFor="pto2">How is PTO accrued at your company?</FormLabel>
                            <Select id="pto2" {...register("pto2", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>Provided in a lump sum at the start of the year</option>
                                <option value='1' style={{ color: 'black' }}>Accrued on a monthly basis</option>
                                <option value='2' style={{ color: 'black' }}>Accrued on a weekly basis</option>
                                <option value='3' style={{ color: 'black' }}>Accrued based on hours worked</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.pto2 && errors.pto2.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.pto3}>
                            <FormLabel htmlFor="pto3">Are there any restrictions on when PTO can be taken?</FormLabel>

                            <Select id="pto3" {...register("pto3", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>No restrictions, PTO can be taken anytime</option>
                                <option value='1' style={{ color: 'black' }}>Yes, certain periods are blackout dates for PTO</option>
                                <option value='2' style={{ color: 'black' }}>Yes, PTO needs to be taken within specific periods</option>
                                <option value='3' style={{ color: 'black' }}>Yes, approval of PTO depends on team availability and workload</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.pto3 && errors.pto3.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.pto4}>
                            <FormLabel htmlFor="pto4">What is your company's maternity / paternity leave policy?</FormLabel>
                            <Select id="pto4" {...register("pto4", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>No specific maternity/paternity leave policy, parental leave falls under general PTO</option>
                                <option value='1' style={{ color: 'black' }}>1-6 weeks of paid leave</option>
                                <option value='2' style={{ color: 'black' }}>7-12 weeks of paid leave</option>
                                <option value='3' style={{ color: 'black' }}>13-18 weeks of paid leave</option>
                                <option value='4' style={{ color: 'black' }}>More than 18 weeks of paid leave</option>
                                <option value='5' style={{ color: 'black' }}>Unpaid leave options available</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.pto4 && errors.pto4.message}
                            </FormErrorMessage>
                        </FormControl>
                        <HStack>
                            <Button
                                colorScheme="teal"
                                isDisabled={!prevSubTab}
                                onClick={() => prevSubTab && setSelectedSubTab(prevSubTab)}
                            >
                                <Text>Back</Text>
                            </Button>
                            <Button
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type="submit"
                            >
                                <Text>Next</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        );
    }
    else if (selectedSubTab === subTabs[4]) {
        return (
            <form key={subTabs[4]} onSubmit={handleSubmit(saveEmployerProfile)}>
                <VStack align='start' spacing={4} p={4} color='white' >
                    <Text fontWeight='bold' mb={5} fontSize={{ base: 'lg', md: '2xl', lg: '3xl' }}>401k and Savings</Text>
                    <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
                    <VStack spacing={4} pl={25} alignItems='start' w='100%'>
                        <FormControl isInvalid={errors.financial1}>
                            <FormLabel htmlFor="financial1">Does your company offer a 401k program for new employees?</FormLabel>
                            {/* <Input id="medical1" {...register("medical1")} w='95%' alignSelf='center' /> */}
                            <Select id="financial1" {...register("financial1", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>No</option>
                                <option value='1' style={{ color: 'black' }}>Yes</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.financial1 && errors.financial1.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.financial2}>
                            <FormLabel htmlFor="financial2">What percentage does your company match for employee 401k contributions?</FormLabel>
                            <Select id="financial2" {...register("financial2", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>We do not offer a 401k match</option>
                                <option value='1' style={{ color: 'black' }}>Less than 1%</option>
                                <option value='2' style={{ color: 'black' }}>1% - 2%</option>
                                <option value='3' style={{ color: 'black' }}>3% - 4%</option>
                                <option value='4' style={{ color: 'black' }}>5% - 6%</option>
                                <option value='5' style={{ color: 'black' }}>7% - 8%</option>
                                <option value='6' style={{ color: 'black' }}>More than 8%</option>
                                <option value='7' style={{ color: 'black' }}>We offer a full (100%) match</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.financial2 && errors.financial2.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.financial3}>
                            <FormLabel htmlFor="financial3">Does your company offer any financial assistance or reimbursement programs (e.g., tuition, certification, student loan assistance)?</FormLabel>

                            <Select id="financial3" {...register("financial3", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='1' style={{ color: 'black' }}>No, we don't offer any of these financial assistance programs.</option>
                                <option value='1' style={{ color: 'black' }}>Yes, we offer tuition reimbursement for job-related education</option>
                                <option value='2' style={{ color: 'black' }}>Yes, we offer tuition reimbursement for job-related education</option>
                                <option value='3' style={{ color: 'black' }}>Yes, we provide student loan assistance</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.financial3 && errors.financial3.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.financial4}>
                            <FormLabel htmlFor="financial4">Does your company offer a learning and development allowance? If yes, how much is it annually?</FormLabel>
                            <Select id="financial4" {...register("financial4", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>No, we do not offer a learning and development allowance.</option>
                                <option value='1' style={{ color: 'black' }}>Yes, up to $500 annually</option>
                                <option value='2' style={{ color: 'black' }}>Yes, between $500 and $1,000 annually</option>
                                <option value='3' style={{ color: 'black' }}>Yes, between $1,000 and $2,000 annually</option>
                                <option value='3' style={{ color: 'black' }}>Yes, over $2,000 annually</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.financial4 && errors.financial4.message}
                            </FormErrorMessage>
                        </FormControl>
                        <HStack>
                            <Button
                                colorScheme="teal"
                                isDisabled={!prevSubTab}
                                onClick={() => prevSubTab && setSelectedSubTab(prevSubTab)}
                            >
                                <Text>Back</Text>
                            </Button>
                            <Button
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type="submit"
                            // onClick={saveEmployerProfile}
                            >
                                <Text>Save</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </VStack>
            </form>
        );
    }
    else {
        return <Box>Something went wrong. Try reloading</Box>;
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
    const { colorMode, toggleColorMode } = useColorMode();
    const [selectedTab, setSelectedTab] = useState("Employer Profile");
    const [selectedSubTab, setSelectedSubTab] = useState('Company Info');
    const [userInfo, setUserInfo] = useState({
        'website': 'test', 'testItem'
            : 'test123', 'name': 'abc'
    });


    return (
        <Box className='EmployerProfile'
            bg='#051672'
            display='flex'
            flexDirection='column'
            minHeight='100vh'>
            <Box bg='#051672' display='flex' justifyContent='space-between' alignItems='end' padding='1.5rem' borderBottom='1px solid gray'>
                < Box display='flex' alignItems='baseline' p={0} >
                    <ChakraLink as={RouterLink} to="/employer" style={{ textDecoration: 'none' }} display='inline-flex' alignItems='baseline'>
                        <Text fontSize={{ base: '3xl', md: '3xl', lg: '3xl' }} fontWeight='700' fontFamily='Poppins' color='#FAD156'>Goldfish</Text>
                        <Text ml={3} fontSize={{ base: '1xl', md: '1xl', lg: '1xl' }} fontWeight='700' fontFamily='Poppins' color='#FFFFFF'>ai</Text>
                    </ChakraLink>
                </Box >
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
            </Box >
            <Flex
                as='main'
                justifyContent='center'
                mt={5}
                bg='#051672'
                flex='1 1 auto' // This allows the main content area to grow and shrink as necessary
            >
                <Box flexBasis='15%' minWidth='15%'>
                    <VStack spacing='6%' alignItems='center' pt={6}>
                        <Button
                            w='80%'
                            variant={selectedTab === "Employer Profile" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Employer Profile")}
                            fontSize={{ base: 'xs', md: 'md', lg: 'lg' }}
                            whiteSpace={'normal'}
                            p={6}
                        >
                            <Text>Employer Profile</Text>
                        </Button>
                        <Button
                            // Make the button text wrap
                            w='80%'
                            variant={selectedTab === "Job Postings" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Job Postings")}
                            fontSize={{ base: 'xs', md: 'md', lg: 'lg' }}
                            whiteSpace={'normal'}
                            p={6}
                        >
                            <Text p={5}>Job Postings</Text>
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Account Settings" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Account Settings")}
                            fontSize={{ base: 'xs', md: 'md', lg: 'lg' }}
                            whiteSpace={'normal'}
                            p={6}
                        >
                            <Text>Account Settings</Text>
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Matches" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Matches")}
                            fontSize={{ base: 'xs', md: 'md', lg: 'lg' }}
                            p={6}
                        >
                            <Text > Matches</Text>
                        </Button>
                    </VStack>
                </Box>
                <Spacer bg='gray' boxSize='1px' />
                <Box flexBasis='25%' minWidth='25%'>
                    {selectedTab === 'Employer Profile' && <EmployerProfileBuilderContent selectedSubTab={selectedSubTab} setSelectedSubTab={setSelectedSubTab} />}
                    {selectedTab === 'Job Postings' && <JobPostingsContent />}
                    {selectedTab === 'Account Settings' && <AccountSettingsContent />}
                    {selectedTab === 'Matches' && <MatchesContent />}
                </Box>
                <Spacer bg='gray' boxSize='1px' />
                <Box flexBasis='60%' >
                    {selectedTab === 'Employer Profile' && <EmployerProfileBuilderRightContent
                        selectedSubTab={selectedSubTab}
                        setSelectedSubTab={setSelectedSubTab}
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                    />}
                    {selectedTab === 'Job Postings' && <JobPostingsRightContent />}
                    {selectedTab === 'Account Settings' && <AccountSettingsRightContent />}
                    {selectedTab === 'Matches' && <MatchesRightContent />}
                </Box>
            </Flex>
        </Box >
    );
};

export default EmployerProfile;