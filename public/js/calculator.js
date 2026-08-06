const loanAmount = document.getElementById("loanAmount");
const loanPeriod = document.getElementById("loanPeriod");

const monthlyRepayment = document.getElementById("monthlyRepayment");
const totalRepayment = document.getElementById("totalRepayment");

const continueBtn = document.getElementById("continueBtn");

// Interest rates based on repayment period
const interestRates = {
    1: 0.10,   // 10%
    3: 0.15,   // 15%
    6: 0.20,   // 20%
    12: 0.30,  // 30%
    18: 0.40,  // 40%
    24: 0.50   // 50%
};

function calculateLoan() {

    const amount = parseFloat(loanAmount.value);
    const months = parseInt(loanPeriod.value);

    if (!amount || !months) {

        monthlyRepayment.textContent = "$0.00";
        totalRepayment.textContent = "$0.00";
        continueBtn.disabled = true;

        return;
    }

    const rate = interestRates[months];

    const total = amount + (amount * rate);

    const monthly = total / months;

    monthlyRepayment.textContent = "$" + monthly.toFixed(2);

    totalRepayment.textContent = "$" + total.toFixed(2);

    continueBtn.disabled = false;

    // Save data
    sessionStorage.setItem("loanAmount", amount);
    sessionStorage.setItem("loanPeriod", months);
    sessionStorage.setItem("monthlyRepayment", monthly.toFixed(2));
    sessionStorage.setItem("totalRepayment", total.toFixed(2));

}

loanAmount.addEventListener("input", calculateLoan);

loanPeriod.addEventListener("change", calculateLoan);

continueBtn.addEventListener("click", () => {

    window.location.href = "personal-information.html";

});
