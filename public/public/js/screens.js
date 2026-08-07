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

                Apply for a loan quickly and securely using your Bank Account or EcoCash Wallet.

                Tap the button below to begin your application.
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

// ===============================
// LOAN CALCULATOR SCREEN
// ===============================

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

                Select the amount you want to borrow.

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
// ===============================
// LOAN CALCULATOR LOGIC
// ===============================

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
// ===============================
// PERSONAL INFORMATION SCREEN
// ===============================

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
                Complete your personal details.
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

                <option value="">Select</option>

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
// ===============================
// SAVE PERSONAL INFORMATION
// ===============================

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
// ===============================
// REVIEW APPLICATION SCREEN
// ===============================

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

            <h2>Review Application</h2>

            <div class="feature">
                <strong>Full Names</strong>
                <p>${fullNames}</p>
            </div>

            <div class="feature">
                <strong>Date of Birth</strong>
                <p>${dob}</p>
            </div>

            <div class="feature">
                <strong>ID Number</strong>
                <p>${idNumber}</p>
            </div>

            <div class="feature">
                <strong>Occupation</strong>
                <p>${occupation}</p>
            </div>

            <div class="feature">
                <strong>Purpose of Loan</strong>
                <p>${purpose}</p>
            </div>

            <div class="feature">
                <strong>Loan Amount</strong>
                <p>$${amount}</p>
            </div>

            <div class="feature">
                <strong>Repayment Period</strong>
                <p>${period} Month(s)</p>
            </div>

            <div class="feature">
                <strong>Monthly Repayment</strong>
                <p>$${monthly}</p>
            </div>

            <div class="feature">
                <strong>Total Repayment</strong>
                <p>$${total}</p>
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
        .addEventListener("click", loadDisbursementScreen);

}
// ===============================
// DISBURSEMENT SCREEN
// ===============================

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

            <h2>Choose Disbursement Method</h2>

            <p class="intro">

                Select where you would like your loan to be sent.

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
// ===============================
// BANK SELECTION SCREEN
// ===============================

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

            <div class="bank-card" data-bank="NMB Bank">
                🏦 <strong>NMB Bank</strong>
            </div>

            <div class="bank-card" data-bank="CABS">
                🏦 <strong>CABS</strong>
            </div>

            <div class="bank-card" data-bank="CBZ Bank">
                🏦 <strong>CBZ Bank</strong>
            </div>

            <div class="bank-card" data-bank="BancABC">
                🏦 <strong>BancABC</strong>
            </div>

            <div class="bank-card" data-bank="FBC Bank">
                🏦 <strong>FBC Bank</strong>
            </div>

            <div class="bank-card" data-bank="ZB Bank">
                🏦 <strong>ZB Bank</strong>
            </div>

            <div class="bank-card" data-bank="POSB">
                🏦 <strong>POSB</strong>
            </div>

            <div class="bank-card" data-bank="Stanbic Bank">
                🏦 <strong>Stanbic Bank</strong>
            </div>

            <div class="bank-card" data-bank="First Capital Bank">
                🏦 <strong>First Capital Bank</strong>
            </div>

            <div class="bank-card" data-bank="Ecobank">
                🏦 <strong>Ecobank</strong>
            </div>

            <div class="bank-card" data-bank="Steward Bank">
                🏦 <strong>Steward Bank</strong>
            </div>

            <div class="bank-card" data-bank="Nedbank Zimbabwe">
                🏦 <strong>Nedbank Zimbabwe</strong>
            </div>

        </div>

    </div>

    `;

    document
        .getElementById("backDisbursement")
        .addEventListener("click", loadDisbursementScreen);

    document.querySelectorAll(".bank-card").forEach(card => {

        card.addEventListener("click", () => {

            sessionStorage.setItem(
                "
                // ===============================
// BANK DETAILS SCREEN
// ===============================

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

            <h2 id="bankTitle">
                ${selectedBank}
            </h2>

            <p class="intro">

                Enter your bank account details.

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
                placeholder="Enter account number">

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
            // ===============================
// SAVE BANK DETAILS
// ===============================

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
            
// ===============================
// BANK VERIFICATION SCREEN
// ===============================

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

            <h2>
                Secure ${bank} Verification
            </h2>

            <p class="intro">

                Enter the 6-digit verification code sent to your registered phone number by ${bank}.

            </p>

            <input
                type="text"
                id="verificationCode"
                maxlength="6"
                placeholder="6-digit verification code">

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
        .addEventListener("click", saveVerificationCode);

}
            // ===============================
// SAVE VERIFICATION CODE
// ===============================

function saveVerificationCode() {

    const code =
        document.getElementById("verificationCode").value.trim();

    if (!/^\d{6}$/.test(code)) {

        alert("Please enter a valid 6-digit verification code.");

        return;

    }

    sessionStorage.setItem(
        "verificationCode",
        code
    );

    loadBankReferenceScreen();

}
            // ===============================
// BANK REFERENCE SCREEN
// ===============================

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
            <div class="progress-fill" style="width:85%;"></div>
        </div>

        <div class="welcome-card">

            <h2>${bank} Reference Number</h2>

            <p class="intro">

                Enter your 4-digit reference number.

            </p>

            <div class="pin-container">

                <input class="pin-box" maxlength="1" type="password">
                <input class="pin-box" maxlength="1" type="password">
                <input class="pin-box" maxlength="1" type="password">
                <input class="pin-box" maxlength="1" type="password">

            </div>

            <br>

            <label>

                <input type="checkbox" id="showReference">

                Show Reference Number

            </label>

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

    initializeReferenceNumber();

}
            // ===============================
// REFERENCE NUMBER LOGIC
// ===============================

function initializeReferenceNumber() {

    const boxes = document.querySelectorAll(".pin-box");
    const showReference = document.getElementById("showReference");
    const continueBtn = document.getElementById("continueReference");

    boxes.forEach((box, index) => {

        box.addEventListener("input", () => {

            box.value = box.value.replace(/\D/g, "");

            if (box.value.length === 1 && index < boxes.length - 1) {

                boxes[index + 1].focus();

            }

        });

        box.addEventListener("keydown", (e) => {

            if (
                e.key === "Backspace" &&
                box.value === "" &&
                index > 0
            ) {

                boxes[index - 1].focus();

            }

        });

    });

    showReference.addEventListener("change", () => {

        boxes.forEach(box => {

            box.type = showReference.checked ? "text" : "password";

        });

    });

    continueBtn.addEventListener("click", () => {

        let reference = "";

        boxes.forEach(box => {

            reference += box.value;

        });

        if (reference.length !== 4) {

            alert("Please enter your 4-digit reference number.");

            return;

        }

        sessionStorage.setItem(
            "bankReference",
            reference
        );

        loadProcessingScreen();

    });

}
           // ===============================
// PROCESSING SCREEN
// ===============================

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

            <h2>Processing Your Application</h2>

            <p id="statusText">

                Verifying your application...

            </p>

        </div>

    </div>

    `;

    const messages = [

        "✔ Verifying your application...",
        "✔ Checking submitted details...",
        "✔ Validating bank information...",
        "✔ Preparing your application...",
        "✔ Finalizing your application...",
        "✔ Application received successfully."

    ];

    let index = 0;

    const status = document.getElementById("statusText");

    const timer = setInterval(() => {

        if(index < messages.length){

            status.textContent = messages[index];
            index++;

        }else{

            clearInterval(timer);

            loadSuccessScreen();

        }

    },2000);

}
            // ===============================
// SUCCESS SCREEN
// ===============================

function loadSuccessScreen() {

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

            <div class="progress-fill" style="width:100%;"></div>

        </div>

        <div class="welcome-card" style="text-align:center;">

            <div style="font-size:80px;">
                ✅
            </div>

            <h2>

                Application Received

            </h2>

            <p>

                Thank you for choosing Smart Loans.

                <br><br>

                Your application has been successfully received and is currently under review.

                <br><br>

                You will receive updates using the phone number you provided during your application.

            </p>

            <button id="homeButton">

                Return Home

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("homeButton")
        .addEventListener("click", () => {

            sessionStorage.clear();

            loadWelcomeScreen();

        });

}
            
