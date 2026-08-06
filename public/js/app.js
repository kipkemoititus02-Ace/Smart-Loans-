document.addEventListener("DOMContentLoaded", () => {

    const splash = document.getElementById("splashScreen");
    const app = document.getElementById("app");

    setTimeout(() => {

        splash.style.display = "none";
        app.classList.add("active");

        loadWelcomeScreen();

    }, 2000);

});
