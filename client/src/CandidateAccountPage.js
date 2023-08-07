import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
	Stack, Box, Text, Circle, Switch, HStack, VStack, Flex, Heading, Button, Icon, Spacer,
	AlertDialog, AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useDisclosure,
} from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { LoginButton } from './LoginButton';
// import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useDropzone } from "react-dropzone";

// TODO: add suspended field to user account and propagate user suspension if needed to tables

export const CandidateAccountPage = (apiURL, userProfile, hasLoadedProfile) => {
	const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
	const [subscribed, setSubscribed] = useState(false);
	const [emailNewJobRecs, setEmailNewJobRecs] = useState(false);
	const [suspended, setSuspended] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef();
	const [resume, setResume] = useState(null);



	const changeSubscription = async (item, user, email, subscribing) => {
		try {
			const payload = {
				user_id: user ? user.sub : null,
				email: email ? email : '',
				subscribing: subscribing,
			};

			let response;
			if (item == 'newJobRecs') {
				response = await axios.post(`${apiURL}/changeEmailNewJobRecsSubscription`, payload);
			}
			else if (item == 'newsletter') {
				response = await axios.post(`${apiURL}/changeNewsletterSubscription`, payload);
			}
			else if (item == 'suspended') {
				const suspendingPayload = {
					user_id: user ? user.sub : null,
					email: email ? email : '',
					suspended: subscribing,
				};
				response = await axios.post(`${apiURL}/changeSuspendedStatus`, suspendingPayload);
			}
			else {
				console.log('Invalid call to change subscription');
			}

			if (response.data.success) {
				console.log('Subscription status updated, ', item);
			}
		} catch (error) {
			console.error('Error updating subscription:', error);
		}
	};


	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			'application/pdf': ['.pdf'],
			'application/msword': ['.doc'],
		},
		maxFiles: 1,
		onDrop: acceptedFiles => {
			setResume(acceptedFiles[0]);
		},
	});

	const handleEmailNewJobsChange = (event) => {
		if (user && isAuthenticated) {
			setEmailNewJobRecs(event.target.checked);
			changeSubscription('newJobRecs', user.sub, user.email, event.target.checked);
		}
	};

	const handleNewsletterSubscribedChange = (event) => {
		if (user && isAuthenticated) {
			setSubscribed(event.target.checked);
			changeSubscription('newsletter', user.sub, user.email, event.target.checked);
		}
	};

	const handleSuspendedChange = (event) => {
		if (user && isAuthenticated) {
			setSuspended(event.target.checked);
			changeSubscription('suspended', user.sub, user.email, event.target.checked);
		}
	};


	const deleteAccount = () => {
		if (user && isAuthenticated) {
			axios.post(`${apiURL}/deleteUserAccount`, {
				user_id: user.user_id
			})
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const deleteJobPosting = useCallback(() => {
		setIsDeleting(true);
		console.log('Trying to delete job posting');

		axios.delete(`${apiURL}/deleteAccount`, {
			data: { user_id: user.sub }
		})
			.then(response => {
				setIsDeleting(false);
				if (response.data.success) {
					console.log('Successfully deleted account');
					onClose();
				}
				else {
					console.log('error deleting job posting:', response.data);
				}
			}).catch(e => {
				console.error(e);
				setIsDeleting(false);
				if (e.response) {
					// Conflict detected, refresh the jobs list
					console.log('Error deleting job posting:', e.response.data);
				}
			});
	}, [user, apiURL, onClose]);

	useEffect(() => {
		console.log(resume);
	}, [resume]);


	return (
		<Stack
			justify="flex-start"
			align="flex-start"
			paddingStart="64px"
			paddingEnd="32px"
			paddingTop="80px"
			spacing="64px"

			// alignSelf="stretch"
			// bg='red'
			// flex='1 1 auto'
			w='100%'
		// maxWidth='100%'
		// borderRight='5px blue solid'
		// boxSizing='border-box'
		>
			<Stack justify="flex-start" align="flex-start" spacing="20px">
				<Stack direction="row" justify="flex-start" align="flex-start">
					<Text
						fontFamily="Inter"
						lineHeight="1.2"
						fontWeight="bold"
						fontSize="30px"
						color="#FFFFFF"
					>
						Swim in the fast lane.
					</Text>
				</Stack>
				<Stack
					direction="row"
					justify="flex-start"
					align="flex-start"
					width="100%"
				// maxWidth="100%"
				>
					<Text
						fontFamily="Inter"
						lineHeight="1.2"
						fontWeight="bold"
						fontSize="20px"
						color="#F1A0FF"
					// width="411px"
					// maxWidth="100%"
					>
						Or take a breather.
					</Text>
				</Stack>
			</Stack>
			<Stack
				justify="flex-start"
				align="flex-start"
				spacing="80px" // Spacing between box and "Account settings"
				// alignSelf="stretch"
				w='100%'
			>
				<Stack
					justify="flex-start"
					align="flex-start"
					spacing="20px"
					w='100%'
				>
					<Stack direction="row" justify="flex-start" align="flex-start">
						<Text
							fontFamily="Inter"
							lineHeight="1.2"
							fontWeight="bold"
							fontSize="20px"
							color="#FFFFFF"
						>
							Resume Upload
						</Text>
					</Stack>
					<Stack
						direction="row"
						justify="flex-start"
						align="flex-start"
						w='100%'
					>
						<Text
							fontFamily="Inter"
							lineHeight="1.2"
							fontWeight="bold"
							fontSize="20px"
							color="#F1A0FF"
							maxWidth="80%"
						>
							Have your resume on file to share with matched employers.
						</Text>
					</Stack>
					<div {...getRootProps()} style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px',
						borderRadius: '7px',
						borderWidth: '1px',
						borderStyle: 'dashed',
						borderColor: '#FFFFFF',
						height: '20vh',
						width: '100%',
						background: 'rgba(255, 255, 255, 0.1)',
						cursor: 'cell'

					}} _hover={{ bg: '#ff0000' }}>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p>Drop the files here...</p>
						) : (
							<Stack
								justify="center"
								align="center"
							>
								<SmallAddIcon data-icon="CkSmallAdd" />
								<Text>Select or drop file </Text>
							</Stack>
						)}
					</div>
				</Stack>
				<Stack
					justify="flex-start"
					align="flex-start"
					spacing="36px"
					// alignSelf="stretch"
					w='100%'
				>
					<Stack
						direction="row"
						justify="space-between"
						align="flex-start"
						spacing="36px"
						// alignSelf="stretch"
						// bg='red'
						w='100%'

					>
						<Stack
							justify="flex-start"
							align="flex-start"
							spacing="12px"
							// flex="1"
							w='full'

						>
							<Stack
								paddingY="10px"
								direction="row"
								justify="flex-start"
								align="center"
							>
								<Text
									fontFamily="Inter"
									lineHeight="1.2"
									fontWeight="bold"
									fontSize="20px"
									color="#FFFFFF"
								>
									Account Settings
								</Text>
							</Stack>
							<Stack
								// paddingX="10px"
								justify="flex-start"
								align="flex-start"
								spacing="20px"
								// alignSelf="stretch"
								w='100%'
							>
								<Flex
									direction="row"
									justify="flex-start"
									align="center"
									width='100%'
								// alignSelf="stretch"
								// maxWidth="100%"
								>
									<Text
										fontFamily="Inter"
										lineHeight="1.5"
										fontWeight="regular"
										fontSize="18px"
										color="#FFFFFF"
									>
										Email me about new job recommendations.
									</Text>

									<Spacer />
									<Switch isChecked={emailNewJobRecs} size='lg' onChange={(e) => handleEmailNewJobsChange(e)} />
								</Flex>
								<Flex
									direction="row"
									justify="flex-start"
									align="center"
									width='100%'
									alignSelf="stretch"
									maxWidth="100%"
								// gap='100px'
								// spacing='20px'
								>
									<Text
										fontFamily="Inter"
										lineHeight="1.5"
										fontWeight="regular"
										fontSize="18px"
										color="#FFFFFF"
									>
										Subscribe to our weekly newsletter.
									</Text>

									<Spacer />
									<Switch isChecked={subscribed} size='lg' onChange={(e) => handleNewsletterSubscribedChange(e)} />
								</Flex>
							</Stack>
						</Stack>
					</Stack>
					<Stack
						direction="row"
						justify="space-between"
						align="flex-start"
						alignSelf="stretch"
					// bg='green'
					>
						<Stack
							justify="flex-start"
							align="flex-start"
							spacing="20px"
							flex="1"
						>
							<Stack
								paddingY="10px"
								direction="row"
								justify="flex-start"
								align="center"
							>
								<Text
									fontFamily="Inter"
									lineHeight="1.2"
									fontWeight="bold"
									fontSize="20px"
									color="#FFFFFF"
								>
									Account Level Actions
								</Text>
							</Stack>
							<Stack
								// paddingX="10px"
								justify="flex-start"
								align="flex-start"
								alignSelf="stretch"
								w='100%'
							>
								<Flex
									direction="row"
									justify="flex-start"
									align="center"
									width='100%'
									spacing="20px"

								// alignSelf="stretch"
								// bg='blue'
								// maxWidth="100%"
								>
									<Text
										fontFamily="Inter"
										lineHeight="1.5"
										fontWeight="regular"
										fontSize="18px"
										color="red.500"
									>
										Suspend all activities
									</Text>
									<Spacer />
									<Switch isChecked={suspended} size='lg' colorScheme='red'
										onChange={(e) => handleSuspendedChange(e)}
									// sx={{
									// 	track: {
									// 		bg: 'green.400',
									// 		_checked: {
									// 			bg: 'red.500',
									// 		},
									// 	}
									// }}
									/>
								</Flex>
							</Stack>
							<Stack
								// paddingX="10px"
								pb={4}
								direction="row"
								justify="space-between"
								align="flex-start"
								spacing="30px"
								alignSelf="stretch"
							>
								<Stack
									direction="row"
									justify="flex-start"
									align="center"
									// width="419px"
									alignSelf="stretch"
									maxWidth="100%"
								>
									<Text
										fontFamily="Inter"
										lineHeight="1.5"
										fontWeight="regular"
										fontSize="18px"
										color="red.500"
									>
										Delete Account
									</Text>
									<Box />
								</Stack>
								<Button
									onClick={onOpen}
									_hover={{ bg: "red.700" }}
									bg='red.500'
									// p='3px'
									py='15px'
								>
									<Text
										fontFamily="Inter"
										lineHeight="1.2"
										fontWeight="bold"
										fontSize="16px"
										color="#FFFFFF"
									// p={3}
									>
										Delete Account
									</Text>
								</Button>
								<AlertDialog
									isOpen={isOpen}
									leastDestructiveRef={cancelRef}
									onClose={onClose}
									isCentered
								>
									<AlertDialogOverlay>
										<AlertDialogContent>
											<AlertDialogHeader fontSize='lg' fontWeight='bold'>
												Delete Account
											</AlertDialogHeader>

											<AlertDialogBody>
												Are you sure? You can't undo this action afterwards.
											</AlertDialogBody>

											<AlertDialogFooter>
												<Button ref={cancelRef} onClick={onClose}>
													Cancel
												</Button>
												<Button colorScheme='red' onClick={deleteAccount} isLoading={isDeleting} >
													Delete
												</Button>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialogOverlay>
								</AlertDialog>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Stack >
	);
};
export default CandidateAccountPage;