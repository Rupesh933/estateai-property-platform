async function loadCurrentUser() {

    const loadingMessage = document.getElementById("loading-message");

    const errorMessage = document.getElementById("error-message");

    const profileSection = document.getElementById("profile-section");


    try {

        const accessToken = localStorage.getItem("access_token");


        if (!accessToken) {

            if (errorMessage) {
                errorMessage.textContent = "Please login first.";
            }

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

            return;
        }


        const user = await getCurrentUser();


        document.getElementById("user-id").textContent = user.id;

        document.getElementById("user-email").textContent = user.email;

        document.getElementById("user-first-name").textContent = user.first_name || "Not provided";

        document.getElementById("user-last-name").textContent = user.last_name || "Not provided";


        if (loadingMessage) {
            loadingMessage.style.display = "none";
        }

        if (profileSection) {
            profileSection.style.display = "block";
        }


    } catch (error) {

        console.error(
            "Profile error:",
            error
        );


        if (loadingMessage) {
            loadingMessage.style.display = "none";
        }

        if (errorMessage) {
            errorMessage.textContent =
                error.message ||
                "Unable to load profile.";
        }

    }

}


document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("DOMContentLoaded", () => {
        loadCurrentUser();
    });
});