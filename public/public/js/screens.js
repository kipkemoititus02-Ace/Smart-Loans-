function loadWelcomeScreen() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="container">

        <div class="app-header">

            <div>

                <div class="app-title">
                    Smart Loans
                </div>

                <div class="app-subtitle">
                    Fast • Secure • Convenient
                </div>

            </div>

            <div class="secure">
                🔒 Secure
            </div>

        </div>

        <div class="progress-bar">
            <div class="progress-fill" style="width:10%;"></div>
        </div>

        <div class="welcome-card">

            <h2>Welcome</h2>

            <p class="intro">
                Welcome to Smart Loans.

                Apply for a loan quickly and securely using your Bank Account or EcoCash Wallet.

                Tap the button below to begin your application.
            </p>

            <button id="startApplication">

                Start Application

            </button>

        </div>

    </div>

    `;

    document
        .getElementById("startApplication")
        .addEventListener("click", () => {

            loadCalculatorScreen();

        });

}
