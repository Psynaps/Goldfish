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
const { get } = require('http');
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



app.post('/api/postJob', async (req, res) => {
    try {
        console.log("postJob req received");
        // console.log(req.body);
        const client = await pool.connect();

        const { user_id, job_title, jobData } = req.body;
        let job_posting_id = req.body.job_posting_id;

        // Convert the jobData string to an object
        const jobDataObj = JSON.parse(jobData);

        // Upsert into job_postings
        let result;
        let query;
        if (!job_posting_id) {
            query = {
                text: `INSERT INTO job_postings (user_id, job_title) 
            VALUES ($1, $2) 
            RETURNING job_posting_id`,
                values: [user_id, job_title],
            };
        } else {
            query = {
                text: `UPDATE job_postings SET job_title = $2
            WHERE job_posting_id = $1
            RETURNING job_posting_id`,
                values: [job_posting_id, job_title],
            };
        }
        result = await client.query(query);
        job_posting_id = result.rows[0]['job_posting_id'];

        query = {
            text: 'DELETE FROM job_posting_questions WHERE job_posting_id = $1',
            values: [job_posting_id],
        };
        await client.query(query);

        // Insert or update the questions
        console.log(JSON.stringify(jobDataObj));
        for (const question_id in jobDataObj) {
            const [answer_ids, nonanswer_ids, importance] = jobDataObj[question_id];
            query = {
                text: 'INSERT INTO job_posting_questions (job_posting_id, question_id, answer_ids, nonanswer_ids, importance) VALUES ($1, $2, $3, $4, $5)',
                values: [job_posting_id, question_id, answer_ids, nonanswer_ids, importance],
            };
            await client.query(query);
        }

        res.send({ success: true, job_posting_id: job_posting_id });
        console.log("postJob req completed");
        client.release();

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

app.get('/api/getJob', async (req, res) => {
    const job_posting_id = req.query.jobid;
    const user_id = req.query.userid;
    console.log("getJob req received", job_posting_id, user_id);
    if (!job_posting_id) {
        return res.status(400).send({ error: 'Missing job_posting_id query parameter' });
    }
    if (!user_id) {
        return res.status(400).send({ error: 'Missing user_id query parameter, used for ownership authentication' });
    }

    try {
        const client = await pool.connect();

        // Get job profile information
        const jobProfileQuery = {
            text: 'SELECT * FROM job_postings WHERE job_posting_id = $1',
            values: [job_posting_id],
        };
        const jobProfileResult = await client.query(jobProfileQuery);
        const jobProfileData = jobProfileResult.rows[0];

        if (!jobProfileData) {
            return res.status(404).send({ error: 'Job posting not found' });
        }

        if (jobProfileData.user_id !== user_id) {
            return res.status(401).send({ error: 'Job posting not owned by user' });
        }

        // Get question & answer pairs for this job posting
        const jobQuestionsQuery = {
            text: 'SELECT question_id, answer_ids, nonanswer_ids, importance FROM job_posting_questions WHERE job_posting_id = $1',
            values: [job_posting_id],
        };
        const jobQuestionsResult = await client.query(jobQuestionsQuery);
        const jobQuestionsData = jobQuestionsResult.rows.reduce((acc, curr) => {
            // acc[curr.question_id] = {
            //     answer_ids: curr.answer_ids,
            //     nonanswer_ids: curr.nonanswer_ids,
            //     importance: curr.importance
            // };
            acc[curr.question_id] = [curr.answer_ids, curr.nonanswer_ids, curr.importance];
            return acc;
        }, {});

        // Construct the response object
        const responseObject = {
            user_id: jobProfileData.user_id,
            // company: jobProfileData.company,
            location: jobProfileData.location,
            job_title: jobProfileData.job_title,
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
        const { user_id, job_title, location, salary, contract_term, work_from_home, visa, travel, active, job_posting_id } = req.body;
        console.log("postJobInfo req received");
        // console.log(req.body);

        if (!user_id) {
            return res.status(400).send({ error: 'Missing user_id query parameter' });
        }
        if (!job_title) {
            return res.status(400).send({ error: 'Missing job_title query parameter' });
        }
        if (!job_posting_id) {
            return res.status(400).send({ error: 'Missing job_posting_id query parameter' });
        }
        if (job_posting_id == -1) {
            const queryText = `INSERT INTO job_postings(user_id, job_title, job_location, salary, contract_term, work_from_home, visa, travel, active)
                                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                                RETURNING job_posting_id, date_created;`;
            const queryValues = [user_id, job_title, location, salary, contract_term, work_from_home, visa, travel, active];

            const { rows } = await pool.query(queryText, queryValues);
            res.send({ success: true, job_posting_id: rows[0].job_posting_id, date_created: rows[0].date_created });

        } else {
            const queryText = `UPDATE job_postings SET user_id = $1, job_title = $2, job_location = $3, salary = $4, contract_term = $5, work_from_home = $6, visa = $7, travel = $8,
             active = $9 
                                WHERE job_posting_id = $8 
                                RETURNING job_posting_id;`;
            const queryValues = [user_id, job_title, location, salary, contract_term, work_from_home, visa, travel, active, job_posting_id];

            const { rows } = await pool.query(queryText, queryValues);
            res.send({ success: true, job_posting_id: rows[0].job_posting_id });
        }
    }
    catch (err) {
        console.error(err);
        res.send({ error: err.message });
    }
});

app.get('/api/getUserJobPostings', async (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id) {
        return res.status(400).send({ error: 'Missing user_id query parameter' });
    }

    try {
        const client = await pool.connect();

        // Get job profile information
        const jobProfileQuery = {
            text: 'SELECT job_posting_id, job_title, job_location, salary, contract_term, work_from_home, visa, travel, active, date_created FROM job_postings WHERE user_id = $1',
            values: [user_id],
        };
        const result = await client.query(jobProfileQuery);

        if (!result) {
            return res.status(404).send({ error: 'Job postings not found' });
        }

        // Construct the response object
        const responseObject = result.rows.map((row) => { return { job_posting_id: row.job_posting_id, job_title: row.job_title, location: row.job_location, salary: row.salary, contract_term: row.contract_term, work_from_home: row.work_from_home, visa: row.visa, travel: row.travel, active: row.active, date_created: row.date_created }; });
        console.log(responseObject);
        console.log(JSON.stringify(responseObject));
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

        const { user_id, companyname, website, linkedin, companysize,
            office1, office2, office3,
            medical1, medical2, medical3, medical4, medical5,
            pto1, pto2, pto3, pto4,
            financial1, financial2, financial3, financial4,
        } = req.body;

        // console.log('user_id', user_id, req.body?.userInfo);

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
                    (user_id, companyname, website, linkedin, companysize, companylogo,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
                    ON CONFLICT (user_id) 
                    DO UPDATE SET 
                    companyname = EXCLUDED.companyname, website = EXCLUDED.website, linkedin = EXCLUDED.linkedin, 
                    companysize = EXCLUDED.companysize, companyLogo = EXCLUDED.companyLogo, 
                    office1 = EXCLUDED.office1, office2 = EXCLUDED.office2, office3 = EXCLUDED.office3, 
                    medical1 = EXCLUDED.medical1, medical2 = EXCLUDED.medical2, medical3 = EXCLUDED.medical3, 
                    medical4 = EXCLUDED.medical4, medical5 = EXCLUDED.medical5, 
                    pto1 = EXCLUDED.pto1, pto2 = EXCLUDED.pto2, pto3 = EXCLUDED.pto3, pto4 = EXCLUDED.pto4,
                    financial1 = EXCLUDED.financial1, financial2 = EXCLUDED.financial2, financial3 = EXCLUDED.financial3, 
                    financial4 = EXCLUDED.financial4`,
                values: [user_id, companyname, website, linkedin, companysize, companyLogo,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4],
            };
        } else {
            query = {
                text: `
                    INSERT INTO employer_profiles 
                    (user_id, companyname, website, linkedin, companysize,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
                    ON CONFLICT (user_id) 
                    DO UPDATE SET 
                    companyname = EXCLUDED.companyname, website = EXCLUDED.website, linkedin = EXCLUDED.linkedin, 
                    companysize = EXCLUDED.companysize,
                    office1 = EXCLUDED.office1, office2 = EXCLUDED.office2, office3 = EXCLUDED.office3, 
                    medical1 = EXCLUDED.medical1, medical2 = EXCLUDED.medical2, medical3 = EXCLUDED.medical3, 
                    medical4 = EXCLUDED.medical4, medical5 = EXCLUDED.medical5, 
                    pto1 = EXCLUDED.pto1, pto2 = EXCLUDED.pto2, pto3 = EXCLUDED.pto3, pto4 = EXCLUDED.pto4,
                    financial1 = EXCLUDED.financial1, financial2 = EXCLUDED.financial2, financial3 = EXCLUDED.financial3, 
                    financial4 = EXCLUDED.financial4`,
                values: [user_id, companyname, website, linkedin, companysize,
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
    const user_id = req.query.user_id;

    try {
        const client = await pool.connect();

        const employerProfileQuery = {
            text: 'SELECT * FROM employer_profiles WHERE user_id = $1',
            values: [user_id],
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
        delete employerProfileData.user_id;
        // delete employerProfileData.companyLogo;

        res.send(employerProfileData);
        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//Delete job_posting entry with the corresponding job_posting_id and user_id as is contained in the request body
app.delete('/api/deleteJobPosting', async (req, res) => {
    try {
        console.log("deleteJob req received");
        const { user_id, job_posting_id } = req.body;
        if (!user_id) {
            return res.status(400).send({ error: 'Missing user_id query parameter' });
        }
        if (!job_posting_id) {
            return res.status(400).send({ error: 'Missing job_posting_id query parameter' });
        }
        const deleteJobQuery = {
            text: 'DELETE FROM job_postings WHERE job_posting_id = $1 AND user_id = $2 RETURNING *',
            values: [job_posting_id, user_id],
        };
        const result = await pool.query(deleteJobQuery);

        //TODO: Delete job_posting_questions entries as well
        const deleteJobQuestionsQuery = {
            text: 'DELETE FROM job_posting_questions WHERE job_posting_id = $1',
            values: [job_posting_id],
        };
        await pool.query(deleteJobQuestionsQuery);


        if (result.rowCount === 0) {
            return res.status(409).send({ error: 'Job posting not found. Please refresh the jobs list.' });
        }

        console.log('Delete successful');
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

// /api/getUserMatches endpoint which takes in user_id as a query parameter and returns a 
// array of job_posting objects which contain job_posting_id, job_title, company, company_logo, 
// and match_score. The array should be sorted by match_score in descending order.
// Currently the returned list of job_postings is hardcoded, but will be replaced with real data
app.get('/api/getUserMatches', async (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id) {
        return res.status(400).send({ error: 'Missing user_id query parameter' });
    }

    let matches = [];

    try {
        const client = await pool.connect();

        // Fetch the first 5 rows from job_postings table
        const result = await client.query('SELECT * FROM job_postings LIMIT 3'); // TODO Remove or change limit
        const job_postings = result.rows;
        const query_matches = getMatches(job_postings, user_id);
        console.log('matches:', query_matches);
        let matches = [];

        for (const job of query_matches) {
            // TODO: Likely add a employer_id in the future so multiple user_id's can point to an employer_id
            const employerUserId = job.user_id;

            // Fetch data from employer_profile using employerUserId
            const employerProfileResult = await client.query('SELECT * FROM employer_profiles WHERE user_id = $1', [employerUserId]);
            const employerProfile = employerProfileResult.rows[0];
            // console.log(employerProfile);
            let base64Image = null;
            if (employerProfile.companylogo) {
                base64Image = Buffer.from(employerProfile.companylogo).toString('base64');
            } else {
                console.warn("Company Logo is undefined for user:", employerUserId);
            }
            matches.push({
                job_posting_id: job.job_posting_id,
                job_title: job.job_title,
                company: employerProfile.companyname,
                location: job.job_location,
                company_logo: base64Image,
                website: employerProfile.website,
                main_office: employerProfile.office1,

                //Match score is a 4-tuple, consisting of the overall match score,
                // the Skills match score, the compensation match score, and the benefits match score
                match_score: ({ overall: Math.random() * 100, skills: Math.random() * 100, compensation: Math.random() * 100, benefits: Math.random() * 100 }) // This is a hardcoded value, replace with real data
            });
        }

        client.release();

        // Sorting the matches array based on match_score in descending order
        matches.sort((a, b) => b.match_score[0] - a.match_score[0]);

        res.send({ success: true, matches: matches });

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

// function getMatches which takes in array of job_posting objects and user_id and returns an array of job_posting objects
// which contain job_posting_id, job_title, company, company_logo, and match_score. 
// TODO: replace with real matching algorithm
function getMatches(job_postings, user_id) {
    return job_postings;
}



app.post('/api/setUserAnswer', async (req, res) => {
    console.log(req.body);

    const { user_id, question_id, answer_id } = req.body;

    try {
        const query = `
            INSERT INTO user_answers (user_id, question_id, answer_id) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (user_id, question_id) 
            DO UPDATE SET answer_id = EXCLUDED.answer_id;
        `;

        await pool.query(query, [user_id, question_id, answer_id]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.get('/api/getUserAnswers', async (req, res) => {
    const user_id = req.query.user_id;
    // console.log('getUserAnswers req received', user_id);

    try {
        const query = `
            SELECT question_id, answer_id
            FROM user_answers
            WHERE user_id = $1;
        `;

        const { rows } = await pool.query(query, [user_id]);

        const answers = rows.reduce((acc, row) => {
            acc[row.question_id] = row.answer_id;
            return acc;
        }, {});

        res.json({ success: true, answers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

app.post('/api/changeNewsletterSubscription', async (req, res) => {
    let { email, user_id, subscribing = true } = req.body;


    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    user_id = user_id || '';
    try {
        const queryText = `
            INSERT INTO user_profiles (user_id, email, subscribed_newsletter)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, email)
            DO UPDATE SET subscribed_newsletter = $3
        `;
        const values = [user_id, email, subscribing];
        await pool.query(queryText, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating subscription.' });
    }
});

app.post('/api/changeNewsletterSubscription', async (req, res) => {
    let { email, user_id, subscribing = true } = req.body;


    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    user_id = user_id || '';
    try {
        const queryText = `
            INSERT INTO user_profiles (user_id, email, subscribed_newsletter)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, email)
            DO UPDATE SET subscribed_newsletter = $3
        `;
        const values = [user_id, email, subscribing];
        await pool.query(queryText, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating subscription.' });
    }
});

app.post('/api/changeEmailNewJobRecsSubscription', async (req, res) => {
    let { email, user_id, subscribing = true } = req.body;


    if (!email || !user_id) {
        return res.status(400).json({ success: false, message: 'Email and user_id required.' });
    }
    user_id = user_id || '';
    try {
        const queryText = `
            INSERT INTO user_profiles (user_id, email, subscribed_new_job_recs)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, email)
            DO UPDATE SET subscribed_new_job_recs = $3
        `;
        const values = [user_id, email, subscribing];
        await pool.query(queryText, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating subscription.' });
    }
});

app.post('/api/changeEmailNewJobRecsSubscription', async (req, res) => {
    let { email, user_id, subscribing = true } = req.body;


    if (!email || !user_id) {
        return res.status(400).json({ success: false, message: 'Email and user_id required.' });
    }
    try {
        const queryText = `
            INSERT INTO user_profiles (user_id, email, subscribed_new_job_recs)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, email)
            DO UPDATE SET subscribed_new_job_recs = $3
        `;
        const values = [user_id, email, subscribing];
        await pool.query(queryText, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating subscription.' });
    }
});

app.post('/api/changeSuspendedStatus', async (req, res) => {
    let { email, user_id, suspended = true } = req.body;


    if (!email || !user_id) {
        return res.status(400).json({ success: false, message: 'Email and user_id required.' });
    }
    try {
        const queryText = `
            INSERT INTO user_profiles (user_id, email, suspended)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, email)
            DO UPDATE SET suspended = $3
        `;
        const values = [user_id, email, suspended];
        await pool.query(queryText, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Database error while deleting account:', error);
        res.status(500).json({ success: false, message: 'An error occurred while Suspending account.' });
    }
});

app.get('/api/getUserProfile', async (req, res) => {
    const { user_id, email } = req.query;



    if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    try {
        let queryText = `SELECT * FROM user_profiles WHERE user_id = $1`;
        const values = [user_id];
        const result = await pool.query(queryText, values);
        // console.log(result.rows[0]);

        // If there is no result for this query then the user hasn't been added to the user_profiles table yet,
        // so add them with default values
        if (result.rowCount === 0) {
            const insertQueryText = `INSERT INTO user_profiles (user_id, email, subscribed_newsletter, subscribed_new_job_recs, suspended)
            VALUES ($1, $2, $3, $4, $5)`;
            const insertValues = [user_id, email, false, false, false];
            const result2 = await pool.query(insertQueryText, insertValues);
        }

        // Query for the users answers in user_answers table, and make answered object with question_id as key and answer_id as value
        queryText = `SELECT question_id, answer_id FROM user_answers WHERE user_id = $1`;
        const result3 = await pool.query(queryText, values);
        const answered = result3.rows.reduce((acc, curr) => {
            acc[curr.question_id] = curr.answer_id;
            return acc;
        }, {});
        res.json({ success: true, profile: result.rows[0], answers: answered });

        // console.log(...result.rows[0]);
        // res.json({ success: true, profile: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching user profile.' });
    }
});

// api endpoint deleteUserAccount which deletes all rows in user_profiles with user_id matching
// the one specified in the post request body user_id field. Send success: true json or error if applicable.
app.post('/api/deleteUserAccount', async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).send({ error: 'Missing user_id parameter' });
        }
        const deleteAccountQuery = {
            text: 'DELETE FROM user_profiles WHERE user_id = $1 returning *',
            values: [user_id],
        };
        const result = await pool.query(deleteAccountQuery);

        if (result.rowCount === 0) {
            return res.status(409).send({ error: 'Error deleting account, user_id not found:', error });
        }

        console.log('Delete successful');
        res.send({ success: true });
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: "Internal Server Error" });
});

app.listen(PORT, function () {
    console.error(`Node PID ${process.pid}: listening on port ${PORT}`);
});