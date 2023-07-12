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

CREATE TABLE employer_profiles (
  userid VARCHAR(255) PRIMARY KEY,
  companyName VARCHAR(255),
  website VARCHAR(255),
  linkedin VARCHAR(255),
  companySize VARCHAR(255),
  productType VARCHAR(255),
  companyLogo BYTEA,
  office1 VARCHAR(255),
  office2 VARCHAR(255),
  office3 VARCHAR(255),
  medical1 INTEGER,
  medical2 INTEGER,
  medical3 INTEGER,
  medical4 INTEGER,
  medical5 INTEGER,
  pto1 INTEGER,
  pto2 INTEGER,
  pto3 INTEGER,
  pto4 INTEGER,
  financial1 INTEGER,
  financial2 INTEGER,
  financial3 INTEGER,
  financial4 INTEGER
);
