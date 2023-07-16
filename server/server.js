require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8080;
// const PORT = process.env.PORT || 3000;
const morgan = require('morgan');
const multer = require('multer');
const sharp = require('sharp');
// const FileType = require('file-type');
let fileTypeFromBuffer = null;
import('file-type').then(fileTypeModule => {
    fileTypeFromBuffer = fileTypeModule.fileTypeFromBuffer;
    // use fileTypeFromBuffer here
});
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
const upload = multer({
    limits: {
        fileSize: 10000000, // limit file size to 10MB
    },
});

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

        const { userID, location, jobName, jobData } = req.body;
        let jobPostingID = req.body.jobPostingID;

        // Convert the jobData string to an object
        const jobDataObj = JSON.parse(jobData);

        // Upsert into job_profiles
        let result;
        let query;
        if (!jobPostingID) {
            query = {
                text: `INSERT INTO job_profiles (userid, location, jobname) 
            VALUES ($1, $2, $3) 
            RETURNING jobpostingid`,
                values: [userID, location, jobName],
            };
        } else {
            query = {
                text: `UPDATE job_profiles SET location = $2, jobname = $3
            WHERE jobpostingid = $1
            RETURNING jobpostingid`,
                values: [jobPostingID, location, jobName],
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
            // acc[curr.questionid] = {
            //     answerIDs: curr.answerids,
            //     nonAnswerIDs: curr.nonanswerids,
            //     importance: curr.importance
            // };
            acc[curr.questionid] = [curr.answerids, curr.nonanswerids, curr.importance];
            return acc;
        }, {});

        // Construct the response object
        const responseObject = {
            userID: jobProfileData.userid,
            // company: jobProfileData.company,
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

app.post('/api/postJobInfo', upload.none(), async (req, res) => {
    try {

        const { userID, jobTitle, salaryBase, salaryOTE, oteValue, homeOfficeAddress, jobPostingID }
            = req.body;
        console.log("postJobInfo req received");
        console.log(req.body);
        // console.log('userID', userID, 'jobTitle', jobTitle, 'salaryBase', salaryBase, 'salaryOTE', salaryOTE, 'oteValue', oteValue, 'homeOfficeAddress', homeOfficeAddress, 'jobPostingID', jobPostingID);
        if (!userID) {
            return res.status(400).send({ error: 'Missing userID query parameter' });
        }
        if (!jobTitle) {
            return res.status(400).send({ error: 'Missing jobTitle query parameter' });
        }
        if (jobPostingID === -1) {

        }
        else {

        }
        res.send({ success: true, jobPostingID: 0 });
    }
    catch (err) {
        console.error(err);
        res.send({ error: err.message });
    }

});

app.get('/api/getUserJobs', async (req, res) => {
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


app.post('/api/saveEmployerProfile', upload.single('logo'), async (req, res) => {
    try {
        console.log("saveEmployerProfile req received");
        // console.log(req.body);
        const client = await pool.connect();

        const { userID, companyname, website, linkedin, companysize, producttype,
            office1, office2, office3,
            medical1, medical2, medical3, medical4, medical5,
            pto1, pto2, pto3, pto4,
            financial1, financial2, financial3, financial4,
        } = req.body;

        // console.log('userID', userID, req.body?.userInfo);

        let companyLogo;
        let query;

        if (req.file) {
            const fileContents = req.file.buffer;
            if (fileTypeFromBuffer) {
                const fileType = await fileTypeFromBuffer(fileContents);

                if (!fileType || !['jpg', 'png', 'gif', 'webp'].includes(fileType.ext)) {
                    return res.status(400).send({ error: 'Invalid file type. Only .jpg, .jpeg, .png, .gif, and .webp are accepted' });
                }
            }
            companyLogo = await sharp(req.file.buffer)
                .resize({ width: 250, height: 250 }) // Resize image to 250x250 pixels
                .png() // Convert to png format
                .toBuffer();

            // console.log('got logo:', companyLogo);

            query = {
                text: `
                    INSERT INTO employer_profiles 
                    (userid, companyname, website, linkedin, companysize, producttype, companylogo,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
                    ON CONFLICT (userid) 
                    DO UPDATE SET 
                    companyname = EXCLUDED.companyname, website = EXCLUDED.website, linkedin = EXCLUDED.linkedin, 
                    companysize = EXCLUDED.companysize, producttype = EXCLUDED.producttype, companyLogo = EXCLUDED.companyLogo, 
                    office1 = EXCLUDED.office1, office2 = EXCLUDED.office2, office3 = EXCLUDED.office3, 
                    medical1 = EXCLUDED.medical1, medical2 = EXCLUDED.medical2, medical3 = EXCLUDED.medical3, 
                    medical4 = EXCLUDED.medical4, medical5 = EXCLUDED.medical5, 
                    pto1 = EXCLUDED.pto1, pto2 = EXCLUDED.pto2, pto3 = EXCLUDED.pto3, pto4 = EXCLUDED.pto4,
                    financial1 = EXCLUDED.financial1, financial2 = EXCLUDED.financial2, financial3 = EXCLUDED.financial3, 
                    financial4 = EXCLUDED.financial4`,
                values: [userID, companyname, website, linkedin, companysize, producttype, companyLogo,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4],
            };
        } else {
            query = {
                text: `
                    INSERT INTO employer_profiles 
                    (userid, companyname, website, linkedin, companysize, producttype,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
                    ON CONFLICT (userid) 
                    DO UPDATE SET 
                    companyname = EXCLUDED.companyname, website = EXCLUDED.website, linkedin = EXCLUDED.linkedin, 
                    companysize = EXCLUDED.companysize, producttype = EXCLUDED.producttype, 
                    office1 = EXCLUDED.office1, office2 = EXCLUDED.office2, office3 = EXCLUDED.office3, 
                    medical1 = EXCLUDED.medical1, medical2 = EXCLUDED.medical2, medical3 = EXCLUDED.medical3, 
                    medical4 = EXCLUDED.medical4, medical5 = EXCLUDED.medical5, 
                    pto1 = EXCLUDED.pto1, pto2 = EXCLUDED.pto2, pto3 = EXCLUDED.pto3, pto4 = EXCLUDED.pto4,
                    financial1 = EXCLUDED.financial1, financial2 = EXCLUDED.financial2, financial3 = EXCLUDED.financial3, 
                    financial4 = EXCLUDED.financial4`,
                values: [userID, companyname, website, linkedin, companysize, producttype,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4],
            };
        }

        let result = await client.query(query);

        // as long as there is no error in the query, send success: true
        let companyLogoToSend = companyLogo ? companyLogo.toString('base64') : null;
        res.send({ success: true, companyLogo: companyLogoToSend });
        console.log("SaveEmployerProfile req completed");
        client.release();
    } catch (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            console.error('File is too large');
            return res.status(500).send({ error: 'File is too large. Maximum size is 10MB.' });
        }

        console.error(err);
        // res.status(500).send({ error: 'Malformed request' });
        res.status(500).send({ error: err.message });
    }
});

app.get('/api/getEmployerProfile', async (req, res) => {
    const userID = req.query.userid;

    try {
        const client = await pool.connect();

        const employerProfileQuery = {
            text: 'SELECT * FROM employer_profiles WHERE userid = $1',
            values: [userID],
        };

        const employerProfileResult = await client.query(employerProfileQuery);
        const employerProfileData = employerProfileResult.rows[0];

        if (!employerProfileData) {
            return res.status(404).send({ error: 'Employer profile not found' });
        }

        // If there's a companyLogo, convert it to base64 string
        if (employerProfileData.companylogo) {
            employerProfileData.companylogo = Buffer.from(employerProfileData.companylogo).toString('base64');
        }

        // Delete the keys you don't want to send back in the response
        delete employerProfileData.userID;
        // delete employerProfileData.companyLogo;

        res.send(employerProfileData);
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
    console.error('Other req received');
    response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Internal Server Error" });
});

app.listen(PORT, function () {
    console.error(`Node PID ${process.pid}: listening on port ${PORT}`);
});