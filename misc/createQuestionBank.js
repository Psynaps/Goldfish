const csv = require('csv-parser');
const fs = require('fs');

let questionsDataFull = [];

fs.createReadStream('questions.csv')
    .pipe(csv())
    .on('data', (row) => {
        let question = {
            questionID: row['QuestionID'],
            order: row['Importance Index'] ? row['Importance Index'] : -1,
            category: row['Question_Category'].trim(),
            tags: row['Search_Tags'].split(', ').map(tag => tag.trim()),
            question: row['Job_Seeker_Question'],
            employerQuestion: row['Employer_Question_Phrasing'],
            answers: [],
            employerAnswers: [],
        };
        // console.log(row);
        if (!question.question || !question.questionID || !question.answers) { // Catch invalid question rows
            // console.log(row);
            return;
        }

        if (question.category == 'Client Onboarding' || question.category == 'Intro Questions') { // These are in the question bank but shouldn't be addable 
            return;
        }

        // if (question.questionID <= 100 || row['Onboarding Index' !== '']) { // These are the onboarding questions
        //     return;
        // }


        // if (!question.isOnboarding) {
        //     return;
        // }

        // if (question.questionID > 248 || question.questionID < 239) { // These are in the question bank but shouldn't be addable
        //     return;
        // }
        // Add any answers present in the row to the question object
        for (let i = 1; i <= 20; i++) {
            if (row[`JS_Answer_${i}`]) {
                let ans = row[`JS_Answer_${i}`].trim();
                if (ans.charAt(ans.length - 1) === '.') {
                    ans = ans.slice(0, -1);
                }
                question.answers.push({
                    answerID: i,
                    answer: ans
                });
            }
            if (row[`Employer_Answer_${i}`]) {
                let ans = row[`Employer_Answer_${i}`].trim();
                if (ans.charAt(ans.length - 1) === '.') {
                    ans = ans.slice(0, -1);
                }
                question.employerAnswers.push({
                    answerID: i,
                    answer: ans
                });
            }
        }

        // Generate matchScores based on the answers. Default to 100 if the answers are the same, 0 otherwise.
        question.matchScores = [];
        for (let i = 0; i < question.answers.length; i++) {
            for (let j = 0; j < question.answers.length; j++) {
                question.matchScores.push({
                    answerID1: i + 1,
                    answerID2: j + 1,
                    matchValue: (i == j) ? 100 : 0
                });
            }
        }

        // Add the processed question to the array
        // console.log(question);
        questionsDataFull.push(question);
    })
    .on('end', () => {
        // fs.writeFile('questionsData.js', 'export const questionsData = ' + JSON.stringify(questionsData, null, 2), function (err) {
        // questionsData = structuredClone(questionsDataFull);
        let questionsData = questionsDataFull.map(function (obj) {
            return {
                questionID: obj.questionID,
                order: obj.order,
                category: obj.category,
                tags: obj.tags,
                question: obj.question,
                answers: obj.answers,
                employerQuestion: obj.employerQuestion,
                employerAnswers: obj.employerAnswers,
            };
        });
        // make variable onboardingQuestionsData which is a subset of questionsData where questionID <= 100
        // let onboardingQuestionsData = questionsData.filter(q => q.questionID <= 100);
        fs.writeFile('../client/src/QuestionsData.js', 'export const questionsData = ' + JSON.stringify(questionsData, null, 2), function (err) {
            if (err) console.log('Error writing file:', err);
        });
        // fs.writeFile('../client/src/OnboardingQuestionsData.js', 'export const onboardingQuestionsData = ' + JSON.stringify(onboardingQuestionsData, null, 2), function (err) {
        //     if (err) console.log('Error writing onboarding questions file:', err);
        // });

        // fs.writeFile('../server/QuestionsData.js', 'export const questionsDataFull = ' + JSON.stringify(questionsDataFull, null, 2), function (err) {
        //     if (err) console.log('Error writing file:', err);
        // });
    });