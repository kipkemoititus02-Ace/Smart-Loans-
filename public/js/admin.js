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
// TABLE VERSION
// ===============================

function displayApplications(applications) {

    const container =
        document.getElementById("applicationsList");

    if (!container) return;

    container.innerHTML = "";

    // ===============================
    // TOOLBAR
    // ===============================

    const toolbar =
        document.createElement("div");

    toolbar.style.cssText = `
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        flex-wrap:wrap;
        margin-bottom:15px;
    `;

    toolbar.innerHTML = `

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

        <strong>
            ${applications.length} application(s)
        </strong>

    `;

    container.appendChild(toolbar);


    // ===============================
    // NO APPLICATIONS
    // ===============================

    if (!applications.length) {

        container.innerHTML += `
            <p style="
                text-align:center;
                padding:25px;
            ">
                No applications found.
            </p>
        `;

        return;
    }


    // ===============================
    // TABLE WRAPPER
    // ===============================

    const wrapper =
        document.createElement("div");

    wrapper.style.cssText = `
        width:100%;
        overflow-x:auto;
        border-radius:10px;
    `;


    // ===============================
    // TABLE
    // ===============================

    const table =
        document.createElement("table");

    table.style.cssText = `
        width:100%;
        min-width:1200px;
        border-collapse:collapse;
        background:#fff;
        font-size:14px;
    `;


    // ===============================
    // TABLE HEADER
    // ===============================

    table.innerHTML = `

        <thead>

            <tr style="
                background:#064b8d;
                color:white;
            ">

                <th style="padding:12px;">
                    #
                </th>

                <th style="padding:12px;">
                    Select
                </th>

                <th style="padding:12px;">
                    Applicant
                </th>

                <th style="padding:12px;">
                    ID Number
                </th>

                <th style="padding:12px;">
                    Loan
                </th>

                <th style="padding:12px;">
                    Period
                </th>

                <th style="padding:12px;">
                    Method
                </th>

                <th style="padding:12px;">
                    Bank
                </th>

                <th style="padding:12px;">
                    Phone
                </th>

                <th style="padding:12px;">
                    Status
                </th>

                <th style="padding:12px;">
                    Verification
                </th>

                <th style="padding:12px;">
                    Stage
                </th>

                <th style="padding:12px;">
                    Actions
                </th>

            </tr>

        </thead>

        <tbody></tbody>

    `;


    const tbody =
        table.querySelector("tbody");


    // ===============================
    // APPLICATION ROWS
    // ===============================

    applications.forEach((app, index) => {

        const row =
            document.createElement("tr");

        row.style.borderBottom =
            "1px solid #ddd";


        const statusColor =
            app.status === "Approved"
                ? "green"
                : app.status === "Rejected"
                ? "red"
                : "orange";


        const verificationColor =
            app.verification_status === "Verified"
                ? "green"
                : app.verification_status === "Code Sent"
                ? "orange"
                : "gray";


        row.innerHTML = `

            <td style="
                padding:12px;
                font-weight:bold;
            ">
                ${index + 1}
            </td>


            <td style="
                padding:12px;
                text-align:center;
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

            </td>


            <td style="padding:12px;">
                <strong>
                    ${app.full_names || "-"}
                </strong>
            </td>


            <td style="padding:12px;">
                ${app.id_number || "-"}
            </td>


            <td style="padding:12px;">
                $${app.loan_amount || "0"}
            </td>


            <td style="padding:12px;">
                ${app.repayment_period || "-"}
            </td>


            <td style="padding:12px;">
                ${app.disbursement_method || "-"}
            </td>


            <td style="padding:12px;">
                ${app.bank_name || "-"}
            </td>


            <td style="padding:12px;">
                ${app.bank_phone ||
                  app.ecocash_number ||
                  "-"}
            </td>


            <td style="
                padding:12px;
                color:${statusColor};
                font-weight:bold;
            ">
                ${app.status || "Pending"}
            </td>


            <td style="
                padding:12px;
                color:${verificationColor};
                font-weight:bold;
            ">
                ${app.verification_status || "Waiting"}
            </td>


            <td style="
                padding:12px;
                color:#1565C0;
                font-weight:bold;
            ">
                ${app.current_stage || "waiting_code"}
            </td>


            <td style="
                padding:12px;
                min-width:300px;
            ">

                <button
                    class="viewBtn"
                    data-id="${app.id}">
                    👁️ View
                </button>

                <button
                    class="sendCodeBtn"
                    data-id="${app.id}">
                    📩 Send Code
                </button>

                <button
                    class="verifyBtn"
                    data-id="${app.id}">
                    ✅ Verify
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
                    class="approveBtn"
                    data-id="${app.id}">
                    👍 Approve
                </button>

                <button
                    class="disburseBtn"
                    data-id="${app.id}">
                    💵 Disburse
                </button>

            </td>

        `;


        tbody.appendChild(row);

    });


    wrapper.appendChild(table);

    container.appendChild(wrapper);


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
    // UPDATE SELECT-ALL STATE
    // ===============================

    const checkboxes =
        document.querySelectorAll(
            ".applicationSelect"
        );

    checkboxes.forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                () => {

                    const checked =
                        document.querySelectorAll(
                            ".applicationSelect:checked"
                        ).length;

                    selectAll.checked =
                        checkboxes.length > 0 &&
                        checked === checkboxes.length;

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

// ===============================
// PART 12 - FINAL SAFETY CHECK
// ===============================

console.log("✅ Smart Loans admin.js loaded successfully.");
