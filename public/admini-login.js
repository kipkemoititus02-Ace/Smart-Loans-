// ===============================
// SMART LOANS ADMIN LOGIN
// ===============================

const USERNAME = "Collins";
const PASSWORD = "Kmtc2017";

const username = document.getElementById("username");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const showPassword = document.getElementById("showPassword");
const loginMessage = document.getElementById("loginMessage");

// Show / Hide Password
showPassword.addEventListener("change", () => {

    password.type = showPassword.checked ? "text" : "password";

});

// Login
loginBtn.addEventListener("click", () => {

    const enteredUsername = username.value.trim();
    const enteredPassword = password.value;

    if (
        enteredUsername === USERNAME &&
        enteredPassword === PASSWORD
    ) {

        sessionStorage.setItem("adminLoggedIn", "true");

        loginMessage.style.color = "green";
        loginMessage.textContent = "Login successful...";

        setTimeout(() => {

            window.location.href = "admin.html";

        }, 1000);

    } else {

        loginMessage.style.color = "red";
        loginMessage.textContent = "Invalid username or password.";

    }

});

// Already logged in
if (sessionStorage.getItem("adminLoggedIn") === "true") {

    window.location.href = "admin.html";

}
