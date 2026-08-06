document.addEventListener("DOMContentLoaded", () => {

    const ecoCashOption = document.getElementById("ecocashOption");
    const bankOption = document.getElementById("bankOption");

    // EcoCash selected
    ecoCashOption.addEventListener("click", () => {

        sessionStorage.setItem("disbursementMethod", "EcoCash");

        window.location.href = "ecocash-details.html";

    });

    // Bank selected
    bankOption.addEventListener("click", () => {

        sessionStorage.setItem("disbursementMethod", "Bank");

        window.location.href = "bank-selection.html";

    });

});
