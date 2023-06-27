const csv = require('csv-parser');
const fs = require('fs');

let questionsDataFull = [];

fs.createReadStream('questions.csv')
    .pipe(csv())
    .on('data', (row) => {
        let question = {
            questionID: row['QuestionID'],
            category: row['Domain Tags'],
            tags: row['Search Tags'].split(', ').map(tag => tag.trim()),
            question: row['Question'],
            employerQuestion: row['Employer Question Phrasing'],
            answers: [],
            employerAnswers: []
        };
        // console.log(row);
        if (!question.question || !question.questionID || !question.answers) { // Catch invalid question rows
            // console.log(row);
            return;
        }

        // Add any answers present in the row to the question object
        for (let i = 1; i <= 8; i++) {
            if (row[`Answer (${i})`]) {
                question.answers.push({
                    answerID: i,
                    answer: row[`Answer (${i})`].trim()
                });
            }
            if (row[`Employer Answer ${i}`]) {
                question.employerAnswers.push({
                    answerID: i,
                    answer: row[`Employer Answer ${i}`].trim()
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
                category: obj.category,
                tags: obj.tags,
                question: (obj.employerQuestion ? obj.employerQuestion : obj.question),
                answers: (obj.employerAnswers.length ? obj.employerAnswers : obj.answers),
            };
        });
        fs.writeFile('../client/src/QuestionsData.js', 'export const questionsData = ' + JSON.stringify(questionsData, null, 2), function (err) {
            if (err) console.log('Error writing file:', err);
        });
        fs.writeFile('../server/QuestionsData.js', 'export const questionsDataFull = ' + JSON.stringify(questionsDataFull, null, 2), function (err) {
            if (err) console.log('Error writing file:', err);
        });
    });