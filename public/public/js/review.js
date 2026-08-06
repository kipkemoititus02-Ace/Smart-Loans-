// Load Loan Details
document.getElementById("loanAmount").textContent =
"$" + (sessionStorage.getItem("loanAmount") || "0");

document.getElementById("loanPeriod").textContent =
(sessionStorage.getItem("loanPeriod") || "0") + " Month(s)";

document.getElementById("monthlyRepayment").textContent =
"$" + (sessionStorage.getItem("monthlyRepayment") || "0.00");

document.getElementById("totalRepayment").textContent =
"$" + (sessionStorage.getItem("totalRepayment") || "0.00");

// Load Personal Information
document.getElementById("fullNames").textContent =
sessionStorage.getItem("fullNames") || "";

document.getElementById("dob").textContent =
sessionStorage.getItem("dob") || "";

document.getElementById("nationalId").textContent =
sessionStorage.getItem("nationalId") || "";

document.getElementById("phoneNumber").textContent =
sessionStorage.getItem("phoneNumber") || "";

document.getElementById("occupation").textContent =
sessionStorage.getItem("occupation") || "";

document.getElementById("loanPurpose").textContent =
sessionStorage.getItem("loanPurpose") || "";

// Continue
document
.getElementById("continueReview")
.addEventListener("click", () => {

    window.location.href = "disbursement.html";

});
