
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("slug");

    // ========================================
    // Check slug
    // ========================================

    if (!slug) {
        console.error("Property slug is missing.");

        const titleElement = document.getElementById("detailTitle");

        if (titleElement) {
            titleElement.textContent = "Property not found";
        }

        return;
    }

    // ========================================
    // DOM Elements
    // ========================================

    const titleElement = document.getElementById("detailTitle");
    const locationElement = document.getElementById("detailLocation");
    const priceElement = document.getElementById("detailPrice");

    const bedsElement = document.getElementById("detailBeds");
    const bathsElement = document.getElementById("detailBaths");
    const areaElement = document.getElementById("detailArea");
    const parkingElement = document.getElementById("detailParking");

    const descriptionElement =
        document.getElementById("detailDescription");

    const typeElement =
        document.getElementById("detailType");

    const builtUpAreaElement =
        document.getElementById("detailBuiltUpArea");

    const yearBuiltElement =
        document.getElementById("detailYearBuilt");

    const facingElement =
        document.getElementById("detailFacing");

    const addressElement =
        document.getElementById("detailAddress");

    const galleryElement =
        document.getElementById("propertyGallery");

    // ========================================
    // Fetch Property
    // ========================================

    try {
        const property = await getPropertyDetail(slug);

        console.log("Property detail:", property);

        // ========================================
        // Basic Property Information
        // ========================================

        if (titleElement) {
            titleElement.textContent =
                property.title || "Untitled Property";
        }

        if (locationElement) {
            const city = property.city || "";
            const address = property.address || "";

            if (address && city) {
                locationElement.textContent =
                    `${address}, ${city}`;
            } else {
                locationElement.textContent =
                    address || city || "Location not available";
            }
        }

        if (priceElement) {
            priceElement.textContent =
                formatPrice(property.price);
        }

        // ========================================
        // Property Meta
        // ========================================

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

        // ========================================
        // Description
        // ========================================

        if (descriptionElement) {
            descriptionElement.textContent =
                property.description ||
                "No description available.";
        }

        // ========================================
        // Features
        // ========================================

        if (typeElement) {
            typeElement.textContent =
                formatPropertyType(
                    property.property_type
                );
        }

        if (builtUpAreaElement) {
            builtUpAreaElement.textContent =
                property.area_sqft ?? 0;
        }

        if (yearBuiltElement) {
            yearBuiltElement.textContent =
                property.year_built || "N/A";
        }

        if (facingElement) {
            facingElement.textContent =
                formatFacingDirection(
                    property.facing_direction
                );
        }

        if (addressElement) {
            addressElement.textContent =
                property.address || "N/A";
        }

        // ========================================
        // Property Images
        // ========================================

        const images = Array.isArray(property.images)
            ? property.images
            : [];

        console.log(
            "Total property images:",
            images.length
        );

        renderPropertyImages(
            images,
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

        if (galleryElement) {
            galleryElement.innerHTML = `
                <div class="panel">
                    <p class="muted">
                        Unable to load property images.
                    </p>
                </div>
            `;
        }
    }
});


// ========================================
// Format Price
// ========================================

function formatPrice(price) {
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

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(numericPrice);
}


// ========================================
// Format Property Type
// ========================================

function formatPropertyType(type) {
    if (!type) {
        return "N/A";
    }

    return String(type)
        .replace(/_/g, " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
}


// ========================================
// Format Facing Direction
// ========================================

function formatFacingDirection(direction) {
    if (!direction) {
        return "N/A";
    }

    return String(direction)
        .replace(/_/g, " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
}


// ========================================
// Render Property Images
// ========================================

function renderPropertyImages(
    images,
    galleryElement
) {
    if (!galleryElement) {
        console.error(
            "Property gallery element not found."
        );

        return;
    }

    // Clear old content
    galleryElement.innerHTML = "";

    // ========================================
    // No images
    // ========================================

    if (!Array.isArray(images) || images.length === 0) {
        galleryElement.innerHTML = `
            <div class="panel">
                <p class="muted">
                    No property images available.
                </p>
            </div>
        `;

        return;
    }

    // ========================================
    // Create every image
    // ========================================

    images.forEach((image, index) => {
        const imageUrl = image?.image;

        if (!imageUrl) {
            console.warn(
                `Image ${index + 1} does not have a valid URL.`
            );

            return;
        }

        // Wrapper
        const wrapper =
            document.createElement("div");

        wrapper.className = "gallery-item";

        // First image
        if (index === 0) {
            wrapper.classList.add("gallery-main");
        }

        // Image element
        const imageElement =
            document.createElement("img");

        imageElement.src = imageUrl;

        imageElement.alt =
            `Property image ${index + 1}`;

        imageElement.loading =
            index === 0 ? "eager" : "lazy";

        imageElement.decoding = "async";

        // ========================================
        // Broken image handling
        // ========================================

        imageElement.onerror = () => {
            console.error(
                "Failed to load image:",
                imageUrl
            );

            wrapper.remove();

            updateEmptyGalleryMessage(galleryElement);
        };

        // ========================================
        // Add to DOM
        // ========================================

        wrapper.appendChild(imageElement);

        galleryElement.appendChild(wrapper);
    });
}


// ========================================
// Empty gallery message
// ========================================

function updateEmptyGalleryMessage(galleryElement) {
    if (!galleryElement) {
        return;
    }

    const visibleImages =
        galleryElement.querySelectorAll(
            ".gallery-item"
        );

    if (visibleImages.length === 0) {
        galleryElement.innerHTML = `
            <div class="panel">
                <p class="muted">
                    No property images available.
                </p>
            </div>
        `;
    }
}