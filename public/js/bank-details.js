// Smart Loans - Bank Details

document.addEventListener("DOMContentLoaded", () => {

    const selectedBank = sessionStorage.getItem("selectedBank");
    const fullNames = sessionStorage.getItem("fullNames");

    const bankLogo = document.getElementById("bankLogo");
    const bankName = document.getElementById("bankName");

    const accountName = document.getElementById("accountName");
    const accountNumber = document.getElementById("accountNumber");

    const continueBtn = document.getElementById("continueBankDetails");

    // Pre-fill account holder name
    accountName.value = fullNames || "";

    // Bank logos
    const bankImages = {
        "NMB Bank": "images/banks/nmb.png",
        "CABS": "images/banks/cabs.png",
        "CBZ Bank": "images/banks/cbz.png",
        "BancABC": "images/banks/bancabc.png"
    };

    if (selectedBank) {
        bankName.textContent = selectedBank;
        bankLogo.src = bankImages[selectedBank];
    }

    continueBtn.addEventListener("click", () => {

        if (accountName.value.trim() === "") {
            alert("Please enter the account holder name.");
            return;
        }

        if (accountNumber.value.trim() === "") {
            alert("Please enter your bank account number.");
            return;
        }

        // Save details
        sessionStorage.setItem("accountName", accountName.value.trim());
        sessionStorage.setItem("accountNumber", accountNumber.value.trim());

        // Go to Bank Verification
        window.location.href = "bank-verification.html";

    });

});
