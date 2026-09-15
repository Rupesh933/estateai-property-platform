document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("create-property-form");

    const submitButton = document.getElementById("create-property-btn");

    const messageElement = document.getElementById("form-message");

    const imageInput = document.getElementById("property-images");

    const imagePreview = document.getElementById("image-preview");


    if (!form) {
        return;
    }


    // =========================================
    // SELECTED IMAGES
    // =========================================

    let selectedImages = [];


    // =========================================
    // MESSAGE
    // =========================================

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


    // =========================================
    // RENDER IMAGE PREVIEW
    // =========================================

    function renderImagePreview() {

        if (!imagePreview) {
            return;
        }


        imagePreview.innerHTML = "";


        selectedImages.forEach((image, index) => {

            const previewCard = document.createElement("div");

            previewCard.style.position = "relative";


            const imageElement = document.createElement("img");

            imageElement.src = URL.createObjectURL(image);

            imageElement.alt = image.name;

            imageElement.style.width = "100%";
            imageElement.style.height = "140px";
            imageElement.style.objectFit = "cover";
            imageElement.style.borderRadius = "12px";
            imageElement.style.border =
                "1px solid var(--line)";


            const removeButton = document.createElement("button");

            removeButton.type = "button";

            removeButton.textContent = "×";

            removeButton.setAttribute(
                "aria-label",
                `Remove ${image.name}`
            );

            removeButton.style.position = "absolute";

            removeButton.style.top = "6px";

            removeButton.style.right = "6px";

            removeButton.style.width = "30px";

            removeButton.style.height = "30px";

            removeButton.style.border = "0";

            removeButton.style.borderRadius = "50%";

            removeButton.style.background = "rgba(0, 0, 0, 0.7)";

            removeButton.style.color = "#fff";

            removeButton.style.fontSize = "20px";

            removeButton.style.cursor = "pointer";


            removeButton.addEventListener(
                "click",
                () => {

                    selectedImages.splice(index, 1);

                    renderImagePreview();

                }
            );


            previewCard.appendChild(imageElement);

            previewCard.appendChild(removeButton);

            imagePreview.appendChild(previewCard);

        });

    }


    // =========================================
    // ADD NEW IMAGES
    // =========================================

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            () => {

                const newImages = Array.from(imageInput.files || []);


                newImages.forEach((newImage) => {

                    const alreadyExists = selectedImages.some(
                            (existingImage) =>
                                existingImage.name === newImage.name &&
                                existingImage.size === newImage.size &&
                                existingImage.lastModified === newImage.lastModified
                        );


                    if (!alreadyExists) {

                        selectedImages.push(newImage);

                    }

                });


                renderImagePreview();


                // File input reset kar dete hain
                // taaki same file dobara bhi select ki ja sake.
                imageInput.value = "";

            }
        );

    }


    // =========================================
    // FORM SUBMIT
    // =========================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideMessage();


            const accessToken = localStorage.getItem("access_token");


            if (!accessToken) {

                showMessage(
                    "Please login before creating a property."
                );

                return;
            }


            // =========================================
            // PROPERTY FIELDS
            // =========================================

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


            // =========================================
            // PROPERTY JSON DATA
            // =========================================

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

                year_built : yearBuilt ? Number(yearBuilt) : null,

                city: city,

                address: address,

                is_available: isAvailable

            };


            try {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Creating...";


                // =========================================
                // STEP 1: CREATE PROPERTY
                // =========================================

                const createdProperty =
                    await apiRequest(
                        "/properties/create/",
                        {
                            method: "POST",

                            body: JSON.stringify(
                                propertyData
                            )
                        }
                    );


                console.log(
                    "Property created:",
                    createdProperty
                );


                if (!createdProperty?.slug) {

                    throw new Error(
                        "Property created but slug was not returned."
                    );

                }


                // =========================================
                // STEP 2: UPLOAD IMAGES
                // =========================================

                if (selectedImages.length > 0) {

                    submitButton.textContent = "Uploading images...";


                    const imageFormData = new FormData();


                    selectedImages.forEach(
                        (image) => {
                            imageFormData.append(
                                "images",
                                image
                            );

                        }
                    );


                    await apiRequest(
                        `/properties/${encodeURIComponent(
                            createdProperty.slug
                        )}/upload-image/`,
                        {
                            method: "POST",

                            body: imageFormData
                        }
                    );


                    console.log(
                        "Images uploaded successfully:",
                        selectedImages.length
                    );

                }


                // =========================================
                // SUCCESS
                // =========================================

                showMessage(
                    selectedImages.length > 0
                        ? "Property and images created successfully!"
                        : "Property created successfully!",
                    "success"
                );


                form.reset();

                selectedImages = [];


                if (imagePreview) {
                    imagePreview.innerHTML = "";
                }


                document.getElementById(
                    "is_available"
                ).checked = true;


                // =========================================
                // REDIRECT
                // =========================================

                setTimeout(() => {

                    window.location.href =
                        `property-detail.html?slug=${encodeURIComponent(
                            createdProperty.slug
                        )}`;

                }, 3600);


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

        }
    );

});
