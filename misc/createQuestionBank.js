const csv = require('csv-parser');
const fs = require('fs');

let questionsData = [];

fs.createReadStream('questions.csv')
    .pipe(csv())
    .on('data', (row) => {
        let question = {
            questionID: row['QuestionID'],
            category: row['Domain Tags'],
            tags: row['Search Tags'].split(', ').map(tag => tag.trim()),
            question: row['Question'],
            answers: []
        };
        if (!question.question || !question.questionID || !question.answers) { // Catch invalid question rows
            // console.log(row);
            return;
        }

        // Add any answers present in the row to the question object
        for (let i = 1; i <= 4; i++) {
            if (row[`Answer (${i})`]) {
                question.answers.push({
                    answerID: i,
                    answer: row[`Answer (${i})`].trim()
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
        // console.log(question.answers);
        questionsData.push(question);
    })
    .on('end', () => {
        // fs.writeFile('questionsData.js', 'export const questionsData = ' + JSON.stringify(questionsData, null, 2), function (err) {
        fs.writeFile('../client/src/QuestionsData.js', 'export const questionsData = ' + JSON.stringify(questionsData, null, 2), function (err) {
            if (err) console.log('Error writing file:', err);
        });
    });