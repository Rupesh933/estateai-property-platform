const EstateAI = (() => {
  // =========================================================
  // Global property data
  // =========================================================

  let props = [];

  const fallbackImage =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=82";


  // =========================================================
  // Helper: Escape HTML
  // =========================================================

  const esc = (value) => {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char])
    );
  };


  // =========================================================
  // Helper: Format property type
  // =========================================================

  const formatPropertyType = (type) => {
    if (!type) {
      return "Property";
    }

    return String(type)
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };


  // =========================================================
  // Helper: Format price
  // =========================================================

  const money = (value) => {
    const number = Number(value) || 0;

    if (number >= 10000000) {
      const crore = number / 10000000;

      return (
        "₹" +
        crore.toFixed(crore % 1 === 0 ? 0 : 2) +
        " Cr"
      );
    }

    if (number >= 100000) {
      const lakh = number / 100000;

      return (
        "₹" +
        lakh.toFixed(lakh % 1 === 0 ? 0 : 1) +
        " L"
      );
    }

    return "₹" + number.toLocaleString("en-IN");
  };


  // =========================================================
  // Convert backend property object
  // into frontend property object
  // =========================================================

  const normalizeProperty = (property) => {
    return {
      id: property.id,

      title: property.title || "Untitled Property",

      price: Number(property.price) || 0,

      location:
        [property.address, property.city]
          .filter(Boolean)
          .join(", ") || "Location unavailable",

      type: formatPropertyType(property.property_type),

      beds: Number(property.bedrooms) || 0,

      baths: Number(property.bathrooms) || 0,

      area: property.area_sqft
        ? `${Number(property.area_sqft).toLocaleString(
            "en-IN"
          )} sq ft`
        : "Area unavailable",

      img: property.thumbnail || fallbackImage,

      tag:
        property.listing_type === "rent"
          ? "For Rent"
          : "For Sale",

      slug: property.slug
    };
  };


  // =========================================================
  // Property Card
  // =========================================================

  const card = (property) => {
    return `
      <article class="property-card">

        <div class="property-image">

          <button
            class="heart"
            data-save="${property.id}"
            aria-label="Save property"
            type="button"
          >
            ♡
          </button>

          <span class="badge property-tag">
            ${esc(property.tag)}
          </span>

          <img
            src="${esc(property.img)}"
            alt="${esc(property.title)}"
            onerror="this.src='${fallbackImage}'"
          >

        </div>


        <div class="property-body">

          <div class="price">
            ${money(property.price)}
          </div>

          <div class="location">
            ${esc(property.title)} ·
            ${esc(property.location)}
          </div>

          <div class="property-meta">

            <span>
              🛏 ${property.beds} beds
            </span>

            <span>
              🛁 ${property.baths} baths
            </span>

            <span>
              ⌂ ${esc(property.area)}
            </span>

          </div>

        </div>

      </article>
    `;
  };


  // =========================================================
  // Toast message
  // =========================================================

  const toast = (message) => {
    let toastElement =
      document.querySelector(".toast");

    if (!toastElement) {
      toastElement =
        document.createElement("div");

      toastElement.className = "toast";

      document.body.appendChild(toastElement);
    }

    toastElement.textContent = message;

    toastElement.classList.add("show");

    clearTimeout(window.__toast);

    window.__toast = setTimeout(() => {
      toastElement.classList.remove("show");
    }, 1800);
  };


  // =========================================================
  // Navigation
  // =========================================================

  const initNav = () => {
    const toggle =
      document.querySelector(".menu-toggle");

    const links =
      document.querySelector(".nav-links");

    if (!toggle || !links) {
      return;
    }

    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
  };


  // =========================================================
  // Saved Properties
  // =========================================================

  const savedKey = "estateai_saved";


  const getSaved = () => {
    try {
      return JSON.parse(
        localStorage.getItem(savedKey) || "[]"
      );
    } catch (error) {
      console.error(
        "Could not read saved properties:",
        error
      );

      return [];
    }
  };


  const toggleSave = (id) => {
    const saved = getSaved();

    const numericId = Number(id);

    const index =
      saved.indexOf(numericId);


    if (index >= 0) {
      // Property already saved
      saved.splice(index, 1);

      toast("Removed from saved properties");
    } else {
      // Property not saved yet
      saved.push(numericId);

      toast("Property saved to your wishlist");
    }


    localStorage.setItem(
      savedKey,
      JSON.stringify(saved)
    );


    // Update all buttons having same property id
    document
      .querySelectorAll(`[data-save="${id}"]`)
      .forEach((button) => {

        const isSaved =
          saved.includes(numericId);

        button.classList.toggle(
          "saved",
          isSaved
        );

        button.textContent =
          isSaved ? "♥" : "♡";
      });
  };


  const initSaves = () => {
    const buttons =
      document.querySelectorAll("[data-save]");

    const saved = getSaved();

    buttons.forEach((button) => {

      const id =
        Number(button.dataset.save);

      const isSaved =
        saved.includes(id);


      button.classList.toggle(
        "saved",
        isSaved
      );

      button.textContent =
        isSaved ? "♥" : "♡";


      // Prevent duplicate event listeners
      if (button.dataset.saveInitialized === "true") {
        return;
      }

      button.dataset.saveInitialized = "true";


      button.addEventListener("click", (event) => {

        event.preventDefault();

        event.stopPropagation();

        toggleSave(id);
      });
    });
  };


  // =========================================================
  // Render Featured Properties
  // =========================================================

  const renderFeatured = () => {
    const container =
      document.querySelector("[data-featured]");

    if (!container) {
      return;
    }


    const featured =
      props.slice(0, 3);


    if (!featured.length) {
      container.innerHTML = `
        <div
          class="empty"
          style="grid-column: 1 / -1;"
        >
          <h3>No featured properties</h3>
          <p class="muted">
            Properties will appear here when available.
          </p>
        </div>
      `;

      return;
    }


    container.innerHTML =
      featured
        .map(card)
        .join("");


    initSaves();
  };


  // =========================================================
  // Render Properties
  // =========================================================

  const renderProperties = () => {
    const container =
      document.querySelector("[data-properties]");

    if (!container) {
      return;
    }


    if (!props.length) {

      container.innerHTML = `
        <div
          class="empty"
          style="grid-column:1/-1"
        >

          <div class="empty-icon">
            ⌂
          </div>

          <h3>
            No properties found
          </h3>

          <p class="muted">
            Try changing your filters.
          </p>

        </div>
      `;

    } else {

      container.innerHTML =
        props
          .map(card)
          .join("");
    }


    initSaves();


    const resultCount =
      document.querySelector("#resultCount");

    if (resultCount) {
      resultCount.textContent =
        `${props.length} homes found`;
    }
  };


  // =========================================================
  // Load Properties From Django API
  // =========================================================

  const loadPropertiesFromAPI = async () => {

    // api.js must be loaded before app.js
    if (typeof getProperties !== "function") {

      console.error(
        "getProperties() is not available. " +
        "Make sure api.js is loaded before app.js."
      );

      return;
    }


    try {

      const data =
        await getProperties();


      // DRF can return:
      //
      // 1. Array
      // 2. Pagination object -> { results: [] }

      const listings =
        Array.isArray(data)
          ? data
          : data.results;


      if (!Array.isArray(listings)) {

        throw new Error(
          "Unexpected response from properties API."
        );
      }


      // Convert backend objects
      props =
        listings.map(
          normalizeProperty
        );


      // Render API data
      renderProperties();

      renderFeatured();


    } catch (error) {

      console.error(
        "Failed to load properties:",
        error
      );


      const container =
        document.querySelector(
          "[data-properties]"
        );


      if (container) {

        container.innerHTML = `
          <div
            class="empty"
            style="grid-column:1/-1"
          >

            <div class="empty-icon">
              ⚠
            </div>

            <h3>
              Could not load properties
            </h3>

            <p class="muted">
              Please check whether Django server
              is running.
            </p>

          </div>
        `;
      }


      const resultCount =
        document.querySelector(
          "#resultCount"
        );

      if (resultCount) {
        resultCount.textContent =
          "Unable to load properties";
      }
    }
  };


  // =========================================================
  // Load Filtered Properties From API
  // =========================================================

  const loadFilteredProperties = async () => {

    if (typeof getProperties !== "function") {

      console.error(
        "getProperties() is not available."
      );

      return;
    }


    const typeElement =
      document.querySelector(
        "#filterType"
      );


    const locationElement =
      document.querySelector(
        "#filterLocation"
      );


    const minElement =
      document.querySelector(
        "#filterMin"
      );


    const maxElement =
      document.querySelector(
        "#filterMax"
      );


    const propertyType =
      typeElement?.value || "";


    const city =
      locationElement?.value.trim() || "";


    const minPrice =
      minElement?.value || "";


    const maxPrice =
      maxElement?.value || "";


    // Show loading state
    const container =
      document.querySelector(
        "[data-properties]"
      );


    if (container) {

      container.innerHTML = `
        <div
          class="empty"
          style="grid-column:1/-1"
        >
          <div class="empty-icon">
            ⏳
          </div>

          <h3>
            Loading properties...
          </h3>

          <p class="muted">
            Searching available properties.
          </p>
        </div>
      `;
    }


    try {

      const data =
        await getProperties({
          property_type: propertyType,
          city: city,
          min_price: minPrice,
          max_price: maxPrice
        });


      const listings =
        Array.isArray(data)
          ? data
          : data.results;


      if (!Array.isArray(listings)) {

        throw new Error(
          "Unexpected API response."
        );
      }


      // Convert API response
      props =
        listings.map(
          normalizeProperty
        );


      // Render filtered response
      renderProperties();


    } catch (error) {

      console.error(
        "Failed to load filtered properties:",
        error
      );


      if (container) {

        container.innerHTML = `
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
              Please make sure Django is running
              and try again.
            </p>

          </div>
        `;
      }
    }
  };


  // =========================================================
  // Initialize Filters
  // =========================================================

  const initFilters = () => {

    const type =
      document.querySelector(
        "#filterType"
      );


    const location =
      document.querySelector(
        "#filterLocation"
      );


    const min =
      document.querySelector(
        "#filterMin"
      );


    const max =
      document.querySelector(
        "#filterMax"
      );


    // Dropdown filters
    type?.addEventListener(
      "change",
      loadFilteredProperties
    );


    min?.addEventListener(
      "change",
      loadFilteredProperties
    );


    max?.addEventListener(
      "change",
      loadFilteredProperties
    );


    // Location input
    //
    // For learning/testing purpose we call
    // API after typing.
    //
    // Later we will add debounce so that
    // every keystroke doesn't trigger API call.

    location?.addEventListener(
      "input",
      loadFilteredProperties
    );
  };


  // =========================================================
  // Reset Filters
  // =========================================================

  const resetFilters = () => {

    const type =
      document.querySelector(
        "#filterType"
      );


    const location =
      document.querySelector(
        "#filterLocation"
      );


    const min =
      document.querySelector(
        "#filterMin"
      );


    const max =
      document.querySelector(
        "#filterMax"
      );


    if (type) {
      type.value = "";
    }


    if (location) {
      location.value = "";
    }


    if (min) {
      min.value = "0";
    }


    if (max) {
      max.value = "999999999";
    }


    // Reload all properties
    loadFilteredProperties();
  };


  // =========================================================
  // Authentication UI toggles
  // =========================================================

  const initAuthToggles = () => {

    document
      .querySelectorAll(
        "[data-toggle-group]"
      )
      .forEach((group) => {

        group
          .querySelectorAll("button")
          .forEach((button) => {

            button.addEventListener(
              "click",
              () => {

                group
                  .querySelectorAll("button")
                  .forEach((item) => {

                    item.classList.remove(
                      "active"
                    );
                  });


                button.classList.add(
                  "active"
                );
              }
            );
          });
      });
  };


  // =========================================================
  // Demo Forms
  // =========================================================

  const initForms = () => {

    document
      .querySelectorAll(
        "form[data-demo]"
      )
      .forEach((form) => {

        form.addEventListener(
          "submit",
          (event) => {

            event.preventDefault();


            toast(
              form.dataset.message ||
              "Saved successfully"
            );
          }
        );
      });
  };


  // =========================================================
  // Chat
  // =========================================================

  const initChat = () => {

    const form =
      document.querySelector(
        "#chatForm"
      );


    const input =
      document.querySelector(
        "#chatInput"
      );


    const messages =
      document.querySelector(
        "#chatMessages"
      );


    // Chat page not present
    if (!form || !input || !messages) {
      return;
    }


    const reply = (text) => {

      const bubble =
        document.createElement(
          "div"
        );


      bubble.className =
        "bubble ai";


      let answer =
        "I can help with pricing, neighbourhoods, listings, visit planning, or a rough monthly EMI estimate.";


      const lowerText =
        text.toLowerCase();


      if (
        lowerText.includes("emi") ||
        lowerText.includes("mortgage") ||
        lowerText.includes("loan")
      ) {

        answer =
          "For a ₹1.2 Cr home, 20% down, 8.5% rate over 20 years, the rough EMI is about ₹83,000/month. Share your budget, down payment and tenure for another estimate.";

      } else if (
        lowerText.includes(
          "similar"
        )
      ) {

        answer =
          "I can compare similar properties based on location, price, property type and size.";

      } else if (
        lowerText.includes(
          "visit"
        )
      ) {

        answer =
          "Open a property listing and choose Schedule a Visit. We can add real visit scheduling through the backend later.";

      } else if (
        lowerText.includes(
          "best area"
        )
      ) {

        answer =
          "Tell me your commute, budget and preferences such as schools, nightlife, quiet surroundings or rental yield, and I can narrow down suitable areas.";
      }


      bubble.textContent =
        answer;


      messages.appendChild(
        bubble
      );


      messages.scrollTop =
        messages.scrollHeight;
    };


    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const text =
          input.value.trim();


        if (!text) {
          return;
        }


        // User message
        const userBubble =
          document.createElement(
            "div"
          );


        userBubble.className =
          "bubble user";


        userBubble.textContent =
          text;


        messages.appendChild(
          userBubble
        );


        input.value = "";


        messages.scrollTop =
          messages.scrollHeight;


        // Temporary AI reply
        setTimeout(() => {
          reply(text);
        }, 450);
      }
    );


    // Suggested prompts
    document
      .querySelectorAll(
        "[data-prompt]"
      )
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            input.value =
              button.dataset.prompt;

            input.focus();
          }
        );
      });
  };


  // =========================================================
  // Page initialization
  // =========================================================

  const init = () => {

    initNav();

    initAuthToggles();

    initForms();

    initChat();

    initFilters();

    initSaves();


    // -------------------------------------------------------
    // Property API
    // -------------------------------------------------------
    //
    // If properties page/filter elements exist,
    // load properties from Django API.
    //
    // This prevents API calls on pages that don't need
    // property listing data.

    const propertyContainer =
      document.querySelector(
        "[data-properties]"
      );


    const featuredContainer =
      document.querySelector(
        "[data-featured]"
      );


    if (
      propertyContainer ||
      featuredContainer
    ) {

      loadPropertiesFromAPI();
    }
  };


  // =========================================================
  // DOM Ready
  // =========================================================

  document.addEventListener(
    "DOMContentLoaded",
    init
  );


  // =========================================================
  // Public methods
  // =========================================================

  return {
    get props() {
      return props;
    },

    card,

    money,

    toast,

    toggleSave,

    loadPropertiesFromAPI,

    loadFilteredProperties,

    resetFilters
  };

})();