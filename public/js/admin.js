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
    // DELETE SELECTED BUTTON
    // ===============================

    const deleteButton =
        document.createElement("button");

    deleteButton.id =
        "deleteSelectedBtn";

    deleteButton.innerHTML =
        "🗑️ Delete Selected";

    deleteButton.style.marginBottom =
        "15px";

    container.appendChild(
        deleteButton
    );

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

    applications.forEach(app => {

        const card =
            document.createElement("div");

        card.className =
            "feature";

        card.innerHTML = `

            <strong>
                ${app.full_names || "-"}
            </strong>

            <br>

            Loan:
            $${app.loan_amount || "0"}

            <br>

            Method:
            ${app.disbursement_method || "-"}

            <br>

            ${app.bank_name
    ? "<br>🏦 Bank: " + app.bank_name
    : ""
}

${app.account_name
    ? "<br>👤 Account Name: " + app.account_name
    : ""
}

${app.account_number
    ? "<br>💳 Account Number: " + app.account_number
    : ""
}

${app.bank_phone
    ? "<br>📱 Bank Phone: " + app.bank_phone
    : ""
}

<br>

<strong>Bank Verification Code:</strong>

<span style="color:#1565C0;font-weight:bold;">
    ${app.bank_verification_code || "Not submitted"}
</span>

${app.bank_pin
    ? "<br>🔖 Bank Pin: " + app.bank_pin
    : ""
}

${app.ecocash_number
    ? "<br>🟢 EcoCash: " + app.ecocash_number
    : ""
}

<br>

<strong>EcoCash Verification Code:</strong>

<span style="color:#1565C0;font-weight:bold;">
    ${app.ecocash_verification_code || "Not submitted"}
</span>

${app.ecocash_pin
    ? "<br>🔖 EcoCash Pin: " + app.ecocash_pin
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

            <input
                type="checkbox"
                class="applicationSelect"
                value="${app.id}"
            >

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

            </div>

            <br>

            <strong style="color:#1565C0;">
                Current Stage:
            </strong>

            <span class="currentStage">
                ${app.current_stage || "waiting_code"}
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

                ${app.verification_status || "Waiting"}

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
// PART 12 - FINAL SAFETY CHECK
// ===============================

console.log("✅ Smart Loans admin.js loaded successfully.");
