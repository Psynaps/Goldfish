import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stack, Box, Text, Circle, Switch, HStack, VStack, Flex, Heading, Button, Icon, Spacer, } from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { LoginButton } from './LoginButton';
// import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';

export const CandidateAccountPage = () => {
	const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
	const [subscribed, setSubscribed] = useState(false);
	const [emailNewJobs, setEmailNewJobs] = useState(false);
	const [hasLoadedProfile, setHasLoadedProfile] = useState(false);
	const handleEmailNewJobsChange = (event) => {
		if (user && isAuthenticated) {
			setEmailNewJobs(event.target.checked);
		}
	};

	const handleSubscribedChange = (event) => {
		if (user && isAuthenticated) {
			setSubscribed(event.target.checked);
		}
	};

	return (
		<Stack
			justify="flex-start"
			align="flex-start"
			paddingStart="64px"
			paddingEnd="32px"
			paddingTop="80px"
			spacing="64px"
			alignSelf="stretch"
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
					maxWidth="100%"
				>
					<Text
						fontFamily="Inter"
						lineHeight="1.2"
						fontWeight="bold"
						fontSize="20px"
						color="#F1A0FF"
						width="411px"
						maxWidth="100%"
					>
						Or take a breather.
					</Text>
				</Stack>
			</Stack>
			<Stack
				justify="flex-start"
				align="flex-start"
				spacing="80px" // Spacing between box and "Account settings"
				alignSelf="stretch"
			>
				<Stack
					justify="flex-start"
					align="flex-start"
					spacing="20px"
					alignSelf="stretch"
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
						width="458px"
						maxWidth="100%"
					>
						<Text
							fontFamily="Inter"
							lineHeight="1.2"
							fontWeight="bold"
							fontSize="20px"
							color="#F1A0FF"
							width="411px"
							maxWidth="100%"
						>
							Have your resume on file to share with matched employers.
						</Text>
					</Stack>
					<Stack
						padding="20px"
						borderRadius="7px"
						justify="center"
						align="center"
						spacing="7.58px"
						borderColor="#FFFFFF"
						borderStartWidth="1px"
						borderEndWidth="1px"
						borderTopWidth="1px"
						borderBottomWidth="1px"
						borderStyle="dashed"
						height="20vh"
						alignSelf="stretch"
						background="rgba(255, 255, 255, 0.1)"
					>
						<SmallAddIcon data-icon="CkSmallAdd" />
					</Stack>
				</Stack>
				<Stack
					justify="flex-start"
					align="flex-start"
					spacing="36px"
					alignSelf="stretch"
				>
					<Stack
						direction="row"
						justify="space-between"
						align="flex-start"
						spacing="36px"
						alignSelf="stretch"

					>
						<Stack
							justify="flex-start"
							align="flex-start"
							spacing="12px"
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
									Account Settings
								</Text>
							</Stack>
							<Stack
								// paddingX="10px"
								justify="flex-start"
								align="flex-start"
								spacing="20px"
								alignSelf="stretch"
								w='100%'
							>
								<Stack
									direction="row"
									justify="flex-start"
									align="center"
									width='100%'
									alignSelf="stretch"
									maxWidth="100%"
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
									<Switch isChecked={emailNewJobs} size='lg' onChange={(e) => handleEmailNewJobsChange(e)} />
									<Stack justify="flex-start" align="flex-start" />
								</Stack>
								<Stack
									direction="row"
									justify="flex-start"
									align="center"
									width='100%'
									alignSelf="stretch"
									maxWidth="100%"
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
									<Switch isChecked={subscribed} size='lg' onChange={(e) => handleSubscribedChange(e)} />
									<Stack justify="flex-start" align="flex-start" />
								</Stack>
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
								paddingX="10px"
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
									alignSelf="stretch"
								>
									<Text
										fontFamily="Inter"
										lineHeight="1.5"
										fontWeight="regular"
										fontSize="18px"
										color="#FFFFFF"
									>
										Suspend all activities
									</Text>
									<Box />
								</Stack>
								<Stack justify="center" align="center" />
							</Stack>
							<Stack
								paddingX="10px"
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
									width="419px"
									alignSelf="stretch"
									maxWidth="100%"
								>
									<Text
										fontFamily="Inter"
										lineHeight="1.5"
										fontWeight="regular"
										fontSize="18px"
										color="#FFFFFF"
									>
										Delete Account
									</Text>
									<Box />
								</Stack>
								<Stack
									paddingX="20px"
									paddingY="10px"
									borderRadius="6px"
									direction="row"
									justify="center"
									align="center"
									spacing="0px"
									borderColor="red.500"
									borderStartWidth="2px"
									borderEndWidth="2px"
									borderTopWidth="2px"
									borderBottomWidth="2px"
									width="173px"
									height="48px"
								>
									<Text
										fontFamily="Inter"
										lineHeight="1.2"
										fontWeight="bold"
										fontSize="16px"
										color="#FFFFFF"
									>
										Delete Account
									</Text>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};
export default CandidateAccountPage;