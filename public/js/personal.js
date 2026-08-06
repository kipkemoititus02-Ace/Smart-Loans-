const continueBtn = document.getElementById("continuePersonal");

continueBtn.addEventListener("click", () => {

    const fullNames = document.getElementById("fullNames").value.trim();
    const dob = document.getElementById("dob").value;
    const nationalId = document.getElementById("nationalId").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const occupation = document.getElementById("occupation").value;
    const loanPurpose = document.getElementById("loanPurpose").value;

    if (
        !fullNames ||
        !dob ||
        !nationalId ||
        !phoneNumber ||
        !occupation ||
        !loanPurpose
    ) {
        alert("Please complete all required fields.");
        return;
    }

    // Save application data
    sessionStorage.setItem("fullNames", fullNames);
    sessionStorage.setItem("dob", dob);
    sessionStorage.setItem("nationalId", nationalId);
    sessionStorage.setItem("phoneNumber", phoneNumber);
    sessionStorage.setItem("occupation", occupation);
    sessionStorage.setItem("loanPurpose", loanPurpose);

    // Go to Review page
    window.location.href = "review.html";

});
