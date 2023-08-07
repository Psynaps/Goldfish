import React, { useState, useEffect, useCallback } from 'react';
import { Stack, HStack, VStack, Box, Text, Select, Circle, Input, Button, Icon, Heading, Flex, } from '@chakra-ui/react';
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { LoginButton } from './LoginButton';
// import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { questionsData } from './QuestionsData';

const categories = ['Industry Certifications', 'Technical Knowledge', 'Deal Experience', 'Tools & Platforms', 'HR Preferences',
  'Job Specific HR',];

export const CandidateAnswerPage = (apiURL, userProfile, hasLoadedProfile) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // const [questionBank, setQuestionBank] = useState(null);
  const [hasLoadedQuestions, setHasLoadedQuestions] = useState(false);

  const [displayedQuestions, setDisplayedQuestions] = useState([]);

  const sortQuestionBankQuestions = (questions) => {
    return questions;
  };

  useEffect(() => {
    // console.log('questionsData: ', questionsData);
    // let newDisplayedQuestions = sortQuestionBankQuestions(questionsData);
    if (questionsData) {
      setDisplayedQuestions(questionsData);
    }
    console.log('searchTerm: ', searchTerm);
  }, [selectedCategory, searchTerm]);

  // if (selectedCategory) {
  //   let newDisplayedQuestions = displayedQuestions?.filter(q => q.category === selectedCategory);
  // }

  // if (searchTerm) {
  //   const searchWords = searchTerm.split(' ');
  //   if (searchWords && searchWords.length > 0) {
  //     displayedQuestions = displayedQuestions.filter(q => q.tags && Array.isArray(q.tags) && searchWords.some(word => q.tags.some(tag => tag.toLowerCase().includes(word.toLowerCase()))));
  //   }
  // }
  return (
    <Stack
      justify="flex-start"
      align="flex-start"
      spacing="0px"
      overflow="scroll"
      // width="1280px"
      paddingStart="64px"
      paddingEnd="32px"
      paddingTop="80px"
      w='100%'
    // alignSelf='stretch'
    >
      <VStack
        justify="center"
        align="flex-start"
        flex="1"
        alignSelf="stretch"
        w='60%'
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
            Answer more questions to improve next week’s results.{' '}
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
              <option value="" disabled>---</option>
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
        <VStack w='100%' bg='red' spacing={5} align='stretch' h='100%' overflowY='auto' >
        </VStack >
      </VStack >
    </Stack >
  );
};
export default CandidateAnswerPage;
