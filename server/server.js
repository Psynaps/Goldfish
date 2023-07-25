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



app.post('/api/postJob', async (req, res) => {
    try {
        console.log("postJob req received");
        // console.log(req.body);
        const client = await pool.connect();

        const { user_id, home_office_address, job_title, jobData } = req.body;
        let job_posting_id = req.body.job_posting_id;

        // Convert the jobData string to an object
        const jobDataObj = JSON.parse(jobData);

        // Upsert into job_postings
        let result;
        let query;
        if (!job_posting_id) {
            query = {
                text: `INSERT INTO job_postings (user_id, home_office_address, job_title) 
            VALUES ($1, $2, $3) 
            RETURNING job_posting_id`,
                values: [user_id, home_office_address, job_title],
            };
        } else {
            query = {
                text: `UPDATE job_postings SET home_office_address = $2, job_title = $3
            WHERE job_posting_id = $1
            RETURNING job_posting_id`,
                values: [job_posting_id, home_office_address, job_title],
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
            home_office_address: jobProfileData.home_office_address,
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
        const { user_id, job_title, salary_base, salary_ote, ote_value, home_office_address, active, job_posting_id } = req.body;
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
            const queryText = `INSERT INTO job_postings(user_id, job_title, salary_base, salary_ote, ote_value, home_office_address, active)
                                VALUES($1, $2, $3, $4, $5, $6, $7) 
                                RETURNING job_posting_id, date_created;`;
            const queryValues = [user_id, job_title, salary_base, salary_ote, ote_value, home_office_address, active];

            const { rows } = await pool.query(queryText, queryValues);
            res.send({ success: true, job_posting_id: rows[0].job_posting_id, date_created: rows[0].date_created });

        } else {
            const queryText = `UPDATE job_postings SET user_id = $1, job_title = $2, salary_base = $3, salary_ote = $4, 
                                ote_value = $5, home_office_address = $6, active = $7 
                                WHERE job_posting_id = $8 
                                RETURNING job_posting_id;`;
            const queryValues = [user_id, job_title, salary_base, salary_ote, ote_value, home_office_address, active, job_posting_id];

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
            text: 'SELECT job_posting_id, job_title, salary_base, salary_ote, ote_value, home_office_address, active, date_created FROM job_postings WHERE user_id = $1',
            values: [user_id],
        };
        const result = await client.query(jobProfileQuery);

        if (!result) {
            return res.status(404).send({ error: 'Job postings not found' });
        }

        // Construct the response object
        const responseObject = result.rows.map((row) => { return { job_posting_id: row.job_posting_id, job_title: row.job_title, salary_base: row.salary_base, salary_ote: row.salary_ote, ote_value: row.ote_value, home_office_address: row.home_office_address, active: row.active, date_created: row.date_created }; });
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

        const { user_id, companyname, website, linkedin, companysize, producttype,
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
                    (user_id, companyname, website, linkedin, companysize, producttype, companylogo,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
                    ON CONFLICT (user_id) 
                    DO UPDATE SET 
                    companyname = EXCLUDED.companyname, website = EXCLUDED.website, linkedin = EXCLUDED.linkedin, 
                    companysize = EXCLUDED.companysize, producttype = EXCLUDED.producttype, companyLogo = EXCLUDED.companyLogo, 
                    office1 = EXCLUDED.office1, office2 = EXCLUDED.office2, office3 = EXCLUDED.office3, 
                    medical1 = EXCLUDED.medical1, medical2 = EXCLUDED.medical2, medical3 = EXCLUDED.medical3, 
                    medical4 = EXCLUDED.medical4, medical5 = EXCLUDED.medical5, 
                    pto1 = EXCLUDED.pto1, pto2 = EXCLUDED.pto2, pto3 = EXCLUDED.pto3, pto4 = EXCLUDED.pto4,
                    financial1 = EXCLUDED.financial1, financial2 = EXCLUDED.financial2, financial3 = EXCLUDED.financial3, 
                    financial4 = EXCLUDED.financial4`,
                values: [user_id, companyname, website, linkedin, companysize, producttype, companyLogo,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4],
            };
        } else {
            query = {
                text: `
                    INSERT INTO employer_profiles 
                    (user_id, companyname, website, linkedin, companysize, producttype,
                    office1, office2, office3,
                    medical1, medical2, medical3, medical4, medical5,
                    pto1, pto2, pto3, pto4,
                    financial1, financial2, financial3, financial4) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
                    ON CONFLICT (user_id) 
                    DO UPDATE SET 
                    companyname = EXCLUDED.companyname, website = EXCLUDED.website, linkedin = EXCLUDED.linkedin, 
                    companysize = EXCLUDED.companysize, producttype = EXCLUDED.producttype, 
                    office1 = EXCLUDED.office1, office2 = EXCLUDED.office2, office3 = EXCLUDED.office3, 
                    medical1 = EXCLUDED.medical1, medical2 = EXCLUDED.medical2, medical3 = EXCLUDED.medical3, 
                    medical4 = EXCLUDED.medical4, medical5 = EXCLUDED.medical5, 
                    pto1 = EXCLUDED.pto1, pto2 = EXCLUDED.pto2, pto3 = EXCLUDED.pto3, pto4 = EXCLUDED.pto4,
                    financial1 = EXCLUDED.financial1, financial2 = EXCLUDED.financial2, financial3 = EXCLUDED.financial3, 
                    financial4 = EXCLUDED.financial4`,
                values: [user_id, companyname, website, linkedin, companysize, producttype,
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
        const client = await pool.connect();
        const deleteJobQuery = {
            text: 'DELETE FROM job_postings WHERE job_posting_id = $1 AND user_id = $2 RETURNING *',
            values: [job_posting_id, user_id],
        };
        const result = await client.query(deleteJobQuery);

        if (result.rowCount === 0) {
            return res.status(409).send({ error: 'Job posting not found. Please refresh the jobs list.' });
        }

        console.log('Delete successful');
        res.send({ success: true });
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


app.post('/api/setUserAnswer', async (req, res) => {
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
    console.log('getUserAnswers req received', user_id);

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