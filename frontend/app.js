const EstateAI = (() => {

  let props = [];


  // =====================================================
  // MONEY FORMATTER
  // Example:
  // 25000000 -> ₹2.5 Cr
  // 8500000  -> ₹85.0 L
  // =====================================================

  const money = (n) => {

    n = Number(n) || 0;

    return (
      "₹" +
      (
        n / 10000000 >= 1
          ? (n / 10000000).toFixed(
              n % 10000000 ? 2 : 0
            ) + " Cr"

          : (n / 100000).toFixed(1) + " L"
      )
    );
  };


  // =====================================================
  // HTML ESCAPE
  // =====================================================

  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[m]
    );


  // =====================================================
  // NORMALIZE API DATA
  //
  // Backend field names
  //        ↓
  // Frontend field names
  // =====================================================

  const normalizeProperty = (property) => {

    const tag =
      property.listing_type === "sale"
        ? "For Sale"

        : property.listing_type === "rent"
          ? "For Rent"

          : property.property_type;


    return {

      id: property.id,

      title: property.title,

      price: Number(property.price),

      location: property.city,

      type: property.property_type,

      beds: property.bedrooms,

      baths: property.bathrooms,

      area: `${property.area_sqft} sq ft`,

      // img: property.thumbnail || "images/default-property.jpg",
      img: property.thumbnail || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=83",

      tag: tag,

      slug: property.slug,

    };
  };


  // =====================================================
  // PROPERTY CARD
  // Original EstateAI card design
  // =====================================================

  const card = (p) => `

    <article class="property-card">

      <div class="property-image">

        <button
          type="button"
          class="heart"
          data-save="${p.id}"
          aria-label="Save property"
        >
          ♡
        </button>


        <a
          href="property-detail.html?slug=${encodeURIComponent(p.slug)}"
          class="property-card-link"
        >

          <span class="badge property-tag">
            ${esc(p.tag)}
          </span>


          <img
            src="${esc(p.img)}"
            alt="${esc(p.title)}"
            onerror="this.onerror=null; this.src='images/default-property.jpg';"
          >

        </a>

      </div>


      <a
        href="property-detail.html?slug=${encodeURIComponent(p.slug)}"
        class="property-card-link"
      >

        <div class="property-body">

          <div class="price">
            ${money(p.price)}
          </div>


          <div class="location">
            ${esc(p.title)} · ${esc(p.location)}
          </div>


          <div class="property-meta">

            <span>
              🛏 ${p.beds} beds
            </span>

            <span>
              🛁 ${p.baths} baths
            </span>

            <span>
              ⌂ ${esc(p.area)}
            </span>

          </div>

        </div>

      </a>

    </article>

  `;


  // =====================================================
  // RENDER ALL PROPERTIES
  // =====================================================

  const renderAll = async () => {

    const wrap =
      document.querySelector(
        "[data-properties]"
      );


    if (!wrap) {
      return;
    }


    // ===================================================
    // GET FILTER VALUES
    // ===================================================

    const type =
      document.querySelector(
        "#filterType"
      )?.value || "";


    const location =
      document.querySelector(
        "#filterLocation"
      )?.value || "";


    const min =
      document.querySelector(
        "#filterMin"
      )?.value || "";


    const max =
      document.querySelector(
        "#filterMax"
      )?.value || "";


    const sort =
      document.querySelector(
        "#sortBy"
      )?.value || "";


    // ===================================================
    // CREATE FILTER OBJECT
    // ===================================================

    const filters = {

      property_type: type,

      city: location,

      min_price: min,

      max_price: max,

      ordering: sort,

    };


    try {

      // =================================================
      // LOADING STATE
      // =================================================

      wrap.innerHTML = `

        <div
          class="empty"
          style="grid-column:1/-1"
        >

          <div class="empty-icon">
            ⌂
          </div>

          <h3>
            Loading properties...
          </h3>

          <p class="muted">
            Finding the right homes for you.
          </p>

        </div>

      `;


      // =================================================
      // API CALL
      // =================================================

      const data =
        await getProperties(
          filters
        );


      // =================================================
      // HANDLE BOTH RESPONSE TYPES
      //
      // Normal:
      // [...]
      //
      // Paginated:
      // {
      //    count: 10,
      //    results: [...]
      // }
      // =================================================

      const apiProperties =
        data.results || data;


      // =================================================
      // NORMALIZE API DATA
      // =================================================

      props =
        apiProperties.map(
          normalizeProperty
        );


      console.log(
        "Properties:",
        props
      );


      // =================================================
      // EMPTY STATE
      // =================================================

      if (!props.length) {

        wrap.innerHTML = `

          <div
            class="empty"
            style="grid-column:1/-1"
          >

            <div class="empty-icon">
              ⌂
            </div>

            <h3>
              No properties match those filters
            </h3>

            <p class="muted">
              Try widening your budget or location.
            </p>

          </div>

        `;

      }


      // =================================================
      // RENDER PROPERTY CARDS
      // =================================================

      else {

        wrap.innerHTML =
          props
            .map(card)
            .join("");


        // =================================================
        // HEART BUTTON EVENTS
        // =================================================

        document
          .querySelectorAll("[data-save]")
          .forEach((button) => {

            button.addEventListener(
              "click",
              (event) => {

                event.preventDefault();

                event.stopPropagation();


                console.log(
                  "Heart clicked:",
                  button.dataset.save
                );

              }
            );

          });

      }


      // =================================================
      // RESULT COUNT
      // =================================================

      const count =
        document.querySelector(
          "#resultCount"
        );


      if (count) {

        count.textContent =
          `${props.length} homes found`;

      }

    }


    catch (error) {

      console.error(
        "Failed to load properties:",
        error
      );


      // =================================================
      // ERROR STATE
      // =================================================

      wrap.innerHTML = `

        <div
          class="empty"
          style="grid-column:1/-1"
        >

          <div class="empty-icon">
            ⚠
          </div>

          <h3>
            Failed to load properties
          </h3>

          <p class="muted">
            Please make sure the Django server is running.
          </p>

        </div>

      `;


      const count =
        document.querySelector(
          "#resultCount"
        );


      if (count) {

        count.textContent =
          "Unable to load properties";

      }

    }

  };


  // =====================================================
  // FILTER INITIALIZATION
  // =====================================================

  const initFilters = () => {

    const filterIds = [

      "filterType",

      "filterLocation",

      "filterMin",

      "filterMax",

      "sortBy",

    ];


    filterIds.forEach(
      (id) => {

        const element =
          document.querySelector(
            "#" + id
          );


        if (!element) {
          return;
        }


        // Text input
        element.addEventListener(
          "input",
          renderAll
        );


        // Select
        element.addEventListener(
          "change",
          renderAll
        );

      }
    );


    // Initial API request
    renderAll();

  };

const loadPropertyDetail = async () => {

    const params = new URLSearchParams(
        window.location.search
    );

    const slug = params.get("slug");


    if (!slug) {

    const staticDetail = {
      title:
        document.querySelector(".detail-title")?.textContent.trim(),
      location:
        document.querySelector(".detail-layout .location")?.textContent.trim(),
      price:
        document.querySelector(".detail-price")?.textContent.trim(),
    };

    console.log(
      "Property detail:",
      staticDetail
    );

        return;
    }

      if (typeof getPropertyDetail !== "function") {

        console.warn(
          "Property detail API is unavailable; using static page details."
        );

        const staticDetail = {
          title:
            document.querySelector(".detail-title")?.textContent.trim(),
          location:
            document.querySelector(".detail-layout .location")?.textContent.trim(),
          price:
            document.querySelector(".detail-price")?.textContent.trim(),
        };

        console.log(
          "Property detail:",
          staticDetail
        );

        return;
      }


    try {

        const property =
            await getPropertyDetail(slug);


        console.log(
            "Property detail:",
            property
        );


        const title = document.querySelector("#detailTitle");

        const location = document.querySelector("#detailLocation");

        const price = document.querySelector("#detailPrice");

        const description = document.querySelector("#detailDescription");

        const beds = document.querySelector("#detailBeds");

        const baths = document.querySelector("#detailBaths");

        const area = document.querySelector("#detailArea");

        const type = document.querySelector("#detailType");

        const address = document.querySelector("#detailAddress");

        const parking = document.querySelector("#detailParking");

        const yearBuilt = document.querySelector("#detailYearBuilt");

        const facing = document.querySelector("#detailFacing");

        const builtUpArea = document.querySelector("#detailBuiltUpArea");


        if (title) {
            title.textContent = property.title;
        }


        if (location) {
            location.textContent = property.city;
        }


        if (price) {
            price.textContent = money(property.price);
        }


        if (description) {
            description.textContent =
                property.description;
        }


        if (beds) {
            beds.textContent =
                property.bedrooms;
        }


        if (baths) {
            baths.textContent =
                property.bathrooms;
        }


        if (area) {
            area.textContent =
                property.area_sqft;
        }


        if (type) {
            type.textContent =
                property.property_type;
        }


        if (address) {
            address.textContent =
                property.address || "Not specified";
        }

        if (parking) {
          parking.textContent = property.parking_spaces || 0;
        }

        if (yearBuilt) {
          yearBuilt.textContent = property.year_built || "N/A";
        }

        if (facing) {
          facing.textContent = property.facing_direction ? property.facing_direction
          .charAt(0).toUpperCase() + property.facing_direction.slice(1) : "Not specified";
        }

        if (builtUpArea) {
          builtUpArea.textContent = property.built_up_area_sqft || "N/A";
        }


    } catch (error) {

        console.error(
            "Failed to load property detail:",
            error
        );

    }

};



  // =====================================================
  // INITIALIZATION
  // =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initFilters();


        if (
          document.querySelector("#detailTitle") ||
          document.querySelector(".detail-title")
        ) {
            loadPropertyDetail();
        }

    }
);


  // =====================================================
  // PUBLIC METHODS
  // =====================================================

  return {

    get props() {
      return props;
    },

    card,

    money,

  };
})();
