DROP TABLE IF EXISTS job_profile_questions;
DROP TABLE IF EXISTS job_profiles;

CREATE TABLE job_profiles (
  jobpostingid SERIAL PRIMARY KEY,
  userid VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  location VARCHAR(255),
  jobname VARCHAR(255)
);

CREATE TABLE job_profile_questions (
  jobpostingid INTEGER REFERENCES job_profiles(jobpostingid),
  questionid INTEGER,
  answerids INTEGER[],
  nonanswerids INTEGER[],
  importance INTEGER
);
