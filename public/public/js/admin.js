// ===============================
// ADMIN SECURITY
// ===============================

if (sessionStorage.getItem("adminLoggedIn") !== "true") {

    window.location.href = "admin-login.html";

}
// ===============================
// SMART LOANS ADMIN DASHBOARD
// ===============================

let allApplications = [];

document.addEventListener("DOMContentLoaded", () => {

    loadApplications();

    document
        .getElementById("refreshBtn")
        .addEventListener("click", loadApplications);

    document
        .getElementById("searchBox")
        .addEventListener("input", searchApplications);

});

// ===============================
// LOAD APPLICATIONS
// ===============================

async function loadApplications() {

    try {

        const response = await fetch("/applications");
        const result = await response.json();

        if (!result.success) {

            alert("Failed to load applications.");
            return;

        }

        allApplications = result.applications;

        updateDashboard();

        displayApplications(allApplications);

    } catch (err) {

        console.error(err);

        alert("Unable to connect to server.");

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

    document.getElementById("bankApplications").textContent = bankCount;
    document.getElementById("ecoApplications").textContent = ecoCount;

}

// ===============================
// DISPLAY APPLICATIONS
// ===============================

function displayApplications(applications) {

    const container = document.getElementById("applicationsList");

    if (applications.length === 0) {

        container.innerHTML = "<p>No applications found.</p>";
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

    <br>

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

    <button class="viewBtn" data-id="${app.id}">
        👁️ View
    </button>

    <button class="approveBtn" data-id="${app.id}">
        ✅ Approve
    </button>

    <button class="rejectBtn" data-id="${app.id}">
        ❌ Reject
    </button>

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
// SEARCH
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
// LOGOUT
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        sessionStorage.removeItem("adminLoggedIn");

        window.location.href = "admin-login.html";

    });

}
// ===============================
// APPROVE / REJECT APPLICATION
// ===============================

document.addEventListener("click", async (e) => {

    if (
        e.target.classList.contains("approveBtn") ||
        e.target.classList.contains("rejectBtn")
    ) {

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

            if (result.success) {

                alert(`Application ${status} successfully.`);

                loadApplications();

            } else {

                alert(result.message || "Failed to update application.");

            }

        } catch (err) {

            console.error(err);

            alert("Unable to connect to the server.");

        }

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

function showApplication(app){

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
${app.status}

Submitted:
${new Date(app.created_at).toLocaleString()}

`);

    }
