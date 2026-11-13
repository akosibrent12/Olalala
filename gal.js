
/* =========================================================
   THE GRAND ÉTOILE
   INDEPENDENT GALLERY JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       01. MOBILE NAVIGATION
       ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle") ||
        document.querySelector(".menu-toggle");

    const mainNav =
        document.getElementById("main-navigation") ||
        document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        function openMenu() {
            mainNav.classList.add("is-open");
            mainNav.classList.add("active");

            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation menu");
            menuToggle.textContent = "×";
        }

        function closeMenu() {
            mainNav.classList.remove("is-open");
            mainNav.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
            menuToggle.textContent = "☰";
        }

        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.contains("is-open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu after clicking a navigation link
        mainNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (event) {
            if (
                mainNav.classList.contains("is-open") &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Close menu when returning to desktop size
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        // Close menu with Escape
        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                mainNav.classList.contains("is-open")
            ) {
                closeMenu();
                menuToggle.focus();
            }
        });
    }


    /* =====================================================
       02. AUTOMATIC FOOTER YEAR
       ===================================================== */

    const currentYear = new Date().getFullYear();

    document.querySelectorAll(
        "#current-year, .current-year"
    ).forEach(function (element) {
        element.textContent = currentYear;
    });


    /* =====================================================
       03. GALLERY FILTER SYSTEM
       ===================================================== */

    const filterButtons = document.querySelectorAll(
        ".gallery-filters [data-filter], " +
        ".gallery-filter [data-filter], " +
        ".filter-buttons [data-filter], " +
        ".filter-btn[data-filter]"
    );

    const galleryItems = document.querySelectorAll(
        ".gallery-item[data-category]"
    );

    if (filterButtons.length && galleryItems.length) {

        filterButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const selectedCategory =
                    button.getAttribute("data-filter");

                // Update active filter button
                filterButtons.forEach(function (filter) {
                    filter.classList.remove("active");
                    filter.setAttribute("aria-pressed", "false");
                });

                button.classList.add("active");
                button.setAttribute("aria-pressed", "true");

                // Show or hide gallery images
                galleryItems.forEach(function (item) {

                    const itemCategory =
                        item.getAttribute("data-category");

                    const shouldShow =
                        selectedCategory === "all" ||
                        selectedCategory === itemCategory;

                    item.hidden = !shouldShow;

                });

            });

        });

    }


    /* =====================================================
       04. IMAGE LIGHTBOX
       ===================================================== */

    const galleryImages = Array.from(
        document.querySelectorAll(".gallery-item img")
    );

    if (galleryImages.length) {

        let currentImageIndex = 0;

        // Create lightbox elements
        const lightbox = document.createElement("div");
        lightbox.className = "gallery-lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Gallery image viewer");

        lightbox.innerHTML = `
            <button class="lightbox-close" type="button"
                aria-label="Close image viewer">&times;</button>

            <button class="lightbox-prev" type="button"
                aria-label="Previous image">&#8249;</button>

            <div class="lightbox-content">
                <img class="lightbox-image" src="" alt="">
                <p class="lightbox-caption"></p>
            </div>

            <button class="lightbox-next" type="button"
                aria-label="Next image">&#8250;</button>
        `;

        document.body.appendChild(lightbox);

        const lightboxImage =
            lightbox.querySelector(".lightbox-image");

        const lightboxCaption =
            lightbox.querySelector(".lightbox-caption");

        const closeButton =
            lightbox.querySelector(".lightbox-close");

        const previousButton =
            lightbox.querySelector(".lightbox-prev");

        const nextButton =
            lightbox.querySelector(".lightbox-next");


        // Get currently visible images
        function getVisibleImages() {
            return galleryImages.filter(function (image) {
                return !image.closest(".gallery-item").hidden;
            });
        }


        // Display selected image
        function showImage(index) {

            const visibleImages = getVisibleImages();

            if (!visibleImages.length) return;

            if (index < 0) {
                index = visibleImages.length - 1;
            }

            if (index >= visibleImages.length) {
                index = 0;
            }

            currentImageIndex = index;

            const selectedImage = visibleImages[index];

            lightboxImage.src = selectedImage.currentSrc ||
                                selectedImage.src;

            lightboxImage.alt = selectedImage.alt || "Gallery image";

            const galleryItem =
                selectedImage.closest(".gallery-item");

            const heading = galleryItem
                ? galleryItem.querySelector("h3")
                : null;

            lightboxCaption.textContent = heading
                ? heading.textContent.trim()
                : selectedImage.alt;

        }


        // Open lightbox
        function openLightbox(image) {

            const visibleImages = getVisibleImages();

            currentImageIndex = visibleImages.indexOf(image);

            if (currentImageIndex === -1) return;

            showImage(currentImageIndex);

            lightbox.classList.add("is-visible");
            document.body.classList.add("lightbox-open");

            closeButton.focus();

        }


        // Close lightbox
        function closeLightbox() {

            lightbox.classList.remove("is-visible");
            document.body.classList.remove("lightbox-open");

        }


        // Previous image
        function showPreviousImage() {
            showImage(currentImageIndex - 1);
        }


        // Next image
        function showNextImage() {
            showImage(currentImageIndex + 1);
        }


        // Attach click events to gallery images
        galleryImages.forEach(function (image) {

            image.style.cursor = "zoom-in";

            image.addEventListener("click", function (event) {

                const link = image.closest("a");

                // Prevent an image link from navigating away
                if (link) {
                    event.preventDefault();
                }

                openLightbox(image);

            });

        });


        // Lightbox controls
        closeButton.addEventListener("click", closeLightbox);
        previousButton.addEventListener("click", showPreviousImage);
        nextButton.addEventListener("click", showNextImage);


        // Close when clicking the dark background
        lightbox.addEventListener("click", function (event) {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });


        // Keyboard navigation
        document.addEventListener("keydown", function (event) {

            if (!lightbox.classList.contains("is-visible")) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "ArrowLeft") {
                showPreviousImage();
            }

            if (event.key === "ArrowRight") {
                showNextImage();
            }

        });

    }


    /* =====================================================
       05. SMOOTH INTERNAL NAVIGATION
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetID = link.getAttribute("href");

            if (!targetID || targetID === "#") return;

            const target = document.querySelector(targetID);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       06. GALLERY INITIALIZATION
       ===================================================== */

    console.log("The Grand Étoile Gallery is ready.");

});


