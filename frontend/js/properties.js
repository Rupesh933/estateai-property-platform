async function loadCurrentUser() {

    const accessToken = localStorage.getItem("access_token");

    const guestActions = document.getElementById("guest-actions");

    const userAction = document.getElementById("user-actions");

    const userNameElement = document.getElementById("user-name");


    // User login nahi hai
    if (!accessToken) {

        if (guestActions) {
            guestActions.style.display = "flex";
        }

        if (userAction) {
            userAction.style.display = "none";
        }

        return;
    }


    try {

        const user = await getCurrentUser();


        const fullName = [
            user.first_name,
            user.last_name
        ]
            .filter(Boolean)
            .join(" ");


        if (userNameElement) {

            userNameElement.textContent =
                fullName || user.email;

        }


        // Guest buttons hide
        if (guestActions) {
            guestActions.style.display = "none";
        }


        // User area show
        if (userAction) {
            userAction.style.display = "flex";
        }


    } catch (error) {

        console.error(
            "Unable to load current user:",
            error
        );

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");


        if (guestActions) {
            guestActions.style.display = "flex";
        }

        if (userAction) {
            userAction.style.display = "none";
        }

    }

}


function logoutUser() {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.location.href = "login.html";

}

document.addEventListener("DOMContentLoaded", () => {

    loadCurrentUser();

    const logoutButton =
        document.getElementById("logoutBtn");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutUser
        );

    }


    // Existing property listing aur filter code
    // yahin rahega

});