
/* =========================================================
   THE GRAND ÉTOILE
   MAIN JAVASCRIPT
   Navigation, Booking, Forms & Website Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       01. MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNavigation = document.getElementById("main-navigation");

    function openMenu() {
        if (!menuToggle || !mainNavigation) return;

        mainNavigation.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMenu() {
        if (!menuToggle || !mainNavigation) return;

        mainNavigation.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function toggleMenu() {
        if (!mainNavigation) return;

        const isOpen = mainNavigation.classList.contains("active");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Toggle menu when the hamburger button is clicked.
    if (menuToggle && mainNavigation) {

        menuToggle.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleMenu();
        });

        // Close menu after clicking any navigation link.
        mainNavigation.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                closeMenu();
            });

        });

        // Close menu when clicking outside the navigation.
        document.addEventListener("click", function (event) {

            const clickedInsideMenu = mainNavigation.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }

        });

        // Close menu using the Escape key.
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }

        });

        // Close the mobile menu when returning to desktop size.
        window.addEventListener("resize", function () {

            if (window.innerWidth > 850) {
                closeMenu();
            }

        });

        // Restore the correct menu state when returning to a page.
        window.addEventListener("pageshow", function () {
            closeMenu();
        });

    }


    /* =====================================================
       02. AUTOMATIC FOOTER YEAR
       ===================================================== */

    const currentYearElements = document.querySelectorAll(".current-year");

    currentYearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    /* =====================================================
       03. BOOKING DATE UTILITIES
       ===================================================== */

    function getLocalDateString(date) {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }

    function addDays(dateString, numberOfDays) {

        const date = new Date(dateString + "T12:00:00");

        date.setDate(date.getDate() + numberOfDays);

        return getLocalDateString(date);

    }


    /* =====================================================
       04. BOOKING FORM
       ===================================================== */

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {

        const checkin = bookingForm.querySelector("#checkin");
        const checkout = bookingForm.querySelector("#checkout");

        const today = getLocalDateString(new Date());

        if (checkin && checkout) {

            // Prevent selecting a check-in date in the past.
            checkin.min = today;

            // Set the initial minimum checkout date.
            checkout.min = addDays(today, 1);

            // Update checkout date when check-in changes.
            checkin.addEventListener("change", function () {

                if (!checkin.value) return;

                const minimumCheckout = addDays(checkin.value, 1);

                checkout.min = minimumCheckout;

                // Automatically correct an invalid checkout date.
                if (!checkout.value || checkout.value <= checkin.value) {
                    checkout.value = minimumCheckout;
                }

            });

            // Validate the booking form before submission.
            bookingForm.addEventListener("submit", function (event) {

                if (!checkin.value || !checkout.value) {
                    return;
                }

                if (checkout.value <= checkin.value) {

                    event.preventDefault();

                    checkout.setCustomValidity(
                        "Your check-out date must be after your check-in date."
                    );

                    checkout.reportValidity();

                } else {

                    checkout.setCustomValidity("");

                }

            });

            // Clear custom validation when the user changes the date.
            checkout.addEventListener("change", function () {
                checkout.setCustomValidity("");
            });

        }

    }


    /* =====================================================
       05. RESERVATION FORM URL PREFILL
       ===================================================== */

    const urlParams = new URLSearchParams(window.location.search);

    function findFormField(names) {

        for (const name of names) {

            const field =
                document.querySelector(`[name="${name}"]`) ||
                document.getElementById(name);

            if (field) {
                return field;
            }

        }

        return null;

    }

    function fillField(names, parameterNames) {

        const field = findFormField(names);

        if (!field) return;

        for (const parameter of parameterNames) {

            const value = urlParams.get(parameter);

            if (value !== null && value.trim() !== "") {

                // Do not overwrite information already entered.
                if (!field.value) {
                    field.value = value;
                }

                break;

            }

        }

    }

    // Supports room selections passed from rooms.html.
    fillField(
        ["room", "roomType", "accommodation"],
        ["room", "roomType"]
    );

    // Supports booking dates.
    fillField(
        ["checkin", "checkIn", "arrival"],
        ["checkin", "checkIn"]
    );

    fillField(
        ["checkout", "checkOut", "departure"],
        ["checkout", "checkOut"]
    );

    // Supports guest numbers.
    fillField(
        ["guests", "guest", "adults"],
        ["guests", "guest", "adults"]
    );


    /* =====================================================
       06. GALLERY FILTERING
       ===================================================== */

    const filterButtons = document.querySelectorAll("[data-filter]");
    const galleryItems = document.querySelectorAll("[data-category]");

    if (filterButtons.length && galleryItems.length) {

        filterButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const selectedFilter = button.dataset.filter;

                // Update active filter button.
                filterButtons.forEach(function (item) {
                    item.classList.remove("active");
                    item.setAttribute("aria-pressed", "false");
                });

                button.classList.add("active");
                button.setAttribute("aria-pressed", "true");

                // Show matching gallery items.
                galleryItems.forEach(function (item) {

                    const category = item.dataset.category;

                    const shouldShow =
                        selectedFilter === "all" ||
                        category === selectedFilter;

                    item.hidden = !shouldShow;

                });

            });

        });

    }


    /* =====================================================
       07. IMAGE OPTIMIZATION
       ===================================================== */

    document.querySelectorAll("img").forEach(function (image) {

        if (
            !image.hasAttribute("loading") &&
            !image.hasAttribute("fetchpriority")
        ) {
            image.setAttribute("loading", "lazy");
        }

        if (!image.hasAttribute("decoding")) {
            image.setAttribute("decoding", "async");
        }

    });


    /* =====================================================
       08. CONTACT FORM VALIDATION
       ===================================================== */

    const contactForms = document.querySelectorAll(".contact-form");

    contactForms.forEach(function (form) {

        form.addEventListener("submit", function (event) {

            if (!form.checkValidity()) {

                event.preventDefault();
                form.reportValidity();

            }

        });

    });


    /* =====================================================
       09. SMOOTH INTERNAL NAVIGATION
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetID = link.getAttribute("href");

            if (!targetID || targetID === "#") return;

            const target = document.querySelector(targetID);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       10. INITIALIZATION
       ===================================================== */

    console.log("THE GRAND ÉTOILE | Website initialized successfully.");

});
