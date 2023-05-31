-- Users table
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    other_profile_data JSONB
);

-- Questions table
CREATE TABLE questions (
    questionID SERIAL PRIMARY KEY,
    category VARCHAR(100),
    tags TEXT[],
    question TEXT NOT NULL
);

-- Answers table
CREATE TABLE answers (
    answerID SERIAL PRIMARY KEY,
    questionID INTEGER,
    answer TEXT NOT NULL,
    FOREIGN KEY (questionID) REFERENCES questions(questionID)
);

-- User_Answers table
CREATE TABLE user_answers (
    useranswerID SERIAL PRIMARY KEY,
    userID INTEGER,
    questionID INTEGER,
    answerID INTEGER,
    FOREIGN KEY (questionID) REFERENCES questions(questionID),
    FOREIGN KEY (answerID) REFERENCES answers(answerID)
);