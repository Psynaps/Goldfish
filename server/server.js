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

//function generateMatches which optionally takes in a user_id and searches for matches for that user, 
// updating the job_candidate_matches table with the results
// if no user_id is provided, it will search for matches for all users
async function generateMatches(user_id = null) {
    console.log("generateMatches req received");
    // console.log(req.body);
    try {
        const client = await pool.connect();
        // query job_postings table for all active job postings
        // for now just get the first one to 3 job postings and generate matches for them
        const job_postings = await client.query('SELECT * FROM job_postings WHERE active = true LIMIT 3');
        if (!user_id) {
            // query users table for all users
            const users = await client.query('SELECT user_id FROM user_profiles');
            user_id = users.rows[0].user_id;
        }


        // add entry to job_candidate_matches table for each job posting
        if (!job_postings?.rows) {
            console.log('no job postings found to generate matches for');
            return;
        }
        for (const job_posting of job_postings.rows) {
            const querytext = `INSERT INTO job_candidate_matches (job_posting_id, candidate_user_id, status, isRevealed, match_scores)
            VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING;`;
            const values = [job_posting.job_posting_id, user_id, 'matched', false, [Math.random(), Math.random(), Math.random(), Math.random()]]; //treat first index as overall, next 3 are breakdown of each category
            const res = await client.query(querytext, values);
            client.release();
        }
    } catch (err) {
        console.error(err);
    }
}






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
            const [answer_ids, importance] = jobDataObj[question_id];
            query = {
                text: 'INSERT INTO job_posting_questions (job_posting_id, question_id, answer_ids, importance) VALUES ($1, $2, $3, $4)',
                values: [job_posting_id, question_id, answer_ids, importance],
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
            text: 'SELECT question_id, answer_ids, importance FROM job_posting_questions WHERE job_posting_id = $1',
            values: [job_posting_id],
        };
        const jobQuestionsResult = await client.query(jobQuestionsQuery);
        const jobQuestionsData = jobQuestionsResult.rows.reduce((acc, curr) => {
            // acc[curr.question_id] = {
            //     answer_ids: curr.answer_ids,
            //     nonanswer_ids: curr.nonanswer_ids,
            //     importance: curr.importance
            // };
            acc[curr.question_id] = [curr.answer_ids, curr.importance];
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
        const { user_id, job_title, location, salary, hourly_rate, contract_term, flexibility, work_from_home, visa, travel, active, job_posting_id } = req.body;
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
            const queryText = `INSERT INTO job_postings(user_id, job_title, job_location, salary, hourly_rate, contract_term, flexibility, work_from_home, visa, travel, active)
                                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
                                RETURNING job_posting_id, date_created;`;
            const queryValues = [user_id, job_title, location, salary, hourly_rate, contract_term, flexibility, work_from_home, visa, travel, active];

            const { rows } = await pool.query(queryText, queryValues);
            res.send({ success: true, job_posting_id: rows[0].job_posting_id, date_created: rows[0].date_created });

        } else {
            const queryText = `UPDATE job_postings SET user_id = $1, job_title = $2, job_location = $3, salary = $4, 
            hourly_rate = $5, contract_term = $6, flexibility = $7, work_from_home = $8, visa = $9, travel = $10, active = $11 
                                WHERE job_posting_id = $12 
                                RETURNING job_posting_id;`;
            const queryValues = [user_id, job_title, location, salary, hourly_rate, contract_term, flexibility, work_from_home, visa, travel, active, job_posting_id];

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
    console.log('test1');
    if (!user_id) {
        return res.status(400).send({ error: 'Missing user_id query parameter' });
    }

    try {
        const client = await pool.connect();

        // Get job profile information
        const jobProfileQuery = {
            text: 'SELECT job_posting_id, job_title, job_location, salary, hourly_rate, contract_term, flexibility, work_from_home, visa, travel, active, date_created FROM job_postings WHERE user_id = $1',
            values: [user_id],
        };
        const result = await client.query(jobProfileQuery);

        if (!result) {
            return res.status(404).send({ error: 'Job postings not found' });
        }

        // Construct the response object
        const responseObject = result.rows.map((row) => { return { job_posting_id: row.job_posting_id, job_title: row.job_title, location: row.job_location, salary: row.salary, hourly_rate: row.hourly_rate, contract_term: row.contract_term, flexibility: row.flexibility, work_from_home: row.work_from_home, visa: row.visa, travel: row.travel, active: row.active, date_created: row.date_created }; });
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
    let { email, user_id, subscribing = true, user_type } = req.body;

    if (!user_type) {
        return res.status(400).json({ success: false, message: 'User type is required.' });
    }
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    user_id = user_id || '';
    try {
        const queryText = `
            INSERT INTO user_profiles (user_id, email, subscribed_newsletter, user_type)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, email)
            DO UPDATE SET subscribed_newsletter = $3
        `;
        const values = [user_id, email, subscribing, user_type];
        await pool.query(queryText, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating subscription.' });
    }
});


//TODO: determine if duplicate
/*
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
*/

app.post('/api/changeEmailNewJobRecsSubscription', async (req, res) => {
    let { email, user_id, subscribing = true, user_type } = req.body;


    if (!user_type) {
        return res.status(400).json({ success: false, message: 'User type is required.' });
    }
    if (!email || !user_id) {
        return res.status(400).json({ success: false, message: 'Email and user_id required.' });
    }
    user_id = user_id || '';
    try {
        const queryText = `
            INSERT INTO user_profiles (user_id, email, subscribed_new_job_recs, user_type)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, email)
            DO UPDATE SET subscribed_new_job_recs = $3
        `;
        const values = [user_id, email, subscribing, user_type];
        await pool.query(queryText, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating subscription.' });
    }
});

// TODO: determine if duplicate
/*
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
*/

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
    const user_type_default = 'c'; //candidate default if no user type is specified


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
            const insertQueryText = `INSERT INTO user_profiles (user_id, email, user_type, subscribed_newsletter, subscribed_new_job_recs, suspended)
            VALUES ($1, $2, $3, $4, $5, $6)`;
            const insertValues = [user_id, email, 'c', false, false, false];
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

// endpoint getEmployerMatches which takes in user_id as a query parameter and returns a 
// object containing match objects for each job_posting the user has created. Each match object is an 
// array of candidate objects which contain user_id, match_score array (same as in getUserMatches), and date_matched.
// currently the returned list of candidates is hardcoded, but will be replaced with real data
app.get('/api/getEmployerMatches', async (req, res) => {
    const user_id = req.query.user_id;
    console.log('getEmployerMatches req received');
    if (!user_id) {
        return res.status(400).send({ error: 'Missing user_id query parameter' });
    }

    try {
        generateMatches();
        const client = await pool.connect();
        //first need to get job_posting_ids for this user
        const jobPostingIdsQuery = {
            text: 'SELECT job_posting_id FROM job_postings WHERE user_id = $1',
            values: [user_id],
        };
        const jobPostingIdsResult = await client.query(jobPostingIdsQuery);
        const jobPostingIds = jobPostingIdsResult.rows.map((row) => row.job_posting_id);
        console.log('jobpostingids', jobPostingIds);

        // get all entries in job_candidate_matches table for each job_posting_id, building them 
        // into a matches object with an array of candidates for each job_posting_id
        const matches = {};
        for (const job_posting_id of jobPostingIds) {
            const matchQuery = {
                text: 'SELECT * FROM job_candidate_matches WHERE job_posting_id = $1 AND status IN (\'matched\', \'applied\', \'accepted\') ORDER BY match_scores[1] DESC',
                values: [job_posting_id],
            };
            const matchResult = await client.query(matchQuery);
            console.log('result', matchResult.rows);
            const matchData = matchResult.rows.map((row) => {
                return {
                    match_id: row.match_id,
                    user_id: row.candidate_user_id,
                    match_scores: row.match_scores,
                    date_matched: row.created_at,
                    status: row.status,
                    isRevealed: row.is_revealed,
                };
            });
            matches[job_posting_id] = matchData;

        }
        client.release();
        res.send({ success: true, matches: matches });
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