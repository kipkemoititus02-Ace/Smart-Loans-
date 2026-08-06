// Smart Loans Application

document.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.getElementById("startBtn");

    if (startBtn) {
        startBtn.addEventListener("click", () => {

            // Save application progress
            sessionStorage.setItem("currentStep", "calculator");

            // Temporary message
            alert("Welcome to Smart Loans!\n\nLet's calculate your loan.");

            // Next screen (we'll build this next)
            window.location.href = "calculator.html";

        });
    }

});
