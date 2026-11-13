
/* =========================================================
   THE GRAND ÉTOILE
   INDEPENDENT DINING JAVASCRIPT
   Luxury Resort & Spa
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       01. MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        function openMenu() {
            mainNav.classList.add("active");
            mainNav.classList.add("is-open");

            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation");
            menuToggle.textContent = "×";
        }

        function closeMenu() {
            mainNav.classList.remove("active");
            mainNav.classList.remove("is-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
            menuToggle.textContent = "☰";
        }

        // Toggle mobile menu
        menuToggle.addEventListener("click", function () {

            const isOpen = mainNav.classList.contains("active");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        // Close menu after clicking a navigation link
        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                closeMenu();
            });

        });

        // Close menu when clicking outside
        document.addEventListener("click", function (event) {

            if (
                mainNav.classList.contains("active") &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }

        });

        // Close menu with Escape
        document.addEventListener("keydown", function (event) {

            if (
                event.key === "Escape" &&
                mainNav.classList.contains("active")
            ) {
                closeMenu();
                menuToggle.focus();
            }

        });

        // Close menu when returning to desktop screen
        window.addEventListener("resize", function () {

            if (window.innerWidth > 768) {
                closeMenu();
            }

        });

    }


    /* =====================================================
       02. AUTOMATIC COPYRIGHT YEAR
       ===================================================== */

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =====================================================
       03. SMOOTH INTERNAL NAVIGATION
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetID = link.getAttribute("href");

            if (!targetID || targetID === "#") {
                return;
            }

            const targetElement = document.querySelector(targetID);

            if (targetElement) {

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================================
       04. IMAGE LOADING OPTIMIZATION
       ===================================================== */

    const images = document.querySelectorAll("img");

    images.forEach(function (image) {

        image.decoding = "async";

        if (!image.hasAttribute("loading")) {
            image.loading = "lazy";
        }

    });


    /* =====================================================
       05. RESTAURANT CARD INTERACTIONS
       ===================================================== */

    const restaurantCards = document.querySelectorAll(
        ".restaurant-card"
    );

    restaurantCards.forEach(function (card) {

        card.addEventListener("mouseenter", function () {
            card.classList.add("is-hovered");
        });

        card.addEventListener("mouseleave", function () {
            card.classList.remove("is-hovered");
        });

    });


    /* =====================================================
       06. SIGNATURE DISH INTERACTIONS
       ===================================================== */

    const signatureCards = document.querySelectorAll(
        ".signature-card"
    );

    signatureCards.forEach(function (card) {

        card.addEventListener("mouseenter", function () {
            card.classList.add("is-hovered");
        });

        card.addEventListener("mouseleave", function () {
            card.classList.remove("is-hovered");
        });

    });


    /* =====================================================
       07. ACTIVE NAVIGATION LINK
       ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(".main-nav a").forEach(function (link) {

        const linkPage = link.getAttribute("href");

        if (
            linkPage &&
            linkPage.toLowerCase() === currentPage
        ) {
            link.classList.add("active");
        }

    });


    /* =====================================================
       08. INITIALIZATION
       ===================================================== */

    console.log("The Grand Étoile Dining page is ready.");

});


