document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("create-property-form");
    const submitButton = document.getElementById("create-property-btn");
    const messageElement = document.getElementById("form-message");

    if (!form) {
        return;
    }

    function showMessage(message, type = "error") {

        if (!messageElement) {
            return;
        }

        messageElement.style.display = "block";
        messageElement.textContent = message;

        if (type === "success") {
            messageElement.style.color = "green";
        } else {
            messageElement.style.color = "crimson";
        }
    }

    function hideMessage() {

        if (!messageElement) {
            return;
        }

        messageElement.style.display = "none";
        messageElement.textContent = "";
    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        hideMessage();

        const accessToken =
            localStorage.getItem("access_token");

        // Create property ke liye login required hai
        if (!accessToken) {

            showMessage(
                "Please login before creating a property."
            );

            return;
        }

        const title = document.getElementById("title").value.trim();

        const description = document.getElementById("description").value.trim();

        const propertyType = document.getElementById("property_type").value;

        const listingType = document.getElementById("listing_type").value;

        const price = document.getElementById("price").value;

        const areaSqft = document.getElementById("area_sqft").value;

        const bedrooms = document.getElementById("bedrooms").value;

        const bathrooms = document.getElementById("bathrooms").value;

        const parkingSpaces = document.getElementById("parking_spaces").value;

        const facingDirection = document.getElementById("facing_direction").value;

        const yearBuilt = document.getElementById("year_built").value;

        const city = document.getElementById("city").value.trim();

        const address = document.getElementById("address").value.trim();

        const isAvailable = document.getElementById("is_available").checked;


        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("property_type", propertyType);
        formData.append("listing_type", listingType);
        formData.append("price", price);
        formData.append("area_sqft", areaSqft);
        formData.append("parking_spaces", parkingSpaces || "0");
        formData.append("bedrooms", bedrooms || "0");
        formData.append("bathrooms", bathrooms || "0");
        formData.append("facing_direction", facingDirection);
        if (yearBuilt) {
            formData.append("year_built", yearBuilt);
        }
        formData.append("city", city);
        formData.append("address", address);
        formData.append("is_available", isAvailable ? "true" : "false");

        const imageInput = document.getElementById("property-images");

        for (const image of imageInput?.files || []) {
            formData.append("images", image);
        }


        try {

            submitButton.disabled = true;

            submitButton.textContent =
                "Creating...";


            const createdProperty = await apiRequest(
                "/properties/create/",
                {
                    method: "POST",
                    body: formData
                }
            );


            console.log(
                "Property created:",
                createdProperty
            );


            /*
             * Backend create response mein slug milne ke baad
             * property detail page par redirect kar sakte hain.
             */
            if (createdProperty?.slug) {

                showMessage(
                    "Property and images created successfully!",
                    "success"
                );

                form.reset();

                document.getElementById(
                    "is_available"
                ).checked = true;


                setTimeout(() => {

                    window.location.href =
                        `property-detail.html?slug=${encodeURIComponent(
                            createdProperty.slug
                        )}`;

                }, 1200);

            }


        } catch (error) {

            console.error(
                "Create property error:",
                error
            );


            showMessage(
                error.message ||
                "Unable to create property."
            );

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Create Property";

        }

    });

});
