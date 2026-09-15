document.addEventListener("DOMContentLoaded", async () => {

    // =========================================
    // GET SLUG FROM URL
    // =========================================

    const urlParams = new URLSearchParams(window.location.search);

    const slug = urlParams.get("slug");


    if (!slug) {

        console.error("Property slug is missing.");

        return;

    }


    // =========================================
    // DOM ELEMENTS
    // =========================================

    const titleElement = document.getElementById("detailTitle");

    const locationElement = document.getElementById("detailLocation");

    const priceElement = document.getElementById("detailPrice");

    const bedsElement = document.getElementById("detailBeds");

    const bathsElement = document.getElementById("detailBaths");

    const areaElement = document.getElementById("detailArea");

    const parkingElement = document.getElementById("detailParking");

    const descriptionElement = document.getElementById("detailDescription");

    const typeElement = document.getElementById("detailType");

    const builtUpAreaElement = document.getElementById("detailBuiltUpArea");

    const yearBuiltElement = document.getElementById("detailYearBuilt");

    const facingElement = document.getElementById("detailFacing");

    const addressElement = document.getElementById("detailAddress");

    const galleryElement = document.getElementById("propertyGallery");


    // =========================================
    // LOAD PROPERTY
    // =========================================

    try {

        const property = await getPropertyDetail(slug);


        console.log(
            "Property detail:",
            property
        );


        // =========================================
        // PROPERTY BASIC DATA
        // =========================================

        if (titleElement) {

            titleElement.textContent =
                property.title || "Untitled Property";

        }


        if (locationElement) {

            locationElement.textContent =
                property.city || "";

        }


        if (priceElement) {

            priceElement.textContent =
                formatPrice(property.price);

        }


        if (bedsElement) {

            bedsElement.textContent =
                property.bedrooms ?? 0;

        }


        if (bathsElement) {

            bathsElement.textContent =
                property.bathrooms ?? 0;

        }


        if (areaElement) {

            areaElement.textContent =
                property.area_sqft ?? 0;

        }


        if (parkingElement) {

            parkingElement.textContent =
                property.parking_spaces ?? 0;

        }


        if (descriptionElement) {

            descriptionElement.textContent =
                property.description || "";

        }


        // =========================================
        // FEATURES
        // =========================================

        if (typeElement) {

            typeElement.textContent = formatPropertyType(
                property.property_type
            );

        }


        if (builtUpAreaElement) {

            builtUpAreaElement.textContent = property.area_sqft ?? 0;

        }


        if (yearBuiltElement) {

            yearBuiltElement.textContent = property.year_built || "N/A";

        }


        if (facingElement) {

            facingElement.textContent = formatFacingDirection(
                property.facing_direction
            );

        }


        if (addressElement) {

            addressElement.textContent =
                property.address || "N/A";

        }


        // =========================================
        // LOCATION
        // =========================================

        if (locationElement) {

            locationElement.textContent = property.address
                ? `${property.address}, ${property.city}`
                : property.city || "";

        }


        // =========================================
        // IMAGES
        // =========================================

        renderPropertyImages(
            property.images || [],
            galleryElement
        );


    } catch (error) {

        console.error(
            "Unable to load property details:",
            error
        );

        if (titleElement) {

            titleElement.textContent =
                "Unable to load property";

        }

        if (descriptionElement) {

            descriptionElement.textContent =
                error.message ||
                "Something went wrong while loading the property.";

        }

    }
    ```

});

// =========================================
// FORMAT PRICE
// =========================================

function formatPrice(price) {

```
    if (
        price === null ||
        price === undefined ||
        price === ""
    ) {

        return "Price on request";

    }


    const numericPrice = Number(price);


    if (Number.isNaN(numericPrice)) {

        return price;

    }


    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(numericPrice);

},

    // =========================================
    // FORMAT PROPERTY TYPE
    // =========================================

    function formatPropertyType(type) {

        if (!type) {

            return "N/A";

        }


        return type
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );

    },

    // =========================================
    // FORMAT FACING DIRECTION
    // =========================================

    function formatFacingDirection(direction) {

        if (!direction) {

            return "N/A";

        }


        return direction
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );

    },

    // =========================================
    // RENDER PROPERTY IMAGES
    // =========================================

    function renderPropertyImages(images, galleryElement) {

        if (!galleryElement) {

            return;

        }


        galleryElement.innerHTML = "";


        if (!images.length) {

            galleryElement.innerHTML = `
        <div class="panel">
            <p class="muted">
                No property images available.
            </p>
        </div>
    `;

            return;

        }


        images.forEach((image, index) => {

            const imageUrl = image.image;


            if (!imageUrl) {

                return;

            }


            const imageElement = document.createElement("img");


            imageElement.src = imageUrl;


            imageElement.alt = `Property image ${index + 1}`;


            imageElement.loading = index === 0 ? "eager" : "lazy";


            imageElement.onerror = () => {

                imageElement.style.display =
                    "none";

            };


            galleryElement.appendChild(
                imageElement
            );

        });
    }
)