require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8080;
// const PORT = process.env.PORT || 3000;
const morgan = require('morgan');
// const db = require('./db');
const { Pool } = require('pg');
// require { Client } from 'pg';
// const { Client } = require('pg');
const cors = require('cors');
const isDev = process.env.NODE_ENV !== 'production';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use(express.static(path.resolve(__dirname, '../client/build'))); // Maybe add / to end of build


const pool = (() => {
    if (process.env.NODE_ENV !== 'production') {
        return new Pool({
            connectionString: 'postgres://fhpaktypylwyhq:eeeace6b5ebfcbf4c3cd83a51dc0b237a80dbe4a96b89834c783cd3a44a9c4a5@ec2-34-236-199-229.compute-1.amazonaws.com:5432/d6v1l2cfura9pa',
            ssl: {
                rejectUnauthorized: false
            }
        });
    } else {
        return new Pool({
            connectionString: 'postgres://fhpaktypylwyhq:eeeace6b5ebfcbf4c3cd83a51dc0b237a80dbe4a96b89834c783cd3a44a9c4a5@ec2-34-236-199-229.compute-1.amazonaws.com:5432/d6v1l2cfura9pa',
            ssl: {
                rejectUnauthorized: false
            }
        });
    }
})();


app.get('/', (req, res) => { res.send('Hello from Express!'); });





app.get('/db', async (req, res) => {

    try {
        const client = await pool.connect();
        const query = {
            text: 'SELECT * FROM user_answers WHERE userid = $1',
            values: ['*'],
        };

        const result = await client.query(query);
        const results = { 'results': (result) ? result.rows : null };
        res.send(results);
        client.release();



    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }

});

app.post('/api/postJob', async (req, res) => {
    try {
        console.log("postJob req received");
        // console.log(req.body);
        const client = await pool.connect();

        const { userID, company, location, jobName, jobData } = req.body;
        let jobPostingID = req.body.jobPostingID;

        // Convert the jobData string to an object
        const jobDataObj = JSON.parse(jobData);

        // Upsert into job_profiles
        let result;
        let query;
        if (!jobPostingID) {
            query = {
                text: `INSERT INTO job_profiles (userid, company, location, jobname) 
            VALUES ($1, $2, $3, $4) 
            RETURNING jobpostingid`,
                values: [userID, company, location, jobName],
            };
        } else {
            query = {
                text: `UPDATE job_profiles SET company = $2, location = $3, jobname = $4
            WHERE jobpostingid = $1
            RETURNING jobpostingid`,
                values: [jobPostingID, company, location, jobName],
            };
        }
        result = await client.query(query);
        jobPostingID = result.rows[0]['jobpostingid'];

        query = {
            text: 'DELETE FROM job_profile_questions WHERE jobPostingid = $1',
            values: [jobPostingID],
        };
        await client.query(query);

        // Insert or update the questions
        console.log(JSON.stringify(jobDataObj));
        for (const questionID in jobDataObj) {
            const [answerIDs, nonAnswerIDs, importance] = jobDataObj[questionID];
            query = {
                text: 'INSERT INTO job_profile_questions (jobpostingid, questionid, answerids, nonanswerids, importance) VALUES ($1, $2, $3, $4, $5)',
                values: [jobPostingID, questionID, answerIDs, nonAnswerIDs, importance],
            };
            await client.query(query);
        }

        res.send({ success: true, jobPostingID: jobPostingID });
        console.log("postJob req completed");
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

app.get('/api/getJob', async (req, res) => {
    const jobPostingID = req.query.jobid;
    const userID = req.query.userid;
    console.log("getJob req received", jobPostingID, userID);
    if (!jobPostingID) {
        return res.status(400).send({ error: 'Missing jobPostingid query parameter' });
    }
    if (!userID) {
        return res.status(400).send({ error: 'Missing userid query parameter, used for ownership authentication' });
    }

    try {
        const client = await pool.connect();

        // Get job profile information
        const jobProfileQuery = {
            text: 'SELECT * FROM job_profiles WHERE jobPostingid = $1',
            values: [jobPostingID],
        };
        const jobProfileResult = await client.query(jobProfileQuery);
        const jobProfileData = jobProfileResult.rows[0];

        if (!jobProfileData) {
            return res.status(404).send({ error: 'Job posting not found' });
        }

        if (jobProfileData.userid !== userID) {
            return res.status(401).send({ error: 'Job posting not owned by user' });
        }

        // Get question & answer pairs for this job posting
        const jobQuestionsQuery = {
            text: 'SELECT questionid, answerids, nonanswerids, importance FROM job_profile_questions WHERE jobpostingid = $1',
            values: [jobPostingID],
        };
        const jobQuestionsResult = await client.query(jobQuestionsQuery);
        const jobQuestionsData = jobQuestionsResult.rows.reduce((acc, curr) => {
            acc[curr.questionid] = {
                answerIDs: curr.answerids,
                nonAnswerIDs: curr.nonanswerids,
                importance: curr.importance
            };
            return acc;
        }, {});

        // Construct the response object
        const responseObject = {
            userID: jobProfileData.userid,
            company: jobProfileData.company,
            location: jobProfileData.location,
            jobName: jobProfileData.jobname,
            jobData: JSON.stringify(jobQuestionsData),
        };
        console.log(responseObject);
        res.send(responseObject);
        // res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.get('/getUserJobs', async (req, res) => {
    const userID = req.query.userID;
    if (!userID) {
        return res.status(400).send({ error: 'Missing userID query parameter' });
    }

    try {
        const client = await pool.connect();

        // Get job profile information
        const jobProfileQuery = {
            text: 'SELECT jobPostingid FROM job_profiles WHERE userid = $1',
            values: [userID],
        };
        const jobPostingIDsResult = await client.query(jobProfileQuery);
        console.log("result: " + jobPostingIDsResult.jobPostingIDsResult.rows);
        // const jobPostingIDs = jobProfileResult.rows[0];
        // const jobQuestionsData = jobQuestionsResult.rows.reduce((acc, curr) => {
        //     acc[curr.questionid] = curr.answerid;
        //     return acc;
        // }, {});

        if (!jobPostingIDsResult) {
            return res.status(404).send({ error: 'Job postings not found' });
        }

        // Construct the response object
        const responseObject = {
            jobs: JSON.stringify(jobPostingIDsResult)
        };

        res.send(responseObject);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
    console.error('Other req received');
    response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, function () {
    console.error(`Node PID ${process.pid}: listening on port ${PORT}`);
});