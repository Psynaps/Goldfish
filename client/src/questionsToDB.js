const { questionsData } = require('./QuestionsData');  // adjust the path as necessary

let psqlCommands = '';

questionsData.forEach((questionData) => {
    // Generate the INSERT command for the question
    let tagsArray = questionData.tags.map(tag => `'${tag}'`).join(', ');
    psqlCommands += `INSERT INTO questions (questionID, category, tags, question) VALUES (${questionData.questionID}, '${questionData.category}', ARRAY[${tagsArray}], '${questionData.question}');\n`;

    // Generate the INSERT commands for the associated answers
    questionData.answers.forEach((answer) => {
        psqlCommands += `INSERT INTO answers (answerID, questionID, answer) VALUES (${answer.answerID}, ${questionData.questionID}, '${answer.answer}');\n`;
    });
});

// Now, psqlCommands contains the necessary PostgreSQL commands. You can write these to a file, or print them out.
console.log(psqlCommands);
