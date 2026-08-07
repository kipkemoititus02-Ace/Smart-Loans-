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

            (app.bank_phone || "").toLowerCase().includes
