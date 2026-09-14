
// const EstateAI = (() => {
//   const props = [
//     { id: 1, title: "The Courtyard Residence", price: 18500000, location: "Sector 44, Noida", type: "Villa", beds: 4, baths: 4, area: "3,250 sq ft", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=82", tag: "Featured" },
//     { id: 2, title: "Skyline Verve", price: 11200000, location: "Sector 137, Noida", type: "Apartment", beds: 3, baths: 3, area: "1,980 sq ft", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=82", tag: "New" },
//     { id: 3, title: "Olive Grove House", price: 24500000, location: "Golf Course Road, Gurugram", type: "Villa", beds: 5, baths: 5, area: "4,100 sq ft", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=82", tag: "Premium" },
//     { id: 4, title: "Mansion 17", price: 32500000, location: "Jubilee Hills, Hyderabad", type: "Independent House", beds: 5, baths: 6, area: "5,200 sq ft", img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=82", tag: "Hot" },
//     { id: 5, title: "The Banyan Apartment", price: 8600000, location: "Whitefield, Bengaluru", type: "Apartment", beds: 2, baths: 2, area: "1,420 sq ft", img: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=82", tag: "Value" },
//     { id: 6, title: "Terracotta Villa", price: 19800000, location: "Panchshil Nagar, Pune", type: "Villa", beds: 4, baths: 4, area: "2,980 sq ft", img: "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1000&q=82", tag: "Featured" }
//   ];
//   const money = n => "₹" + (n / 10000000 >= 1 ? (n / 10000000).toFixed(n % 10000000 ? 2 : 0) + " Cr" : (n / 100000).toFixed(1) + " L");
//   const esc = s => String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
//   const card = p => `
//     <article class="property-card">
//       <div class="property-image">
//         <button class="heart" data-save="${p.id}" aria-label="Save property">♡</button>
//         <span class="badge property-tag">${esc(p.tag)}</span>
//         <img src="${p.img}" alt="${esc(p.title)}">
//       </div>
//       <div class="property-body">
//         <div class="price">${money(p.price)}</div>
//         <div class="location">${esc(p.title)} · ${esc(p.location)}</div>
//         <div class="property-meta"><span>🛏 ${p.beds} beds</span><span>🛁 ${p.baths} baths</span><span>⌂ ${p.area}</span></div>
//       </div>
//     </article>`;
//   const toast = msg => {
//     let t = document.querySelector(".toast");
//     if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
//     t.textContent = msg; t.classList.add("show"); clearTimeout(window.__toast);
//     window.__toast = setTimeout(() => t.classList.remove("show"), 1800);
//   };
//   const initNav = () => {
//     const toggle = document.querySelector(".menu-toggle"), links = document.querySelector(".nav-links");
//     if (toggle && links) toggle.addEventListener("click", () => links.classList.toggle("open"));
//   };
//   const savedKey = "estateai_saved";
//   const getSaved = () => JSON.parse(localStorage.getItem(savedKey) || "[]");
//   const toggleSave = id => {
//     const saved = getSaved(); const i = saved.indexOf(Number(id));
//     if (i >= 0) { saved.splice(i, 1); toast("Removed from saved properties"); }
//     else { saved.push(Number(id)); toast("Property saved to your wishlist"); }
//     localStorage.setItem(savedKey, JSON.stringify(saved));
//     document.querySelectorAll(`[data-save="${id}"]`).forEach(b => { b.classList.toggle("saved", saved.includes(Number(id))); b.textContent = saved.includes(Number(id)) ? "♥" : "♡" });
//   };
//   const initSaves = () => {
//     document.querySelectorAll("[data-save]").forEach(b => {
//       const id = Number(b.dataset.save); const saved = getSaved();
//       b.classList.toggle("saved", saved.includes(id)); b.textContent = saved.includes(id) ? "♥" : "♡";
//       b.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); toggleSave(id); });
//     });
//   };
//   const renderFeatured = () => {
//     const wrap = document.querySelector("[data-featured]");
//     if (wrap) { wrap.innerHTML = props.slice(0, 3).map(card).join(""); initSaves(); }
//   };
//   const renderAll = () => {
//     const wrap = document.querySelector("[data-properties]"); if (!wrap) return;
//     const type = document.querySelector("#filterType")?.value || "";
//     const location = (document.querySelector("#filterLocation")?.value || "").toLowerCase();
//     const min = Number(document.querySelector("#filterMin")?.value || 0);
//     const max = Number(document.querySelector("#filterMax")?.value || 999999999);
//     const q = props.filter(p => (!type || p.type === type) && (!location || p.location.toLowerCase().includes(location)) && p.price >= min && p.price <= max);
//     wrap.innerHTML = q.length ? q.map(card).join("") : `<div class="empty" style="grid-column:1/-1"><div class="empty-icon">⌂</div><h3>No properties match those filters</h3><p class="muted">Try widening your budget or location.</p></div>`;
//     initSaves();
//     const count = document.querySelector("#resultCount"); if (count) count.textContent = `${q.length} homes found`;
//   };
//   const initFilters = () => {
//     ["filterType", "filterLocation", "filterMin", "filterMax"].forEach(id => document.querySelector("#" + id)?.addEventListener("input", renderAll));
//     renderAll();
//   };
//   const initAuthToggles = () => {
//     document.querySelectorAll("[data-toggle-group]").forEach(group => {
//       group.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => { group.querySelectorAll("button").forEach(b => b.classList.remove("active")); btn.classList.add("active") }));
//     });
//   };
//   const initForms = () => {
//     document.querySelectorAll("form[data-demo]").forEach(f => f.addEventListener("submit", e => { e.preventDefault(); toast(f.dataset.message || "Saved successfully"); }));
//   };
//   const initChat = () => {
//     const form = document.querySelector("#chatForm"), input = document.querySelector("#chatInput"), messages = document.querySelector("#chatMessages");
//     if (!form) return;
//     const reply = (text) => {
//       const bubble = document.createElement("div"); bubble.className = "bubble ai";
//       let ans = "I can help with pricing, neighbourhoods, listings, visit planning, or a rough monthly EMI estimate.";
//       const low = text.toLowerCase();
//       if (low.includes("emi") || low.includes("mortgage") || low.includes("loan")) ans = "For a ₹1.2 Cr home, 20% down, 8.5% rate over 20 years, the rough EMI is about ₹83,000/month. Share your budget, down payment and tenure for another estimate.";
//       else if (low.includes("similar")) ans = "For Skyline Verve, I’d compare The Banyan Apartment in Whitefield and other 2–3 BHK homes around ₹80L–₹1.2Cr with strong rental demand.";
//       else if (low.includes("visit")) ans = "Absolutely. Open a listing and choose “Schedule a Visit”; I’ll help you compare suitable time slots.";
//       else if (low.includes("best area")) ans = "Tell me your commute, budget, and preference (quiet, nightlife, schools, rental yield), and I’ll narrow it down.";
//       bubble.innerHTML = `${esc(ans)}`; messages.appendChild(bubble); messages.scrollTop = messages.scrollHeight;
//     };
//     form.addEventListener("submit", e => { e.preventDefault(); const text = input.value.trim(); if (!text) return; const b = document.createElement("div"); b.className = "bubble user"; b.textContent = text; messages.appendChild(b); input.value = ""; messages.scrollTop = messages.scrollHeight; setTimeout(() => reply(text), 450); });
//     document.querySelectorAll("[data-prompt]").forEach(b => b.addEventListener("click", () => { input.value = b.dataset.prompt; input.focus(); }));
//   };
//   document.addEventListener("DOMContentLoaded", () => { initNav(); renderFeatured(); initFilters(); initAuthToggles(); initForms(); initChat(); initSaves(); });
//   return { props, card, money, toggleSave, toast };
// })();



const EstateAI = (() => {

  // =========================
  // Load properties from API
  // =========================
  
  const props = [
    {
      id: 1,
      title: "The Courtyard Residence",
      price: 18500000,
      location: "Sector 44, Noida",
      type: "Villa",
      beds: 4,
      baths: 4,
      area: "3,250 sq ft",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=82",
      tag: "Featured"
    },
    {
      id: 2,
      title: "Skyline Verve",
      price: 11200000,
      location: "Sector 137, Noida",
      type: "Apartment",
      beds: 3,
      baths: 3,
      area: "1,980 sq ft",
      img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=82",
      tag: "New"
    },
    {
      id: 3,
      title: "Olive Grove House",
      price: 24500000,
      location: "Golf Course Road, Gurugram",
      type: "Villa",
      beds: 5,
      baths: 5,
      area: "4,100 sq ft",
      img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=82",
      tag: "Premium"
    },
    {
      id: 4,
      title: "Mansion 17",
      price: 32500000,
      location: "Jubilee Hills, Hyderabad",
      type: "Independent House",
      beds: 5,
      baths: 6,
      area: "5,200 sq ft",
      img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=82",
      tag: "Hot"
    },
    {
      id: 5,
      title: "The Banyan Apartment",
      price: 8600000,
      location: "Whitefield, Bengaluru",
      type: "Apartment",
      beds: 2,
      baths: 2,
      area: "1,420 sq ft",
      img: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=82",
      tag: "Value"
    },
    {
      id: 6,
      title: "Terracotta Villa",
      price: 19800000,
      location: "Panchshil Nagar, Pune",
      type: "Villa",
      beds: 4,
      baths: 4,
      area: "2,980 sq ft",
      img: "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1000&q=82",
      tag: "Featured"
    }
  ];
  
  const loadPropertiesFromAPI = async () => {
    try {
      const data = await getProperties();

      console.log("Properties from API:", data);

    } catch (error) {
      console.error("Failed to load properties:", error);
    }
  };


  // =========================
  // Helper functions
  // =========================
  const money = n =>
    "₹" +
    (
      n / 10000000 >= 1
        ? (n / 10000000).toFixed(n % 10000000 ? 2 : 0) + " Cr"
        : (n / 100000).toFixed(1) + " L"
    );

  const esc = s =>
    String(s).replace(
      /[&<>"']/g,
      m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[m])
    );


  // =========================
  // Property card
  // =========================
  const card = p => `
    <article class="property-card">
      <div class="property-image">

        <button
          class="heart"
          data-save="${p.id}"
          aria-label="Save property"
        >
          ♡
        </button>

        <span class="badge property-tag">
          ${esc(p.tag || "Property")}
        </span>

        <img
          src="${p.img || ""}"
          alt="${esc(p.title || "Property")}"
        >

      </div>

      <div class="property-body">

        <div class="price">
          ${money(p.price)}
        </div>

        <div class="location">
          ${esc(p.title)} · ${esc(p.location)}
        </div>

        <div class="property-meta">
          <span>🛏 ${p.beds} beds</span>
          <span>🛁 ${p.baths} baths</span>
          <span>⌂ ${p.area}</span>
        </div>

      </div>
    </article>
  `;


  // =========================
  // Toast
  // =========================
  const toast = msg => {
    let t = document.querySelector(".toast");

    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }

    t.textContent = msg;
    t.classList.add("show");

    clearTimeout(window.__toast);

    window.__toast = setTimeout(() => {
      t.classList.remove("show");
    }, 1800);
  };


  // =========================
  // Navigation
  // =========================
  const initNav = () => {
    const toggle = document.querySelector(".menu-toggle");
    const links = document.querySelector(".nav-links");

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        links.classList.toggle("open");
      });
    }
  };


  // =========================
  // Saved properties
  // =========================
  const savedKey = "estateai_saved";

  const getSaved = () =>
    JSON.parse(localStorage.getItem(savedKey) || "[]");


  const toggleSave = id => {
    const saved = getSaved();

    const i = saved.indexOf(Number(id));

    if (i >= 0) {
      saved.splice(i, 1);
      toast("Removed from saved properties");
    } else {
      saved.push(Number(id));
      toast("Property saved to your wishlist");
    }

    localStorage.setItem(
      savedKey,
      JSON.stringify(saved)
    );

    document
      .querySelectorAll(`[data-save="${id}"]`)
      .forEach(b => {

        b.classList.toggle(
          "saved",
          saved.includes(Number(id))
        );

        b.textContent = saved.includes(Number(id))
          ? "♥"
          : "♡";
      });
  };


  const initSaves = () => {
    document
      .querySelectorAll("[data-save]")
      .forEach(b => {

        const id = Number(b.dataset.save);
        const saved = getSaved();

        b.classList.toggle(
          "saved",
          saved.includes(id)
        );

        b.textContent = saved.includes(id)
          ? "♥"
          : "♡";

        b.addEventListener("click", e => {
          e.preventDefault();
          e.stopPropagation();

          toggleSave(id);
        });
      });
  };


  // =========================
  // Featured properties
  // =========================
  const renderFeatured = () => {
    const wrap = document.querySelector(
      "[data-featured]"
    );

    if (wrap) {
      wrap.innerHTML = props
        .slice(0, 3)
        .map(card)
        .join("");

      initSaves();
    }
  };


  // =========================
  // Render all properties
  // =========================
  const renderAll = () => {

    const wrap = document.querySelector(
      "[data-properties]"
    );

    if (!wrap) return;

    const type =
      document.querySelector("#filterType")?.value || "";

    const location =
      (
        document.querySelector("#filterLocation")?.value ||
        ""
      ).toLowerCase();

    const min =
      Number(
        document.querySelector("#filterMin")?.value || 0
      );

    const max =
      Number(
        document.querySelector("#filterMax")?.value ||
        999999999
      );


    const q = props.filter(p =>
      (!type || p.type === type) &&
      (
        !location ||
        p.location.toLowerCase().includes(location)
      ) &&
      p.price >= min &&
      p.price <= max
    );


    wrap.innerHTML = q.length
      ? q.map(card).join("")
      : `
        <div
          class="empty"
          style="grid-column:1/-1"
        >
          <div class="empty-icon">⌂</div>

          <h3>
            No properties match those filters
          </h3>

          <p class="muted">
            Try widening your budget or location.
          </p>
        </div>
      `;


    initSaves();


    const count =
      document.querySelector("#resultCount");

    if (count) {
      count.textContent =
        `${q.length} homes found`;
    }
  };


  // =========================
  // Filters
  // =========================
  const initFilters = () => {

    [
      "filterType",
      "filterLocation",
      "filterMin",
      "filterMax"
    ].forEach(id => {

      document
        .querySelector("#" + id)
        ?.addEventListener(
          "input",
          renderAll
        );

    });

    renderAll();
  };


  // =========================
  // Auth toggles
  // =========================
  const initAuthToggles = () => {

    document
      .querySelectorAll("[data-toggle-group]")
      .forEach(group => {

        group
          .querySelectorAll("button")
          .forEach(btn => {

            btn.addEventListener(
              "click",
              () => {

                group
                  .querySelectorAll("button")
                  .forEach(b =>
                    b.classList.remove("active")
                  );

                btn.classList.add("active");
              }
            );

          });

      });
  };


  // =========================
  // Demo forms
  // =========================
  const initForms = () => {

    document
      .querySelectorAll("form[data-demo]")
      .forEach(f => {

        f.addEventListener(
          "submit",
          e => {

            e.preventDefault();

            toast(
              f.dataset.message ||
              "Saved successfully"
            );

          }
        );

      });
  };


  // =========================
  // Chat
  // =========================
  const initChat = () => {

    const form =
      document.querySelector("#chatForm");

    const input =
      document.querySelector("#chatInput");

    const messages =
      document.querySelector("#chatMessages");


    if (!form) return;


    const reply = text => {

      const bubble =
        document.createElement("div");

      bubble.className = "bubble ai";


      let ans =
        "I can help with pricing, neighbourhoods, listings, visit planning, or a rough monthly EMI estimate.";


      const low =
        text.toLowerCase();


      if (
        low.includes("emi") ||
        low.includes("mortgage") ||
        low.includes("loan")
      ) {

        ans =
          "For a ₹1.2 Cr home, 20% down, 8.5% rate over 20 years, the rough EMI is about ₹83,000/month. Share your budget, down payment and tenure for another estimate.";

      } else if (
        low.includes("similar")
      ) {

        ans =
          "For Skyline Verve, I’d compare The Banyan Apartment in Whitefield and other 2–3 BHK homes around ₹80L–₹1.2Cr with strong rental demand.";

      } else if (
        low.includes("visit")
      ) {

        ans =
          "Absolutely. Open a listing and choose “Schedule a Visit”; I’ll help you compare suitable time slots.";

      } else if (
        low.includes("best area")
      ) {

        ans =
          "Tell me your commute, budget, and preference (quiet, nightlife, schools, rental yield), and I’ll narrow it down.";
      }


      bubble.innerHTML =
        `${esc(ans)}`;

      messages.appendChild(bubble);

      messages.scrollTop =
        messages.scrollHeight;
    };


    form.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        const text =
          input.value.trim();

        if (!text) return;


        const b =
          document.createElement("div");

        b.className = "bubble user";

        b.textContent = text;

        messages.appendChild(b);

        input.value = "";

        messages.scrollTop =
          messages.scrollHeight;


        setTimeout(
          () => reply(text),
          450
        );

      }
    );


    document
      .querySelectorAll("[data-prompt]")
      .forEach(b => {

        b.addEventListener(
          "click",
          () => {

            input.value =
              b.dataset.prompt;

            input.focus();

          }
        );

      });
  };


  // =========================
  // Page initialization
  // =========================
  document.addEventListener(
    "DOMContentLoaded",
    () => {

      initNav();

      renderFeatured();

      initFilters();

      initAuthToggles();

      initForms();

      initChat();

      initSaves();

      // Load Django API data
      loadPropertiesFromAPI();

    }
  );


  return {
    props,
    card,
    money,
    toggleSave,
    toast
  };

})();