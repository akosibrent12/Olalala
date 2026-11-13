
/* =========================================================
   THE GRAND ÉTOILE
   ABOUT PAGE - JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        function openMenu() {
            mainNav.classList.add("active");
            mainNav.classList.add("is-open");

            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation menu");
            menuToggle.innerHTML = "✕";
        }

        function closeMenu() {
            mainNav.classList.remove("active");
            mainNav.classList.remove("is-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
            menuToggle.innerHTML = "☰";
        }

        menuToggle.addEventListener("click", function () {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when a navigation link is clicked
        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (event) {
            if (
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Close menu with Escape key
        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                menuToggle.getAttribute("aria-expanded") === "true"
            ) {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Reset navigation when returning to desktop layout
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }


    /* =====================================================
       AUTOMATIC FOOTER YEAR
       ===================================================== */

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =====================================================
       SMOOTH SCROLLING
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

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
       ACTIVE NAVIGATION LINK
       ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    mainNav?.querySelectorAll("a").forEach(function (link) {

        const linkPage = link.getAttribute("href")
            .split("/")
            .pop()
            .toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });


    /* =====================================================
       IMAGE LOADING OPTIMIZATION
       ===================================================== */

    document.querySelectorAll("img").forEach(function (image) {

        image.decoding = "async";

        if (!image.hasAttribute("loading")) {
            image.loading = "lazy";
        }
    });


    /* =====================================================
       SCROLL REVEAL ANIMATIONS
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".about-story-image, " +
        ".about-story-content, " +
        ".mission-card, " +
        ".value-card, " +
        ".hospitality-content, " +
        ".hospitality-image, " +
        ".brand-statement-content"
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element) {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });

    }


    /* =====================================================
       ACCESSIBILITY: SKIP LINK
       ===================================================== */

    const skipLink = document.querySelector(".skip-link");

    if (skipLink) {
        skipLink.textContent = "Skip to main content";
    }


    /* =====================================================
       PAGE INITIALIZATION
       ===================================================== */

    console.log("The Grand Étoile About Page Loaded Successfully.");

});


