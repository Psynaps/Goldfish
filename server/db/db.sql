DROP TABLE IF EXISTS job_profile_questions;
DROP TABLE IF EXISTS job_profiles;

CREATE TABLE job_postings (
    job_posting_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    job_location DECIMAL,
    salary DECIMAL,
    hourly_rate DECIMAL,
    contract_term DECIMAL,
    flexibility DECIMAL,
    work_from_home DECIMAL,
    visa DECIMAL,
    travel DECIMAL,
    active BOOLEAN,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX job_postings_unique ON job_postings (job_posting_id, user_id);


CREATE TABLE job_posting_questions (
  job_posting_id INTEGER REFERENCES job_postings(job_posting_id) ON DELETE CASCADE,
  question_id INTEGER,
  answer_ids INTEGER[],
  nonanswer_ids INTEGER[],
  importance INTEGER
);
ALTER TABLE job_posting_questions 
ADD CONSTRAINT job_posting_questions_unique 
UNIQUE(job_posting_id, question_id);

CREATE TABLE employer_profiles (
  user_id VARCHAR(255) PRIMARY KEY,
  companyname VARCHAR(255),
  website VARCHAR(255),
  linkedin VARCHAR(255),
  companysize INTEGER,
  companylogo BYTEA,
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

CREATE TABLE user_answers (
    user_id VARCHAR(255) NOT NULL,
    question_id INT NOT NULL,
    answer_id INT NOT NULL,
    PRIMARY KEY (user_id, question_id)
);

CREATE TABLE user_profiles (
    user_id VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    user_type CHAR(1) NOT NULL,
    subscribed_newsletter BOOLEAN DEFAULT FALSE,
    subscribed_new_job_recs BOOLEAN DEFAULT FALSE,
    suspended BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, email)
);

-- SELECT left(encode(companylogo, 'hex'), 40), user_id from employer_profiles; 