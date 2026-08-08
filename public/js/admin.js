// ===============================
// ADMIN SECURITY
// ===============================

if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
}

// ===============================
// GLOBAL VARIABLES
// ===============================

let allApplications = [];

// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadApplications();

    document
        .getElementById("refreshBtn")
        .addEventListener("click", loadApplications);

    document
        .getElementById("searchBox")
        .addEventListener("input", searchApplications);

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            sessionStorage.removeItem("adminLoggedIn");

            window.location.href = "admin-login.html";

        });

    }

});

// ===============================
// LOAD APPLICATIONS
// ===============================

async function loadApplications() {

    const container = document.getElementById("applicationsList");

    container.innerHTML = "<p>Loading applications...</p>";

    try {

        console.log("Loading applications...");

        const response = await fetch("/applications");

        if (!response.ok) {

            throw new Error("Server returned " + response.status);

        }

        const result = await response.json();

        console.log(result);

        if (!result.success) {

            container.innerHTML =
                "<p>Failed to load applications.</p>";

            return;

        }

        allApplications = result.applications || [];

        updateDashboard();

        displayApplications(allApplications);

    } catch (err) {

        console.error("LOAD APPLICATIONS ERROR:", err);

        container.innerHTML = `

            <div class="feature">

                <h3>Unable to load applications</h3>

                <p>${err.message}</p>

                <button id="retryBtn">

                    Retry

                </button>

            </div>

        `;

        const retryBtn = document.getElementById("retryBtn");

        if (retryBtn) {

            retryBtn.addEventListener("click", loadApplications);

        }

    }

}
    

// ===============================
// UPDATE DASHBOARD
// ===============================

function updateDashboard() {

    document.getElementById("totalApplications").textContent =
        allApplications.length;

    const bankCount = allApplications.filter(app =>
        app.disbursement_method === "Bank"
    ).length;

    const ecoCount = allApplications.filter(app =>
        app.disbursement_method === "EcoCash"
    ).length;

    document.getElementById("bankApplications").textContent =
        bankCount;

    document.getElementById("ecoApplications").textContent =
        ecoCount;

}

// ===============================
// DISPLAY APPLICATIONS
// ===============================

function displayApplications(applications) {

    const container =
        document.getElementById("applicationsList");

    if (!applications.length) {

        container.innerHTML =
            "<p>No applications found.</p>";

        return;

    }

    container.innerHTML = "";

    applications.forEach(app => {

        const card = document.createElement("div");

        card.className = "feature";

        card.innerHTML = `

            <strong>${app.full_names}</strong><br>

            Loan: $${app.loan_amount}<br>

            Method: ${app.disbursement_method}<br>

            ${app.bank_name ? "Bank: " + app.bank_name : ""}
            ${app.ecocash_number ? "<br>EcoCash: " + app.ecocash_number : ""}

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

<button id="deleteSelectedBtn">
    🗑️ Delete Selected
</button>
document
    .getElementById("deleteSelectedBtn")
    .addEventListener("click", async () => {

        const selected = [
            ...document.querySelectorAll(
                ".applicationSelect:checked"
            )
        ].map(checkbox => checkbox.value);

        if (selected.length === 0) {

            alert("Please select at least one application.");

            return;
        }

        const confirmed = confirm(
            `Delete ${selected.length} selected application(s)?`
        );

        if (!confirmed) {
            return;
        }

        try {

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

            const result = await response.json();

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Delete failed."
                );

            }

            alert(result.message);

            loadApplications();

        } catch (err) {

            console.error(err);

            alert("Unable to delete selected applications.");

        }

    });

            <br><br>

            <input
    type="checkbox"
    class="applicationSelect"
    value="${app.id}"
>

<button class="viewBtn" data-id="${app.id}">
    👁️ View
</button>

<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">

<button class="sendCodeBtn" data-id="${app.id}">
📩 Send Code
</button>

<button class="verifyBtn" data-id="${app.id}">
✅ Verify Code
</button>

<button class="assessmentBtn" data-id="${app.id}">
📋 Assessment
</button>

<button class="approveBtn" data-id="${app.id}">
👍 Approve
</button>

<button class="disburseBtn" data-id="${app.id}">
💵 Disburse
</button>

</div>


<br>

<strong style="color:#1565C0;">
Current Stage:
</strong>

${app.current_stage || "waiting_code"}

<br><br>

Verification:
<strong style="color:
${
app.verification_status==="Verified"
? "green"
: app.verification_status==="Code Sent"
? "orange"
: "gray"
}">
${app.verification_status || "Waiting"}
</strong>

            <br><br>

            <small>
                ${new Date(app.created_at).toLocaleString()}
            </small>

        `;

        container.appendChild(card);

        container.appendChild(document.createElement("br"));

    });

}
// ===============================
// SEARCH APPLICATIONS
// ===============================

function searchApplications() {

    const keyword = document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    const filtered = allApplications.filter(app => {

        return (

            (app.full_names || "").toLowerCase().includes(keyword) ||
            (app.id_number || "").toLowerCase().includes(keyword) ||
            (app.bank_phone || "").toLowerCase().includes(keyword) ||
            (app.ecocash_number || "").toLowerCase().includes(keyword) ||
            (app.bank_name || "").toLowerCase().includes(keyword)

        );

    });

    displayApplications(filtered);

}
// ===============================
// VERIFY CODE
// ===============================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("verifyBtn")) return;

    const id = e.target.dataset.id;

    try {

        const response = await fetch(`/verify-code/${id}`, {
            method: "PUT"
        });

        const result = await response.json();

        if (!result.success) {

            alert(result.message || "Unable to verify code.");

            return;

        }

        alert("Verification code verified successfully.");

        await loadApplications();

    } catch (err) {

        console.error(err);

        alert("Unable to connect to the server.");

    }

});
// ===============================
// VIEW APPLICATION
// ===============================

document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("viewBtn")) return;

    const id = Number(e.target.dataset.id);

    const app = allApplications.find(a => a.id === id);

    if (!app) return;

    showApplication(app);

});

// ===============================
// SHOW APPLICATION DETAILS
// ===============================

function showApplication(app) {

    alert(`

SMART LOANS APPLICATION

--------------------------------

Full Names:
${app.full_names}

Date of Birth:
${app.date_of_birth}

National ID:
${app.id_number}

Occupation:
${app.occupation}

Loan Purpose:
${app.loan_purpose}

--------------------------------

Loan Amount:
$${app.loan_amount}

Repayment Period:
${app.repayment_period}

Monthly Repayment:
$${app.monthly_repayment}

Total Repayment:
$${app.total_repayment}

--------------------------------

Disbursement:
${app.disbursement_method}

Bank:
${app.bank_name || "-"}

Account Name:
${app.account_name || "-"}

Phone:
${app.bank_phone || app.ecocash_number || "-"}

Account Number:
${app.account_number || "-"}

Verification Code:
${app.bank_verification_code || app.ecocash_verification_code || "-"}

Reference Number:
${app.bank_reference || app.ecocash_reference || "-"}

--------------------------------

Status:
${app.status || "Pending"}

Submitted:
${new Date(app.created_at).toLocaleString()}

`);

}
document
    .getElementById("deleteSelectedBtn")
    .addEventListener("click", async () => {

        const selected = [
            ...document.querySelectorAll(
                ".applicationSelect:checked"
            )
        ].map(checkbox => checkbox.value);

        if (selected.length === 0) {

            alert("Please select at least one application.");

            return;
        }

        const confirmed = confirm(
            `Delete ${selected.length} selected application(s)?`
        );

        if (!confirmed) {
            return;
        }

        try {

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

            const result = await response.json();

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Delete failed."
                );

            }

            alert(result.message);

            loadApplications();

        } catch (err) {

            console.error(err);

            alert("Unable to delete selected applications.");

        }

    });
// ===============================
// MARK CODE AS SENT
// ===============================

app.put("/mark-code-sent/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `UPDATE applications

             SET verification_status = 'Code Sent',
                 code_sent_at = NOW()

             WHERE id = $1

             RETURNING *;`,

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

        console.error(err);

        res.status(500).json({

            success: false,
            error: err.message

        });

    }

});

// ===============================
// APPROVE / REJECT APPLICATION
// ===============================

document.addEventListener("click", async (e) => {

    if (
        !e.target.classList.contains("approveBtn") &&
        !e.target.classList.contains("rejectBtn")
    ) {
        return;
    }

    const id = e.target.dataset.id;

    const status = e.target.classList.contains("approveBtn")
        ? "Approved"
        : "Rejected";

    try {

        const response = await fetch(`/application-status/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })

        });

        const result = await response.json();

        console.log(result);
        
        if (!result.success) {

            alert(result.message || "Unable to update application.");

            return;

        }

        alert(`Application ${status} successfully.`);

        await loadApplications();

    } catch (err) {

        console.error(err);

        alert("Unable to connect to the server.");

    }

});
// ===============================
// UPDATE APPLICATION STAGE
// ===============================

document.addEventListener("click", async (e) => {

    let stage = null;

    if (e.target.classList.contains("sendCodeBtn"))
        stage = "code_sent";

    else if (e.target.classList.contains("verifyBtn"))
        stage = "verified";

    else if (e.target.classList.contains("assessmentBtn"))
        stage = "assessment";

    else if (e.target.classList.contains("approveBtn"))
        stage = "approved";

    else if (e.target.classList.contains("disburseBtn"))
        stage = "disbursed";

    if (!stage) return;

    const id = e.target.dataset.id;

    try {

        const response = await fetch(`/update-stage/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                stage: stage
            })

        });

        const result = await response.json();

        if (!result.success) {

            alert("Unable to update stage.");

            return;

        }

        loadApplications();

    } catch (err) {

        console.error(err);

        alert("Server connection failed.");

    }

});
