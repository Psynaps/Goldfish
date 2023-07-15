import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Flex, HStack, Button, Spacer, Select, VStack, Text, Avatar, Spinner, Circle, Divider, useColorMode, FormControl, FormLabel, Input, FormErrorMessage, } from '@chakra-ui/react';
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
// import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './LoginButton';
import './App.css';
import DropdownMenu from './DropdownMenu';

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
            minWidth='80%'
            alignSelf='center'
            variant='unstyled'
            onClick={() => setSelectedSubTab(tabName)}
            mb={2}
            _hover={{ bg: 'none' }}
            _active={{ bg: 'none' }}
            color='white'
        // flexBasis='80%'
        >
            <Flex
                alignItems='center'
                flexDirection={'row'}
            >
                <VStack alignItems='flex-start' textAlign={'left'} spacing={1} whiteSpace={'normal'} >
                    <Text fontWeight='bold' fontSize={['2xs', 'xs', 'sm', 'md']}>{title}</Text>
                    <Text fontSize={['3xs', '2xs', 'xs',]}>{secondaryText}</Text>
                </VStack>
                <Spacer />
                <Circle size={[6, 8]} border="2px" borderColor='green.400' bg={selectedSubTab === tabName ? 'green.400' : 'transparent'} />
            </Flex>
        </Box >
    );

    return (
        <VStack align='start' spacing={4} p={4} color='white'>
            <Text fontSize={['md', 'lg', 'xl', '2xl']} fontWeight='bold' mb={1}
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
    setUserInfo,
    apiURL,
    companyLogo,
    setCompanyLogo,
}) => {

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
        reset // reset method from useForm to update defaultValues
    } = useForm({ userInfo });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const { isAuthenticated, user } = useAuth0();
    const [canSubmit, setCanSubmit] = useState(false);
    const watchLogo = watch('logo', []);



    const currentIndex = subTabs.indexOf(selectedSubTab);
    const nextSubTab = currentIndex < subTabs.length - 1 ? subTabs[currentIndex + 1] : null;
    const prevSubTab = currentIndex > 0 ? subTabs[currentIndex - 1] : null;
    const requiredFields = ['companyname', 'website', 'companysize', 'producttype',
        'office1',
        'medical1', 'medical2', 'medical3', 'medical4', 'medical5',
        'pto1', 'pto2', 'pto3', 'pto4',
        'financial1', 'financial2', 'financial3', 'financial4'];

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
        // console.log('saving employer profile...');
        // console.log('userInfo:', userInfo);
        sendSaveEmployerProfile(newUserInfo);

    };
    const sendSaveEmployerProfile = useCallback((newUserInfo) => {
        setIsSavingProfile(true);
        console.log('trying to save employer profile', newUserInfo);

        // Create FormData to send files
        const formData = new FormData();

        // If there's a file, add it to the FormData
        if (newUserInfo.logo && newUserInfo.logo.length > 0) {
            formData.append("logo", newUserInfo.logo[0]);
        }

        // Convert the rest of the userInfo into a JSON string and add it to the FormData
        const userInfoWithoutLogo = { ...newUserInfo };
        delete userInfoWithoutLogo.logo;
        // formData.append("userInfo", JSON.stringify(userInfoWithoutLogo));

        for (let key in userInfoWithoutLogo) {
            formData.append(key, userInfoWithoutLogo[key]);
        }

        formData.append("userID", user.sub);

        // console.log('formData:', formData);

        fetch(`${apiURL}/saveEmployerProfile`, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`status ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                // setLogo(json.img);
                // console.log('logo:', json.companyLogo);
                setCompanyLogo(json.companyLogo);
                // console.log('logo:', logo);
                setIsSavingProfile(false);
            }).catch(e => {
                console.error(e); // This will log any errors to the console.
                setIsSavingProfile(false);
            });
    }, [user, apiURL, setCompanyLogo]);

    const imageValidationRule = {
        validate: async (fileList) => {
            const file = fileList[0];
            if (file) {
                if (file.size > 2097152) {
                    return 'File size must be less than 2MB';
                } else {
                    const acceptableImageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
                    const extension = file.name.split('.').pop().toLowerCase();
                    if (!acceptableImageTypes.includes(extension)) {
                        return 'Invalid file type. Only .jpg, .jpeg, .png, .gif, and .webp are accepted';
                    }
                }
            }
            return true;
        }
    };

    useEffect(() => {
        // console.log('userinfo', userInfo);
        reset(userInfo);

    }, [userInfo, reset]);

    useEffect(() => {
        // Loop through all required fields before the last page, so excluding financial1-4,
        // from the form and check if they are filled in to userInfo.
        // If they are not then set canSubmit to false. Otherwise set it to true.
        // console.log('checking canSubmit', canSubmit);
        for (let i = 0; i < requiredFields.length - 4; i++) {
            if (!hasFieldFilled(userInfo, requiredFields[i])) {
                setCanSubmit(false);
                // console.log('set canSubmit: false');
                return;
            }
        }
        setCanSubmit(true);
        // console.log('set canSubmit: true');
    }, [userInfo]);

    useEffect(() => {
        const file = watchLogo[0];
        if (file) {
            if (file.size > 2097152) { // File size less than 2MB
                setError("logo", { type: "manual", message: "File size must be less than 2MB" });
            } else {
                const acceptableImageTypes = ["jpg", "jpeg", "png", "gif", "webp"]; // you can add more types if needed
                const extension = file.name.split('.').pop().toLowerCase();
                if (!acceptableImageTypes.includes(extension)) {
                    setError("logo", { type: "manual", message: "Invalid file type. Only .jpg, .jpeg, .png, .gif, and .webp are accepted" });
                }
            }
        }
    }, [watchLogo, setError]);




    const hasFieldFilled = (userInfo, field) => {
        if (userInfo[field] === undefined || userInfo[field] === null || userInfo[field] === '') {
            return false;
        }
        return true;
    };

    if (selectedSubTab === subTabs[0]) {
        return (
            <form key={subTabs[0]} onSubmit={handleSubmit(onSubmit)}>
                <VStack align='start' spacing={4} p={4} color='white'>
                    <Text fontSize={['md', 'lg', 'xl', '2xl']} fontWeight='bold' mb={5}>Basic info</Text>
                    <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
                    <VStack spacing={4} pl={['5', '15', '25']} alignItems='start' w='100%'>
                        <FormControl isInvalid={errors.companyname}>
                            {/* {companyLogo && <Avatar src={`data:image/png;base64,${companyLogo}`} alt='Profile' borderRadius='full' boxSize={45} />} */}
                            <FormLabel htmlFor="companyname">Company Name or DBA</FormLabel>
                            <Input id="companyname" {...register("companyname", { required: "This is required" })} w='95%' alignSelf='center' />
                            <FormErrorMessage>
                                {errors.companyname && errors.companyname.message}
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
                        <FormControl isInvalid={errors.companysize}>
                            <FormLabel htmlFor="companysize">Considering the continuum from early-stage startups to established corporations, how would you describe your organization?</FormLabel>
                            <Select id="companysize" {...register("companysize", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>Early-Stage Startup: We're still in the process of setting up structures and processes, and innovation is our driving force</option>
                                <option value='1' style={{ color: 'black' }}>Mid-Stage Startup: We have some established structures and processes, but we are still highly dynamic and focused on growth and innovation</option>
                                <option value='2' style={{ color: 'black' }}>Growth Stage Company: We have a good balance between established processes and the agility needed for growth and adaptation</option>
                                <option value='3' style={{ color: 'black' }}>Established Company: We have well-defined roles and processes, and value stability and predictability</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.companysize && errors.companysize.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.producttype}>
                            <FormLabel htmlFor="producttype">Which most accurately describes the type of product your company sells?</FormLabel>
                            <Select id="producttype" {...register("producttype", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='1' style={{ color: 'black' }}>Business Intelligence (BI)</option>
                                <option value='2' style={{ color: 'black' }}>Cybersecurity</option>
                                <option value='3' style={{ color: 'black' }}>Data Analytics / Big Data</option>
                                <option value='4' style={{ color: 'black' }}>Customer Relationship Management (CRM)</option>
                                <option value='5' style={{ color: 'black' }}>Advertising Technology</option>
                                <option value='6' style={{ color: 'black' }}>DevOps and Cloud Infrastructure</option>
                                <option value='7' style={{ color: 'black' }}>Human Resource Management (HRM)</option>
                                <option value='0' style={{ color: 'black' }}>Other</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.producttype && errors.producttype.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.logo}>
                            <FormLabel htmlFor="logo">Logo Upload</FormLabel>
                            <Input type="file" id="logo" accept="image/*" {...register("logo", imageValidationRule)} w='95%' p={2} alignSelf='center' />
                            {errors.logo && <FormErrorMessage>{errors.logo.message}</FormErrorMessage>}
                        </FormControl>
                        <HStack>
                            <Button
                                colorScheme="teal"
                                isDisabled={currentIndex === 0}
                                onClick={() => prevSubTab && setSelectedSubTab(prevSubTab)}
                                variant='ghost'
                            >
                                <Text>Back</Text>
                            </Button>
                            <Button
                                bg="#5DFC89"
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
                                variant='ghost'
                            >
                                <Text>Back</Text>
                            </Button>
                            <Button
                                bg="#5DFC89"
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
                                <option value='0' style={{ color: 'black' }}>No, we do not offer coverage for dependents</option>
                                <option value='1' style={{ color: 'black' }}>Yes, we offer dependent coverage, but the employee is responsible for 100% of the premium costs for dependents</option>
                                <option value='1' style={{ color: 'black' }}>Yes, we cover a portion of the premium costs for dependents. The employee is responsible for the remainder</option>
                                <option value='1' style={{ color: 'black' }}>Yes, we cover 100% of the premium costs for dependents</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.medical4 && errors.medical4.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.medical5}>
                            <FormLabel htmlFor="medical5"> Does your company provide life insurance benefits to its employees? If yes, how would you characterize the coverage?</FormLabel>
                            <Select id="medical5" {...register("medical5", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>No Coverage: We do not offer life insurance benefits to our employees</option>
                                <option value='1' style={{ color: 'black' }}>Basic Coverage: We offer life insurance that covers the employee for an amount equivalent to their annual salary</option>
                                <option value='2' style={{ color: 'black' }}>Enhanced Coverage: We offer life insurance that covers the employee for an amount equivalent to double their annual salary</option>
                                <option value='3' style={{ color: 'black' }}>Premium Coverage: We offer life insurance that covers the employee for an amount equivalent to triple their annual salary or more</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.medical5 && errors.medical5.message}
                            </FormErrorMessage>
                        </FormControl>
                        <HStack>
                            <Button
                                colorScheme="teal"
                                isDisabled={!prevSubTab}
                                onClick={() => prevSubTab && setSelectedSubTab(prevSubTab)}
                                variant='ghost'
                            >
                                <Text>Back</Text>
                            </Button>
                            <Button
                                bg="#5DFC89"
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
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
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
                                <option value='0' style={{ color: 'black' }}>Start from Zero: Employees start with zero PTO and earn more with each pay period</option>
                                <option value='1' style={{ color: 'black' }}>Baseline Accrual: Employees start with a set amount of PTO and accrue more throughout their tenure </option>
                                <option value='2' style={{ color: 'black' }}>All up front: Employees receive all PTO for the year at the start of their employment</option>
                                <option value='3' style={{ color: 'black' }}>Unlimited: We have an unlimited PTO policy; this question does not apply</option>
                            </Select>
                            <FormErrorMessage>
                                {errors.pto2 && errors.pto2.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.pto3}>
                            <FormLabel htmlFor="pto3">What restrictions, if any, apply to new employees taking Paid Time Off (PTO)?</FormLabel>

                            <Select id="pto3" {...register("pto3", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>No Restrictions: New employees can take PTO at any time, without restrictions</option>
                                <option value='1' style={{ color: 'black' }}>Holiday Blackout Dates: New employees cannot take PTO during major holidays</option>
                                <option value='2' style={{ color: 'black' }}>Seasonal Peak Business Blackout Dates: New employees cannot take PTO during our peak business seasons</option>
                                <option value='3' style={{ color: 'black' }}>Holiday and Peak Business Blackout Dates: New employees cannot take PTO during major holidays or our peak business seasons</option>
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
                                <option value='0' style={{ color: 'black' }}>No Paid Leave</option>
                                <option value='1' style={{ color: 'black' }}>Up to 2 Weeks Paid Leave</option>
                                <option value='2' style={{ color: 'black' }}>3-4 Weeks Paid Leave</option>
                                <option value='3' style={{ color: 'black' }}>5-8 Weeks Paid Leave</option>
                                <option value='4' style={{ color: 'black' }}>9-12 Weeks Paid Leave</option>
                                <option value='5' style={{ color: 'black' }}>More than 12 Weeks Paid Leave</option>
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
                                variant='ghost'
                            >
                                <Text>Back</Text>
                            </Button>
                            <Button
                                bg="#5DFC89"
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type="submit"
                            // key={userInfo.length}
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
                            <FormLabel htmlFor="financial1">Does your company offer a 401k program? </FormLabel>
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
                            <FormLabel htmlFor="financial3">What is the annual dollar amount of student loan reimbursement your company offers?</FormLabel>

                            <Select id="financial3" {...register("financial3", { required: "This is required" })} w='95%' alignSelf='center'
                                defaultValue={""}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select your option</option>
                                <option value='0' style={{ color: 'black' }}>No Assistance</option>
                                <option value='1' style={{ color: 'black' }}>$1 - $500</option>
                                <option value='2' style={{ color: 'black' }}>$501 - $1,000</option>
                                <option value='3' style={{ color: 'black' }}>$1,001 - $2,000</option>
                                <option value='4' style={{ color: 'black' }}>$2,001 - $3,000</option>
                                <option value='5' style={{ color: 'black' }}>$3000+ </option>
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
                                <option value='0' style={{ color: 'black' }}>No Allowance</option>
                                <option value='1' style={{ color: 'black' }}>$1 - $500</option>
                                <option value='2' style={{ color: 'black' }}>$501 - $1,000</option>
                                <option value='3' style={{ color: 'black' }}>$1,001 - $2,000</option>
                                <option value='4' style={{ color: 'black' }}>$2,001 - $3,000</option>
                                <option value='5' style={{ color: 'black' }}>$3000+ </option>
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
                                variant={(canSubmit) ? 'ghost' : 'solid'}
                            >
                                <Text>Back</Text>
                            </Button>
                            {(isAuthenticated) && <Button //Shoudl redo this with disabled styling for the button instead of these conditionals
                                // bg="#5DFC89"
                                key={userInfo.length}
                                bg={(canSubmit) ? '#5DFC89' : 'grey'}
                                colorScheme={(canSubmit) ? 'teal' : 'grey'}
                                isLoading={isSubmitting}
                                type="submit"
                                isDisabled={!canSubmit}
                            // onClick={saveEmployerProfile}
                            >

                                <Text>Complete Profile</Text>
                            </Button>}
                            {(!isAuthenticated) && <Button isDisabled colorScheme='teal' width='auto'>
                                <Text p={4}>Log in to Save</Text>
                            </Button>}
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

function JobPostingsContent({ selectedJobListing, setSelectedJobListing, jobs, setJobs }) {
    const JobListingButton = ({ title, secondaryText, jobPostingID }) => (
        <Box
            as="button"
            w='80%'
            minWidth='80%'
            alignSelf='center'
            variant='unstyled'
            onClick={() => setSelectedJobListing(jobPostingID)}
            mb={2}
            _hover={{ bg: 'none' }}
            _active={{ bg: 'none' }}
            color='white'
        // flexBasis='80%'
        >
            <Flex
                alignItems='center'
                flexDirection={'row'}
            >
                <VStack alignItems='flex-start' textAlign={'left'} spacing={1} whiteSpace={'normal'} >
                    <Text fontWeight='bold' fontSize={['2xs', 'xs', 'sm', 'md']}>{title}</Text>
                    <Text fontSize={['3xs', '2xs', 'xs',]}>{secondaryText}</Text>
                </VStack>
                <Spacer />
                <Circle size={[6, 8]} border={selectedJobListing == jobPostingID ? '3px' : 0} borderColor='black' bg={(jobs && jobs[jobPostingID]?.active) ? 'green' : 'orange'} />
            </Flex>
        </Box >
    );

    return (
        <VStack align='start' spacing={4} p={4} color='white'>
            <Text fontSize={['md', 'lg', 'xl', '2xl']} fontWeight='bold' mb={1}
            // alignSelf='center'
            >
                Job Listings
            </Text>
            <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
            {jobs && jobs?.map((job) => <JobListingButton key={job.jobPostingID} title={job.title} secondaryText={job.dateCreated} tabName={job.jobPostingID} />)}
            <JobListingButton key={-1} title={'+'} secondaryText={''} tabName={-1} />
        </VStack>
    );
}

function JobPostingsRightContent(apiURL, selectedJobListing, jobs, setJobs) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        reset // reset method from useForm to update defaultValues
    } = useForm({});
    const [isSaving, setIsSaving] = useState(false);
    const { isAuthenticated, user } = useAuth0();

    const onSubmit = (data) => {
        setIsSaving(true);
        const newj = {};
        const newJob = (selectedJobListing == -1) ?
            { jobPostingID: -1, dateCreated: new Date().toLocaleDateString(), ...data } :
            { ...jobs[selectedJobListing], ...data };
        // newJobs = jobs.map((job) => { job.jobPostingID == selectedJobListing ? newJob : job; });
        let newJobs = { ...jobs };
        newJobs[selectedJobListing] = newJob;
        setJobs(newJobs);
        console.log('formData:', data);
        console.log('jobs:', jobs);
        sendSaveJobPosting(newJob);

    };

    const sendSaveJobPosting = useCallback((newJob) => {
        setIsSaving(true);
        console.log('trying to post job info', newJob);

        // Create FormData to send files
        const formData = new FormData();

        // Loop through all properties of newJob object and append to formData
        for (const property in newJob) {
            formData.append(property, newJob[property]);
        }
        formData.append("userID", user.sub);

        // console.log('formData:', formData);

        fetch(`${apiURL}/postJobInfo`, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`status ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                setIsSaving(false);
            }).catch(e => {
                console.error(e); // This will log any errors to the console.
                setIsSaving(false);
            });
    }, [user, apiURL, setIsSaving]);
    return (
        <form key={subTabs[0]} onSubmit={handleSubmit(onSubmit)}>
            <VStack align='start' spacing={4} p={4} color='white'>
                <Text fontSize={['md', 'lg', 'xl', '2xl']} fontWeight='bold' mb={5}>Core Information</Text>
                <Divider mb={5} borderColor='gray.400' borderStyle='dashed' />
                <VStack spacing={4} pl={['5', '15', '25']} alignItems='start' w='100%'>
                    <FormControl isInvalid={errors.jobTitle}>
                        {/* {companyLogo && <Avatar src={`data:image/png;base64,${companyLogo}`} alt='Profile' borderRadius='full' boxSize={45} />} */}
                        <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
                        <Input id="jobTitle" {...register("jobTitle", { required: "This is required" })} w='95%' alignSelf='center' />
                        <FormErrorMessage>
                            {errors.jobTitle && errors.jobTitle.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.salaryBase}>
                        <FormLabel htmlFor="salaryBase">Salary Base</FormLabel>
                        <Input id="salaryBase" {...register("salaryBase", { required: "This is required" })} w='95%' alignSelf='center' />
                        <FormErrorMessage>
                            {errors.salaryBase && errors.salaryBase.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.salaryOTE}>
                        <FormLabel htmlFor="salaryOTE">Annual Salary at 100% OTE</FormLabel>
                        <Input id="salaryOTE" {...register("salaryOTE", { required: "This is required" })} w='95%' alignSelf='center' />
                        <FormErrorMessage>
                            {errors.salaryOTE && errors.salaryOTE.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.oteValue}>
                        <FormLabel htmlFor="oteValue">$ Value of 100% OTE Attainment</FormLabel>
                        <Input id="oteValue" {...register("oteValue", { required: "This is required" })} w='95%' alignSelf='center' />
                        <FormErrorMessage>
                            {errors.oteValue && errors.oteValue.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.homeOfficeAddress}>
                        <FormLabel htmlFor="homeOfficeAddress">Home Office Address</FormLabel>
                        <Input id="homeOfficeAddress" {...register("homeOfficeAddress", { required: "This is required" })} w='95%' alignSelf='center' />
                        <FormErrorMessage>
                            {errors.homeOfficeAddress && errors.homeOfficeAddress.message}
                        </FormErrorMessage>
                    </FormControl>

                    <Button
                        bg="#5DFC89"
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        type="submit"
                    >
                        <Text>Save</Text>
                    </Button>
                </VStack>
            </VStack>
        </form>
    );
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
    const { isAuthenticated, isLoading, user } = useAuth0();
    // const { colorMode, toggleColorMode } = useColorMode();
    const [selectedTab, setSelectedTab] = useState("Employer Profile");
    const [selectedSubTab, setSelectedSubTab] = useState('Company Info');
    const [userInfo, setUserInfo] = useState({});
    const [companyLogo, setCompanyLogo] = useState(null);
    const [jobs, setJobs] = useState({});

    const [apiURL] = useState((window.location.href.includes('localhost')) ? 'http://localhost:8080/api' : 'https://goldfishai-website.herokuapp.com/api');

    // Function getEmployerProfile will be called when the component mounts and will retrieve the user's 
    // employer profile from the database using an api call to /api/getEmployerProfile
    // If the user does not have an employer profile, the function will return an empty object
    // If it does return an employer profile, the function will set the userInfo state variable to the employer profile
    // the function also sets the companyLogo state variable to the employer profile's logo
    async function getEmployerProfile() {
        if (!user) {
            console.log('no user');
            setUserInfo({}); //Maybe not wanted
            return;
        }
        try {
            const response = await axios.get(`${apiURL}/getEmployerProfile?userid=${user.sub}`);
            if (response.data) {
                const { companylogo, ...otherData } = response.data;
                setUserInfo(otherData);
                setCompanyLogo(companylogo);
                // console.log('employer profile retrieved');
                // console.log('userInfo: ', otherData);
                // console.log('companyLogo: ', companyLogo);
            }
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(() => {
        getEmployerProfile();
    }, [user]);


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
                            {isAuthenticated ?
                                <>
                                    {companyLogo && <Avatar src={`data:image/png;base64,${companyLogo}`} alt='Profile' borderRadius='full' boxSize={45} />}
                                    <VStack spacing={1} alignItems='center'>
                                        <Avatar src={user.picture} name={user.name} alt='Profile' borderRadius='full' boxSize={45} />
                                        <Box bg='#FAD156' borderRadius='full' px={2}>
                                            <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} color='black'>{user.name}</Text>
                                        </Box>
                                    </VStack>
                                </>
                                : <LoginButton redirectURL={''} />}
                            <DropdownMenu returnURL={window.location.href.substring(0, window.location.href.indexOf('/profile'))} />
                        </>
                    }
                </HStack>
            </Box >
            {isAuthenticated && <Flex
                as='main'
                justifyContent='center'
                mt={5}
                bg='#051672'
                flex='1 1 auto' // This allows the main content area to grow and shrink as necessary
            >
                <Box flexBasis='15%' minWidth='15%'>
                    <VStack spacing={[2, 4, 6]} alignItems='center' pt={[2, 4, 6]}>
                        <Button
                            w='80%'
                            variant={selectedTab === "Employer Profile" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Employer Profile")}
                            fontSize={['2xs', 'xs', 'sm', 'md', 'lg']}
                            whiteSpace={'normal'}
                            p={[2, 4, 6]}
                        >
                            <Text>Employer Profile</Text>
                        </Button>
                        <Button
                            // Make the button text wrap
                            w='80%'
                            variant={selectedTab === "Job Postings" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Job Postings")}
                            fontSize={['2xs', 'xs', 'sm', 'md', 'lg']}
                            whiteSpace={'normal'}
                            p={[2, 4, 6]}
                        >
                            <Text p={5}>Job Postings</Text>
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Account Settings" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Account Settings")}
                            fontSize={['2xs', 'xs', 'sm', 'md', 'lg']}
                            whiteSpace={'normal'}
                            p={[2, 4, 6]}
                        >
                            <Text>Account Settings</Text>
                        </Button>
                        <Button
                            w='80%'
                            variant={selectedTab === "Matches" ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => setSelectedTab("Matches")}
                            fontSize={['2xs', 'xs', 'sm', 'md', 'lg']}
                            p={[2, 4, 6]}
                        >
                            <Text > Matches</Text>
                        </Button>
                    </VStack>
                </Box>
                <Box w='1px' bg='gray' />
                <Box flexBasis='25%' minWidth='25%'>
                    {selectedTab === 'Employer Profile' && <EmployerProfileBuilderContent selectedSubTab={selectedSubTab} setSelectedSubTab={setSelectedSubTab} />}
                    {selectedTab === 'Job Postings' && <JobPostingsContent />}
                    {selectedTab === 'Account Settings' && <AccountSettingsContent />}
                    {selectedTab === 'Matches' && <MatchesContent />}
                </Box>
                <Spacer bg='gray' boxSize='10px' />
                <Box w='1%' bg='gray' />
                <Box flexBasis='60%' >
                    {selectedTab === 'Employer Profile' && <EmployerProfileBuilderRightContent
                        selectedSubTab={selectedSubTab}
                        setSelectedSubTab={setSelectedSubTab}
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                        apiURL={apiURL}
                        companyLogo={companyLogo}
                        setCompanyLogo={setCompanyLogo}
                    />}
                    {selectedTab === 'Job Postings' && <JobPostingsRightContent
                        apiURL={apiURL}
                        jobs={jobs}
                        setJobs={setJobs}
                    />}
                    {selectedTab === 'Account Settings' && <AccountSettingsRightContent />}
                    {selectedTab === 'Matches' && <MatchesRightContent />}
                </Box>
            </Flex>}
            {!isAuthenticated && <Flex p={4}><Text color='white' fontSize={{ base: 'lg', md: '2xl', lg: '3xl' }}>Please login to continue</Text></Flex>}
        </Box >
    );
};

export default EmployerProfile;