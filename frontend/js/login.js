document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#loginForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.querySelector("#loginEmail").value.trim();

        const password = document.querySelector("#loginPassword").value;

        try {

            const data =
                await loginUser(email, password);

            localStorage.setItem(
                "access_token",
                data.access
            );

            localStorage.setItem(
                "refresh_token",
                data.refresh
            );

            console.log("Login successful");

            window.location.href = "properties.html";

        } catch (error) {

            console.error("Login failed:", error);

            alert(error.message);

        }

    });

});