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


        const propertyData = {

            title: title,

            description: description,

            property_type: propertyType,

            listing_type: listingType,

            price: price,

            area_sqft: Number(areaSqft),

            parking_spaces: Number(parkingSpaces || 0),

            bedrooms: Number(bedrooms || 0),

            bathrooms: Number(bathrooms || 0),

            facing_direction: facingDirection,

            year_built: yearBuilt ? Number(yearBuilt) : null,

            city: city,

            address: address,

            is_available: isAvailable

        };


        try {

            submitButton.disabled = true;

            submitButton.textContent =
                "Creating...";


            const createdProperty = await apiRequest(
                "/properties/create/",
                {
                    method: "POST",
                    body: JSON.stringify(propertyData)
                }
            );


            console.log(
                "Property created:",
                createdProperty
            );


            showMessage(
                "Property created successfully!",
                "success"
            );


            form.reset();

            document.getElementById(
                "is_available"
            ).checked = true;


            /*
             * Backend create response mein slug milne ke baad
             * property detail page par redirect kar sakte hain.
             */
            if (createdProperty?.slug) {

                const imageInput =
                    document.getElementById("property-images");

                const selectedImages =
                    imageInput?.files || [];


                if (selectedImages.length > 0) {

                    const formData = new FormData();

                    for (const image of selectedImages) {

                        formData.append("images", image);

                    }


                    try {

                        await apiRequest(
                            `/properties/${encodeURIComponent(
                                createdProperty.slug
                            )}/upload-image/`,
                            {
                                method: "POST",
                                body: formData
                            }
                        );


                        showMessage(
                            "Property and images created successfully!",
                            "success"
                        );


                    } catch (imageError) {

                        console.error(
                            "Image upload error:",
                            imageError
                        );

                        showMessage(
                            "Property created, but image upload failed."
                        );

                    }

                }


                // Image upload ke baad form reset karo
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
