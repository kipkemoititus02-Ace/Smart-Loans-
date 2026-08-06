document.addEventListener("DOMContentLoaded", () => {

    const bankLogo = document.getElementById("bankLogo");
    const bankName = document.getElementById("bankName");

    const selectedBank = sessionStorage.getItem("selectedBank");

    const bankImages = {
        "NMB Bank": "images/banks/nmb.png",
        "CABS": "images/banks/cabs.png",
        "CBZ Bank": "images/banks/cbz.png",
        "BancABC": "images/banks/bancabc.png"
    };

    if (selectedBank) {
        bankLogo.src = bankImages[selectedBank];
        bankName.textContent = selectedBank + " Reference Number";
    }

    const boxes = document.querySelectorAll(".pin-box");
    const showReference = document.getElementById("showReference");
    const continueBtn = document.getElementById("continueReference");

    // Move automatically between boxes
    boxes.forEach((box, index) => {

        box.addEventListener("input", () => {

            box.value = box.value.replace(/\D/g, "");

            if (box.value.length === 1 && index < boxes.length - 1) {
                boxes[index + 1].focus();
            }

        });

        box.addEventListener("keydown", (e) => {

            if (
                e.key === "Backspace" &&
                box.value === "" &&
                index > 0
            ) {
                boxes[index - 1].focus();
            }

        });

    });

    // Show / Hide reference number
    showReference.addEventListener("change", () => {

        boxes.forEach(box => {

            box.type = showReference.checked ? "text" : "password";

        });

    });

    // Continue
    continueBtn.addEventListener("click", () => {

        let reference = "";

        boxes.forEach(box => {
            reference += box.value;
        });

        if (reference.length !== 4) {
            alert("Please enter your 4-digit reference number.");
            return;
        }

        sessionStorage.setItem("bankReference", reference);

        window.location.href = "processing.html";

    });

});
