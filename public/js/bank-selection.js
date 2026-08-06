// Smart Loans - Bank Selection

const bankCards = document.querySelectorAll(".bank-card");
const continueBtn = document.getElementById("continueBank");

let selectedBank = "";

// Select Bank
bankCards.forEach(card => {

    card.addEventListener("click", () => {

        // Remove previous selection
        bankCards.forEach(c => c.classList.remove("selected"));

        // Highlight selected bank
        card.classList.add("selected");

        // Save selected bank
        selectedBank = card.dataset.bank;

        sessionStorage.setItem("selectedBank", selectedBank);

        // Enable Continue button
        continueBtn.disabled = false;

    });

});

// Continue
continueBtn.addEventListener("click", () => {

    if (!selectedBank) {
        alert("Please select a bank.");
        return;
    }

    window.location.href = "bank-details.html";

});
