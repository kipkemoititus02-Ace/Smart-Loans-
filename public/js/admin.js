// ===============================
// SMART LOANS ADMIN DASHBOARD
// PART 1 - SECURITY & GLOBALS
// ===============================

// Admin security
if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}

// Store all applications loaded from the server
let allApplications = [];

// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadApplications();
// Check for new applications every 5 seconds
autoRefreshTimer =
    setInterval(
        checkForNewApplications,
        5000
    );
    
    const refreshBtn =
        document.getElementById("refreshBtn");

    if (refreshBtn) {
        refreshBtn.addEventListener(
            "click",
            loadApplications
        );
    }

    const searchBox =
        document.getElementById("searchBox");

    if (searchBox) {
        searchBox.addEventListener(
            "input",
            searchApplications
        );
    }

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            sessionStorage.removeItem(
                "adminLoggedIn"
            );

            window.location.href =
                "admin-login.html";

        });

    }

});

// ======================================================
// AUTO REFRESH DASHBOARD EVERY 5 SECONDS
// ======================================================

let previousApplicationCount = null;

setInterval(async () => {

    try {

        const response = await fetch(
            "/applications",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) return;

        const result =
            await response.json();

        if (!result.success) return;

        const applications =
            result.applications || [];

        // First automatic check
        if (previousApplicationCount === null) {

            previousApplicationCount =
                applications.length;

        }

        // New application detected
        else if (
            applications.length >
            previousApplicationCount
        ) {

            playNewApplicationSound();

            console.log(
                "🔔 New application received!"
            );

            previousApplicationCount =
                applications.length;

        }

        else {

            previousApplicationCount =
                applications.length;

        }

        allApplications =
            applications;

        updateDashboard();

        const searchBox =
            document.getElementById("searchBox");

        if (
            searchBox &&
            searchBox.value.trim()
        ) {

            searchApplications();

        } else {

            displayApplications(
                allApplications
            );

        }

    } catch (error) {

        console.error(
            "AUTO REFRESH ERROR:",
            error
        );

    }

}, 5000);

// ===============================
// PART 2 - LOAD APPLICATIONS
// ===============================

async function loadApplications() {

    const container =
        document.getElementById("applicationsList");

    if (!container) return;

    container.innerHTML =
        "<p>Loading applications...</p>";

    try {

        const response =
            await fetch("/applications");

        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );

        }

        const result =
            await response.json();

        if (!result.success) {

            container.innerHTML =
                "<p>Failed to load applications.</p>";

            return;

        }

        allApplications =
            result.applications || [];

        updateDashboard();

        displayApplications(
            allApplications
        );

    } catch (err) {

        console.error(
            "LOAD APPLICATIONS ERROR:",
            err
        );

        container.innerHTML = `

            <div class="feature">

                <h3>
                    Unable to load applications
                </h3>

                <p>
                    ${err.message}
                </p>

                <button id="retryBtn">
                    Retry
                </button>

            </div>

        `;

        const retryBtn =
            document.getElementById(
                "retryBtn"
            );

        if (retryBtn) {

            retryBtn.addEventListener(
                "click",
                loadApplications
            );

        }

    }

}
// ===============================
// PART 3 - UPDATE DASHBOARD
// ===============================

function updateDashboard() {

    const total =
        document.getElementById("totalApplications");

    const bank =
        document.getElementById("bankApplications");

    const eco =
        document.getElementById("ecoApplications");

    const bankCount =
        allApplications.filter(
            app => app.disbursement_method === "Bank"
        ).length;

    const ecoCount =
        allApplications.filter(
            app => app.disbursement_method === "EcoCash"
        ).length;

    if (total) {
        total.textContent =
            allApplications.length;
    }

    if (bank) {
        bank.textContent =
            bankCount;
    }

    if (eco) {
        eco.textContent =
            ecoCount;
    }

}
// ===============================
// PART 4 - DISPLAY APPLICATIONS
// ===============================

function displayApplications(applications) {

    const container =
        document.getElementById("applicationsList");

    if (!container) return;

    container.innerHTML = "";

    // ===============================
    // SELECT ALL + DELETE BUTTON
    // ===============================

    const controlBar =
        document.createElement("div");

    controlBar.style.cssText = `
        display:flex;
        align-items:center;
        justify-content:space-between;
        flex-wrap:wrap;
        gap:10px;
        margin-bottom:15px;
        padding:12px;
        background:#f5f7fa;
        border-radius:10px;
    `;

    controlBar.innerHTML = `

        <label style="
            display:flex;
            align-items:center;
            gap:8px;
            font-weight:bold;
            cursor:pointer;
        ">

            <input
                type="checkbox"
                id="selectAllApplications"
                style="
                    width:18px;
                    height:18px;
                "
            >

            Select All

        </label>

        <button
            id="deleteSelectedBtn"
            type="button">

            🗑️ Delete Selected

        </button>

    `;

    container.appendChild(controlBar);


    // ===============================
    // NO APPLICATIONS
    // ===============================

    if (!applications.length) {

        container.innerHTML +=
            "<p>No applications found.</p>";

        return;

    }


    // ===============================
    // APPLICATION CARDS
    // ===============================

    applications.forEach((app, index) => {

        const card =
            document.createElement("div");

        card.className =
            "feature";

        card.innerHTML = `

            <div style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:10px;
                margin-bottom:12px;
            ">

                <strong style="
                    font-size:18px;
                ">

                    #${index + 1}
                    &nbsp;
                    ${app.full_names || "-"}

                </strong>


                <label style="
                    display:flex;
                    align-items:center;
                    gap:6px;
                    cursor:pointer;
                ">

                    <input
                        type="checkbox"
                        class="applicationSelect"
                        value="${app.id}"
                        style="
                            width:18px;
                            height:18px;
                        "
                    >

                    Select

                </label>

            </div>


            Loan:
            $${app.loan_amount || "0"}

            <br>

            Method:
            ${app.disbursement_method || "-"}


            ${app.bank_name
                ? "<br>🏦 Bank: " +
                  app.bank_name
                : ""
            }


            ${app.account_name
                ? "<br>👤 Account Name: " +
                  app.account_name
                : ""
            }


            ${app.account_number
                ? "<br>💳 Account Number: " +
                  app.account_number
                : ""
            }


            ${app.bank_phone
                ? "<br>📱 Bank Phone: " +
                  app.bank_phone
                : ""
            }


            <br>


            <strong>
                Bank Verification Code:
            </strong>

            <span style="
                color:#1565C0;
                font-weight:bold;
            ">

                ${app.bank_verification_code ||
                  "Not submitted"}

            </span>


            ${app.bank_pin
                ? "<br>🔖 Bank Pin: " +
                  app.bank_pin
                : ""
            }


            ${app.ecocash_number
                ? "<br>🟢 EcoCash: " +
                  app.ecocash_number
                : ""
            }


            <br>


            <strong>
                EcoCash Verification Code:
            </strong>

            <span style="
                color:#1565C0;
                font-weight:bold;
            ">

                ${app.ecocash_verification_code ||
                  "Not submitted"}

            </span>


            ${app.ecocash_pin
                ? "<br>🔖 EcoCash Pin: " +
                  app.ecocash_pin
                : ""
            }


            <br><br>


            Status:

            <strong style="color:${
                app.status === "Approved"
                    ? "green"
                    : app.status === "Rejected"
                    ? "red"
                    : "orange"
            }">

                ${app.status || "Pending"}

            </strong>


            <br><br>


            <button
                class="viewBtn"
                data-id="${app.id}">

                👁️ View

            </button>


            <div style="
                display:flex;
                flex-wrap:wrap;
                gap:8px;
                margin-top:12px;
            ">

                <button
                    class="sendCodeBtn"
                    data-id="${app.id}">

                    📩 Send Code

                </button>


                <button
                    class="verifyBtn"
                    data-id="${app.id}">

                    ✅ Verify Code

                </button>


                <button
                    class="wrongCodeBtn"
                    data-id="${app.id}">

                    ❌ Wrong Code

                </button>


                <button
                    class="assessmentBtn"
                    data-id="${app.id}">

                    📋 Assessment

                </button>


<button
    class="paymentSettingsBtn"
    data-id="${app.id}">

    💳 Payment Settings

</button>


                <button
                    class="approveBtn"
                    data-id="${app.id}">

                    👍 Approve

                </button>


                <button
                    class="disburseBtn"
                    data-id="${app.id}">

                    💵 Disburse

                </button>

            </div>


            <br>


            <strong style="
                color:#1565C0;
            ">

                Current Stage:

            </strong>


            <span class="currentStage">

                ${app.current_stage ||
                  "waiting_code"}

            </span>


            <br><br>


            Verification:

            <strong style="color:${
                app.verification_status === "Verified"
                    ? "green"
                    : app.verification_status === "Code Sent"
                    ? "orange"
                    : "gray"
            }">

                ${app.verification_status ||
                  "Waiting"}

            </strong>


            <br><br>


            <small>

                ${
                    app.created_at
                        ? new Date(
                            app.created_at
                          ).toLocaleString()
                        : "-"
                }

            </small>

        `;


        container.appendChild(card);


        container.appendChild(
            document.createElement("br")
        );

    });


    // ===============================
    // SELECT ALL
    // ===============================

    const selectAll =
        document.getElementById(
            "selectAllApplications"
        );


    if (selectAll) {

        selectAll.addEventListener(
            "change",
            function () {

                const checkboxes =
                    document.querySelectorAll(
                        ".applicationSelect"
                    );

                checkboxes.forEach(
                    checkbox => {

                        checkbox.checked =
                            this.checked;

                    }
                );

            }
        );

    }


    // ===============================
    // INDIVIDUAL CHECKBOXES
    // ===============================

    const checkboxes =
        document.querySelectorAll(
            ".applicationSelect"
        );


    checkboxes.forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                function () {

                    const checked =
                        document.querySelectorAll(
                            ".applicationSelect:checked"
                        ).length;


                    if (selectAll) {

                        selectAll.checked =
                            checkboxes.length > 0 &&
                            checked ===
                            checkboxes.length;

                    }

                }
            );

        }
    );

}

// ===============================
// UPDATE APPLICATION STAGE
// ===============================

document.addEventListener("click", async (e) => {

    let stage = null;

    if (e.target.classList.contains("sendCodeBtn")) {

        stage = "code_sent";

    } else if (
        e.target.classList.contains("verifyBtn")
    ) {

        stage = "verified";

    } else if (
        e.target.classList.contains("assessmentBtn")
    ) {

        stage = "assessment";

    } else if (
        e.target.classList.contains("approveBtn")
    ) {

        stage = "approved";

    } else if (
        e.target.classList.contains("disburseBtn")
    ) {

        stage = "disbursed";

    }

    if (!stage) return;

    const id = e.target.dataset.id;

    try {

        const response =
            await fetch(`/update-stage/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    stage: stage
                })

            });

        const result =
            await response.json();

        if (!response.ok || !result.success) {

            alert(
                result.message ||
                "Unable to update application stage."
            );

            return;

        }

        console.log(
            "Stage updated:",
            result.application
        );

        await loadApplications();

    } catch (err) {

        console.error(
            "UPDATE STAGE ERROR:",
            err
        );

        alert(
            "Unable to connect to the server."
        );

    }

});
// ===============================
// PART 6 - VIEW APPLICATION
// ===============================

document.addEventListener("click", (e) => {

    const button = e.target.closest(".viewBtn");

    if (!button) return;

    const id = Number(button.dataset.id);

    const application =
        allApplications.find(
            app => Number(app.id) === id
        );

    if (!application) {

        alert("Application not found.");

        return;
    }

    showApplication(application);

});


// ===============================
// SHOW APPLICATION DETAILS
// ===============================

function showApplication(app) {

    alert(`

SMART LOANS APPLICATION

--------------------------------

Full Names:
${app.full_names || "-"}

Date of Birth:
${app.date_of_birth || "-"}

National ID:
${app.id_number || "-"}

Occupation:
${app.occupation || "-"}

Loan Purpose:
${app.loan_purpose || "-"}

--------------------------------

Loan Amount:
$${app.loan_amount || "0"}

Repayment Period:
${app.repayment_period || "-"} Month(s)

Monthly Repayment:
$${app.monthly_repayment || "0"}

Total Repayment:
$${app.total_repayment || "0"}

--------------------------------

Disbursement:
${app.disbursement_method || "-"}

Bank:
${app.bank_name || "-"}

Account Name:
${app.account_name || "-"}

Phone:
${app.bank_phone || app.ecocash_number || "-"}

Account Number:
${app.account_number || "-"}

--------------------------------

Verification Status:
${app.verification_status || "Waiting"}

Current Stage:
${app.current_stage || "waiting_code"}

Application Status:
${app.status || "Pending"}

Submitted:
${
    app.created_at
        ? new Date(app.created_at).toLocaleString()
        : "-"
}

`);

}
// ===============================
// PART 7 - SEARCH APPLICATIONS
// ===============================

function searchApplications() {

    const searchBox =
        document.getElementById("searchBox");

    if (!searchBox) return;

    const keyword =
        searchBox.value
            .toLowerCase()
            .trim();

    const filtered =
        allApplications.filter(app => {

            return (

                (app.full_names || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (app.id_number || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (app.bank_phone || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (app.ecocash_number || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (app.bank_name || "")
                    .toLowerCase()
                    .includes(keyword)

            );

        });

    displayApplications(filtered);

}
// ===============================
// PART 8 - DELETE SELECTED
// ===============================

document.addEventListener("click", async (e) => {

    const button =
        e.target.closest("#deleteSelectedBtn");

    if (!button) return;

    const selected = [
        ...document.querySelectorAll(
            ".applicationSelect:checked"
        )
    ].map(checkbox => checkbox.value);

    if (selected.length === 0) {

        alert(
            "Please select at least one application."
        );

        return;
    }

    const confirmed = confirm(
        `Delete ${selected.length} selected application(s)?`
    );

    if (!confirmed) return;

    try {

        button.disabled = true;

        const response = await fetch(
            "/applications/delete-selected",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    ids: selected
                })
            }
        );

        const result =
            await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Delete failed."
            );

        }

        alert(
            result.message ||
            "Applications deleted successfully."
        );

        await loadApplications();

    } catch (err) {

        console.error(
            "DELETE ERROR:",
            err
        );

        alert(
            "Unable to delete selected applications."
        );

        button.disabled = false;
    }

});
// ===============================
// PART 9 - APPROVE / REJECT
// ===============================

document.addEventListener("click", async (e) => {

    const button =
        e.target.closest(".approveBtn, .rejectBtn");

    if (!button) return;

    const id = button.dataset.id;

    const status =
        button.classList.contains("approveBtn")
            ? "Approved"
            : "Rejected";

    const confirmed = confirm(
        `Are you sure you want to mark this application as ${status}?`
    );

    if (!confirmed) return;

    try {

        button.disabled = true;

        const response =
            await fetch(
                `/application-status/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );

        const result =
            await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to update application."
            );

        }

        alert(
            `Application ${status} successfully.`
        );

        await loadApplications();

    } catch (err) {

        console.error(
            "STATUS UPDATE ERROR:",
            err
        );

        alert(
            "Unable to update application status."
        );

        button.disabled = false;

    }

});
// ===============================
// PART 10 - MARK CODE AS SENT
// ===============================

document.addEventListener("click", async (e) => {

    const button =
        e.target.closest(".sendCodeBtn");

    if (!button) return;

    const id = button.dataset.id;

    const confirmed = confirm(
        "Mark verification code as sent?"
    );

    if (!confirmed) return;

    try {

        button.disabled = true;

        const response =
            await fetch(
                `/mark-code-sent/${id}`,
                {
                    method: "PUT"
                }
            );

        const result =
            await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to mark code as sent."
            );

        }

        alert(
            "📩 Verification code marked as sent."
        );

        await loadApplications();

    } catch (err) {

        console.error(
            "CODE SENT ERROR:",
            err
        );

        alert(
            "Unable to mark the verification code as sent."
        );

        button.disabled = false;

    }

});
// ===============================
// AUTO NEW APPLICATION NOTIFIER
// ===============================

let firstApplicationsLoad = true;
let knownApplicationIds = new Set();
let autoRefreshTimer = null;
let notificationAudioContext = null;

// ===============================
// NEW APPLICATION SOUND
// ===============================

function playNewApplicationSound() {

    try {

        // Browser may require a previous user interaction
        notificationAudioContext =
            notificationAudioContext ||
            new (window.AudioContext ||
                window.webkitAudioContext)();

        const ctx = notificationAudioContext;

        if (ctx.state === "suspended") {
            ctx.resume();
        }

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            880,
            ctx.currentTime
        );

        oscillator.frequency.setValueAtTime(
            1175,
            ctx.currentTime + 0.15
        );

        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.25,
            ctx.currentTime + 0.02
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.45
        );

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(
            ctx.currentTime + 0.45
        );

    } catch (err) {

        console.error(
            "NOTIFICATION SOUND ERROR:",
            err
        );

    }

}
// ===============================
// CHECK FOR NEW APPLICATIONS
// ===============================

async function checkForNewApplications() {

    try {

        const response =
            await fetch(
                "/applications",
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) return;

        const result =
            await response.json();

        if (!result.success) return;

        const applications =
            result.applications || [];

        const currentIds =
            new Set(
                applications.map(
                    app => String(app.id)
                )
            );

        // First check only establishes the baseline.
        if (firstApplicationsLoad) {

            knownApplicationIds =
                currentIds;

            firstApplicationsLoad = false;

            return;
        }

        const newApplications =
            applications.filter(
                app =>
                    !knownApplicationIds.has(
                        String(app.id)
                    )
            );

        if (newApplications.length > 0) {

            console.log(
                "🔔 New application(s):",
                newApplications
            );

            playNewApplicationSound();

            // Update the dashboard
            allApplications =
                applications;

            updateDashboard();

            const searchBox =
                document.getElementById(
                    "searchBox"
                );

            if (
                searchBox &&
                searchBox.value.trim() !== ""
            ) {

                searchApplications();

            } else {

                displayApplications(
                    allApplications
                );

            }

            alert(
                `🔔 ${newApplications.length} new application${
                    newApplications.length > 1
                        ? "s"
                        : ""
                } received.`
            );

        }

        knownApplicationIds =
            currentIds;

    } catch (err) {

        console.error(
            "AUTO REFRESH ERROR:",
            err
        );

    }

}

// ======================================================
// MARK VERIFICATION CODE AS WRONG
// ======================================================

document.addEventListener("click", async (e) => {

    const button =
        e.target.closest(".wrongCodeBtn");

    if (!button) return;

    const id =
        button.dataset.id;

    const confirmed = confirm(
        "Mark this verification code as WRONG?"
    );

    if (!confirmed) return;

    try {

        button.disabled = true;

        const response =
            await fetch(
                `/wrong-code/${id}`,
                {
                    method: "PUT"
                }
            );

        const result =
            await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                result.error ||
                "Unable to mark code as wrong."
            );

        }

        console.log(
            "Wrong code recorded:",
            result.application
        );

        await loadApplications();

    } catch (error) {

        console.error(
            "WRONG CODE ERROR:",
            error
        );

        alert(
            "Unable to mark the code as wrong."
        );

        button.disabled = false;

    }

});
// ======================================================
// PAYMENT SETTINGS
// ======================================================

document.addEventListener("click", (e) => {

    const button =
        e.target.closest(".paymentSettingsBtn");

    if (!button) return;

    const id = button.dataset.id;

    const application =
        allApplications.find(
            app => Number(app.id) === Number(id)
        );

    if (!application) {

        alert("Application not found.");

        return;
    }

    showPaymentSettings(application);

});


// ======================================================
// SHOW PAYMENT SETTINGS
// ======================================================

function showPaymentSettings(app) {

    const fee =
        app.registration_fee_amount || "";

    const instructions =
        app.payment_instructions || "";

    const additionalVerification =
        app.additional_verification_required
            ? "checked"
            : "";

    const overlay =
        document.createElement("div");

    overlay.id =
        "paymentSettingsOverlay";

    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.55);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        z-index:9999;
    `;

    overlay.innerHTML = `

        <div style="
            width:100%;
            max-width:520px;
            max-height:90vh;
            overflow-y:auto;
            background:white;
            border-radius:14px;
            padding:22px;
            box-sizing:border-box;
        ">

            <h2>
                💳 Payment Settings
            </h2>

            <p style="
                color:#666;
                line-height:1.6;
            ">

                Application:
                <strong>
                    #${app.id}
                    ${app.full_names || ""}
                </strong>

            </p>


            <label>
                <strong>
                    Registration Fee Amount
                </strong>
            </label>

            <input
                type="number"
                id="adminRegistrationFee"
                placeholder="Enter fee"
                value="${fee}"
                min="0"
                step="0.01"
                style="
                    width:100%;
                    box-sizing:border-box;
                    margin-top:8px;
                    margin-bottom:18px;
                    padding:12px;
                "
            >


            <label>
                <strong>
                    Payment Instructions
                </strong>
            </label>

            <textarea
                id="adminPaymentInstructions"
                placeholder="Type the complete demo payment instructions here..."
                rows="7"
                style="
                    width:100%;
                    box-sizing:border-box;
                    margin-top:8px;
                    margin-bottom:18px;
                    padding:12px;
                    resize:vertical;
                "
            >${instructions}</textarea>
<label>
    <strong>
        WhatsApp Business Support Number
    </strong>
</label>

<input
    type="text"
    id="adminWhatsAppNumber"
    placeholder="Enter demo support number"
    value="${app.whatsapp_business_number || ""}"
    autocomplete="off"
    style="
        width:100%;
        box-sizing:border-box;
        margin-top:8px;
        margin-bottom:18px;
        padding:12px;
    "
>

            <label style="
                display:flex;
                align-items:center;
                gap:10px;
                margin-bottom:20px;
                cursor:pointer;
            ">

                <input
                    type="checkbox"
                    id="adminAdditionalVerification"
                    ${additionalVerification}
                    style="
                        width:18px;
                        height:18px;
                    "
                >

                Optional additional verification

            </label>


            <div style="
                display:flex;
                gap:10px;
                flex-wrap:wrap;
            ">

                <button
                    id="savePaymentSettingsBtn"
                    type="button">

                    💾 Save Settings

                </button>


                <button
                    id="closePaymentSettingsBtn"
                    type="button">

                    Cancel

                </button>

            </div>

        </div>

    `;

    document.body.appendChild(overlay);


    document
        .getElementById(
            "closePaymentSettingsBtn"
        )
        .addEventListener(
            "click",
            () => {

                overlay.remove();

            }
        );


    document
        .getElementById(
            "savePaymentSettingsBtn"
        )
        .addEventListener(
            "click",
            () => {

                savePaymentSettings(
                    app.id
                );

            }
        );

}

// ======================================================
// SAVE PAYMENT SETTINGS
// ======================================================

async function savePaymentSettings(id) {

    const fee =
        document.getElementById(
            "adminRegistrationFee"
        ).value.trim();

    const instructions =
        document.getElementById(
            "adminPaymentInstructions"
        ).value.trim();

    const whatsappField =
        document.getElementById(
            "adminWhatsAppNumber"
        );

    const whatsappNumber =
        whatsappField
            ? whatsappField.value.trim()
            : "";

    const additionalVerification =
        document.getElementById(
            "adminAdditionalVerification"
        ).checked;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (!fee) {

        alert(
            "Please enter the registration fee."
        );

        return;

    }


    if (!instructions) {

        alert(
            "Please enter the payment instructions."
        );

        return;

    }


    if (!whatsappNumber) {

        alert(
            "Please enter the WhatsApp Business support number."
        );

        return;

    }


    const button =
        document.getElementById(
            "savePaymentSettingsBtn"
        );


    try {

        button.disabled = true;

        button.textContent =
            "Saving...";

console.log("PAYMENT SETTINGS ID:", id);
console.log("PAYMENT SETTINGS DATA:", {
    registrationFeeAmount: fee,
    paymentInstructions: instructions,
    additionalVerificationRequired: additionalVerification
});
        // ==================================================
        // SAVE PAYMENT SETTINGS
        // ==================================================

        const response =
            await fetch(
                `/admin/payment-settings/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        registrationFeeAmount:
                            fee,

                        paymentInstructions:
                            instructions,

                        additionalVerificationRequired:
                            additionalVerification

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
                result.message ||
                "Unable to save payment settings."
            );

        }


        // ==================================================
        // SAVE WHATSAPP SUPPORT NUMBER
        // ==================================================

        const whatsappResponse =
            await fetch(
                `/admin/whatsapp-support/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        whatsappBusinessNumber:
                            whatsappNumber

                    })
                }
            );


        const whatsappResult =
            await whatsappResponse.json();


        if (
            !whatsappResponse.ok ||
            !whatsappResult.success
        ) {

            throw new Error(
                whatsappResult.message ||
                "Unable to save WhatsApp support number."
            );

        }


        // ==================================================
        // SUCCESS
        // ==================================================

        alert(
            "✅ Payment settings and WhatsApp support number saved successfully."
        );


        const overlay =
            document.getElementById(
                "paymentSettingsOverlay"
            );


        if (overlay) {

            overlay.remove();

        }


        await loadApplications();


    } catch (error) {

        console.error(
            "SAVE PAYMENT SETTINGS ERROR:",
            error
        );


        alert(
            error.message ||
            "Unable to save payment settings."
        );


        button.disabled = false;

        button.textContent =
            "💾 Save Settings";

    }

}

// ===============================
// PART 12 - FINAL SAFETY CHECK
// ===============================

console.log("✅ Smart Loans admin.js loaded successfully.");
