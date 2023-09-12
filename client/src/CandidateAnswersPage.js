import React, { useState, useEffect, useCallback } from 'react';
import { Stack, HStack, VStack, Box, Text, Select, Collapse, Circle, Input, Button, Icon, Heading, Flex, SimpleGrid, } from '@chakra-ui/react';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { LoginButton } from './LoginButton';
// import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { questionsData as questionsDataOriginal } from './QuestionsData';

let questionsData = questionsDataOriginal.filter(q => q.questionID <= 100);
//run through questions and convert answerID: number, answer: x to just answerID: answer
console.log('questionsData: ', questionsData);
// questionsData.forEach(q => {
// 	// map {answerID: 1, answer: 'x'} to just {1: 'x'}
// 	console.log(q.answers);
// 	q.answers = Object.fromEntries(q.answers.map(a => [a.answerID, a.answer]));

// });

const categories = ['HR Requirements', 'Technical Skills', 'Legal Experience', 'Platform Workflows',];

function CandidateAnswerPage({ apiURL, userProfile, hasLoadedProfile }) {
	const { isAuthenticated, isLoading, user } = useAuth0();
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	// const [questionBank, setQuestionBank] = useState(null);
	const [hasLoadedQuestions, setHasLoadedQuestions] = useState(false);
	const [answered, setAnswered] = useState({});
	const [answeredQuestions, setAnsweredQuestions] = useState([]);

	const [expandedQuestionID, setExpandedQuestionID] = useState(null);
	const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState(null);
	const [isAnswerSelected, setIsAnswerSelected] = useState(false);
	const [displayedQuestions, setDisplayedQuestions] = useState([]);

	function QuestionCard({ question }) {
		const [selectedAnswer, setSelectedAnswer] = useState(null);
		const [isExpanded, setIsExpanded] = useState(false);

		return (
			<Box w='100%' bg='blue.700' flex='1 1 auto'>
				<Button w='100%' onClick={() => {
					// console.log('clicked question: ', question, question.questionID);
					// {
					// 	Object.entries(question.answers).map(([answerID, answerText]) => (
					// 		console.log('answerID: ', answerID, ' answerText: ', answerText)
					// 	));
					// }
					setExpandedQuestionID(question.questionID);
					setCurrentQuestionAnswer(null);
					// console.log('expandedQuestionID: ', expandedQuestionID, expandedQuestionID === question.questionID);
				}}>
					<Text fontSize='md'>
						{question.question}
					</Text>
				</Button>
				<Collapse in={expandedQuestionID === question.questionID} w='100%' align='stretch'>
					{question.answers.length > 4 && (
						<SimpleGrid columns={2} spacing={2} pt={4} w='100%' h='100%' maxHeight='100%' bg='blue.500'>
							{question.answers.map(answer => (
								<Button
									key={answer.answerID}
									w='100%'
									colorScheme={(expandedQuestionID === question.questionID && currentQuestionAnswer === answer.answerID) ? 'blue' : 'gray'}
									onClick={() => {
										console.log('clicked answer: ', answer.answerID);
										setCurrentQuestionAnswer(answer.answerID);
										setIsAnswerSelected(true);
									}}
								>
									<Text fontSize='sm'>
										{answer.answer}
									</Text>
								</Button>
							))}
						</SimpleGrid>
					)}
					{question.answers.length <= 4 && (
						<VStack w='100%' justify='center' pt={4} h='100%' maxHeight='100%' bg='blue.500'>
							{question.answers.map(answer => (
								<Button
									key={answer.answerID}
									w='100%'
									colorScheme={(expandedQuestionID === question.questionID && currentQuestionAnswer === answer.answerID) ? 'blue' : 'gray'}
									onClick={() => {
										console.log('clicked answer: ', answer.answerID);
										setCurrentQuestionAnswer(answer.answerID);
										setIsAnswerSelected(true);
									}}
								>
									<Text fontSize='sm'>
										{answer.answer}
									</Text>
								</Button>
							))}
						</VStack>)}
				</Collapse>
			</Box>
		);
	}













	const sortQuestionBankQuestions = (questions) => {
		return questions;
	};


	const handleConfirmAnswers = async () => {
		if (expandedQuestionID && currentQuestionAnswer) {
			// console.log('expandedQuestionID: ', expandedQuestionID);
			// console.log('currentQuestionAnswer: ', currentQuestionAnswer);

			try {
				const response = await axios.post(`${apiURL}/setUserAnswer`, {
					user_id: user.sub, // Assuming this holds the Auth0 user ID. Adjust accordingly.
					question_id: expandedQuestionID,
					answer_id: currentQuestionAnswer,
				});

				if (response.data.message) {
					console.log(response.data.message);
				}

				let newAnswered = { ...answered, [expandedQuestionID]: currentQuestionAnswer };
				console.log('newAnswered: ', newAnswered);
				setAnswered(newAnswered);
				setExpandedQuestionID(null);
				setCurrentQuestionAnswer(null);
				setIsAnswerSelected(false);
			} catch (error) {
				console.error('Error saving answer: ', error);
			}
		}
	};


	// const filterQuestions = useCallback(() => {
	// }, [selectedCategory, searchTerm, answered]);

	useEffect(() => {
		let newDisplayedQuestions = questionsData;

		if (selectedCategory) {
			newDisplayedQuestions = newDisplayedQuestions.filter(q => q.category === selectedCategory);
		}

		if (searchTerm) {
			let searchWords = searchTerm.split(' ');
			if (searchWords && searchWords.length > 0) {
				newDisplayedQuestions = newDisplayedQuestions.filter(q =>
					q.tags && Array.isArray(q.tags) &&
					searchWords.some(word => q.tags.some(tag => tag.toLowerCase().includes(word.toLowerCase())))
				);
			}
		}

		//filter questions based on if they have already been answered (answered state)
		if (answered !== null && Object.keys(answered).length > 0) {
			newDisplayedQuestions = newDisplayedQuestions.filter(q => !answered[q.questionID]);
		}

		setDisplayedQuestions(newDisplayedQuestions);
	}, [searchTerm, selectedCategory, answered]);

	useEffect(() => {
		// setSele(answered[expandedQuestionID]);
		if (answered[expandedQuestionID]) {
			setCurrentQuestionAnswer(answered[expandedQuestionID]);
			setIsAnswerSelected(true);
		}
		else {
			setCurrentQuestionAnswer(null);
			setIsAnswerSelected(false);
		}
	}, [expandedQuestionID]);


	useEffect(() => {
		if (questionsData) {
			// 	}
			let newDisplayedQuestions = sortQuestionBankQuestions(questionsData);
			setDisplayedQuestions(questionsData);
		}

	}, [questionsData]);

	// if (searchTerm) {
	//   const searchWords = searchTerm.split(' ');
	//   if (searchWords && searchWords.length > 0) {
	//     displayedQuestions = displayedQuestions.filter(q => q.tags && Array.isArray(q.tags) && searchWords.some(word => q.tags.some(tag => tag.toLowerCase().includes(word.toLowerCase()))));
	//   }
	// }
	return (
		<Flex
			justify="flex-start"
			align="flex-start"
			spacing="0px"
			direction='column'
			// overflow="scroll"
			// width="1280px"
			paddingStart="64px"
			paddingEnd="32px"
			paddingTop="80px"
			w='100%'
			h='100%'
		// alignSelf='stretch'
		>
			<VStack
				justify="center"
				align="flex-start"
				// flex="1"
				flex='1 1 auto'
				alignSelf="stretch"
				w='60%'
			// bg='red'
			>
				<Stack
					justify="flex-start"
					align="flex-start"
					flex="1"
					alignSelf="stretch"
				>
					<Text
						fontFamily="Inter"
						lineHeight="1.2"
						fontWeight="bold"
						fontSize="20px"
						color="#F2A5FF"
					>
						Answer more questions to improve next week’s results.
					</Text>
					<Flex direction='row' alignItems='baseline' w='100%'>
						<Text pt='48px' pr={4} fontSize='lg' align='stretch' color='white'>
							Question Category:
						</Text>
						<Select id="producttype" flex='1'
							defaultValue={""}
							onChange={(e) => {
								setSelectedCategory(e.target.value);
								console.log('selected category: ' + e.target.value);
							}}
						>
							<option value="" >---</option>
							{categories.map((category) => (<option value={category} key={category}>{category}</option>))}
						</Select>
					</Flex>
					<Input
						type='text'
						value={searchTerm}
						placeholder="Search"
						mt={4}
						color='white'
						onChange={e => setSearchTerm(e.target.value)} />
				</Stack>

				{/* <VStack w='100%' bg='red' spacing={5} align='stretch' h='100%' overflowY='auto' >
        </VStack > */}
			</VStack >
			<VStack
				justify="center"
				align="flex-start"
				flex="1 1 auto"
				alignSelf="stretch"
				w='100%'
				// h='auto'
				maxHeight='85vh'
				pt={4}
			// bg='blue'

			>
				<Button size='lg' onClick={handleConfirmAnswers} isDisabled={!isAnswerSelected} colorScheme={!isAnswerSelected ? 'gray' : 'green'}>Confirm Answers</Button>

				<VStack w='100%' spacing={4} overflowY='auto' >
					{displayedQuestions.map(question => (
						<QuestionCard key={question.questionID} question={question} onConfirm={setAnsweredQuestions} />
					))}
				</VStack>

			</VStack>
		</Flex >
	);
}

export default CandidateAnswerPage;
