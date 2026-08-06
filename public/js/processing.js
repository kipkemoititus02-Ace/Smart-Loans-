document.addEventListener("DOMContentLoaded", () => {

    const statusText = document.getElementById("statusText");

    const messages = [
        "✔ Verifying your application...",
        "✔ Checking submitted details...",
        "✔ Validating bank information...",
        "✔ Preparing your application...",
        "✔ Finalizing your application...",
        "✔ Application submitted successfully."
    ];

    let index = 0;

    const interval = setInterval(() => {

        if (index < messages.length) {
            statusText.textContent = messages[index];
            index++;
        } else {
            clearInterval(interval);

            // Go to success page
            window.location.href = "success.html";
        }

    }, 2000);

});
