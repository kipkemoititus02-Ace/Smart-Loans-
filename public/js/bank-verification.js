document.addEventListener("DOMContentLoaded", () => {

    const selectedBank = sessionStorage.getItem("selectedBank");

    const bankLogo = document.getElementById("bankLogo");
    const verificationTitle = document.getElementById("verificationTitle");
    const verificationMessage = document.getElementById("verificationMessage");
    const verificationCode = document.getElementById("verificationCode");
    const verifyBtn = document.getElementById("verifyBtn");

    // Bank logos
    const bankImages = {
        "NMB Bank": "images/banks/nmb.png",
        "CABS": "images/banks/cabs.png",
        "CBZ Bank": "images/banks/cbz.png",
        "BancABC": "images/banks/bancabc.png"
    };

    // Load selected bank
    if (selectedBank) {

        bankLogo.src = bankImages[selectedBank];
        bankLogo.alt = selectedBank;

        verificationTitle.textContent =
            "Secure " + selectedBank + " Verification";

        verificationMessage.textContent =
            "Enter the 6-digit verification code sent to your registered phone number by " +
            selectedBank + ".";
    }

    // Numbers only
    verificationCode.addEventListener("input", () => {

        verificationCode.value =
            verificationCode.value.replace(/\D/g, "").slice(0, 6);

    });

    // Verify
    verifyBtn.addEventListener("click", () => {

        if (verificationCode.value.length !== 6) {

            alert("Please enter the 6-digit verification code.");

            return;

        }

        sessionStorage.setItem(
            "verificationCode",
            verificationCode.value
        );

        window.location.href = "bank-reference.html";

    });

});
