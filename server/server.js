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
            text: 'SELECT * FROM user_answers WHERE user_id = $1',
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
        let jobPostingID;

        // Convert the jobData string to an object
        const jobDataObj = JSON.parse(jobData);

        // Upsert into job_profiles
        let query = {
            text: `INSERT INTO job_profiles (userID, company, location, jobName) 
                   VALUES ($1, $2, $3, $4) 
                   ON CONFLICT (userID) DO UPDATE 
                   SET company = $2, location = $3, jobName = $4
                   RETURNING jobPostingID`,
            values: [userID, company, location, jobName],
        };

        let result = await client.query(query);
        jobPostingID = result.rows[0].jobPostingID;  // Get the jobPostingID of the inserted/updated row

        query = {
            text: 'DELETE FROM job_profile_questions WHERE jobPostingID = $1',
            values: [jobPostingID],
        };
        await client.query(query);

        // Insert or update the questions
        for (const questionID in jobDataObj) {
            const answerID = jobDataObj[questionID];
            query = {
                text: 'INSERT INTO job_profile_questions (jobPostingID, questionID, answerID) VALUES ($1, $2, $3)',
                values: [jobPostingID, questionID, answerID],
            };
            await client.query(query);
        }

        res.send({ success: true });
        console.log("postJob req completed");
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
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