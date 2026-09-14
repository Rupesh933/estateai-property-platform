document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#registerForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const firstName = document.querySelector("#firstName").value.trim();

        const lastName = document.querySelector("#lastName").value.trim();

        const email = document.querySelector("#registerEmail").value.trim();

        const mobileNumber = document.querySelector("#mobileNumber").value.trim();

        const password = document.querySelector("#registerPassword").value;

        try {

            await registerUser({
                first_name: firstName,
                last_name: lastName,
                email: email,
                mobile_number: mobileNumber,
                password: password,
            });

            alert("Account created successfully.");

            window.location.href = "login.html";

        } catch (error) {

            console.error("Registration failed:", error);

            alert(error.message);

        }

    });

});