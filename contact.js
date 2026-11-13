
/* =========================================================
   THE GRAND ÉTOILE
   CONTACT & RESERVATIONS - JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {

        function openMenu() {
            mainNav.classList.add("active");
            mainNav.classList.add("is-open");

            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation");
            menuToggle.textContent = "✕";
        }

        function closeMenu() {
            mainNav.classList.remove("active");
            mainNav.classList.remove("is-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
            menuToggle.textContent = "☰";
        }

        menuToggle.addEventListener("click", function () {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            isOpen ? closeMenu() : openMenu();
        });

        // Close menu after selecting a navigation link
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

        // Close menu using Escape
        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                menuToggle.getAttribute("aria-expanded") === "true"
            ) {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Close menu when switching to desktop
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }


    /* =====================================================
       2. AUTOMATIC FOOTER YEAR
       ===================================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       3. RESERVATION FORM
       ===================================================== */

    const reservationForm = document.getElementById("reservationForm");
    const formMessage = document.getElementById("formMessage");

    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");

    if (reservationForm) {

        // Get today's date using local time
        function getLocalDate() {
            const today = new Date();

            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}`;
        }

        // Prevent selecting dates in the past
        const today = getLocalDate();

        if (checkin) {
            checkin.min = today;
        }

        if (checkout) {
            checkout.min = today;
        }

        // Update the earliest checkout date
        if (checkin && checkout) {

            checkin.addEventListener("change", function () {

                checkout.min = checkin.value || today;

                if (
                    checkout.value &&
                    checkout.value <= checkin.value
                ) {
                    checkout.value = "";
                }

            });

            // Ensure checkout is after check-in
            checkout.addEventListener("change", function () {

                if (
                    checkin.value &&
                    checkout.value <= checkin.value
                ) {
                    checkout.setCustomValidity(
                        "Check-out must be at least one day after check-in."
                    );
                } else {
                    checkout.setCustomValidity("");
                }

            });
        }


        /* =================================================
           4. FORM SUBMISSION
           ================================================= */

        reservationForm.addEventListener("submit", function (event) {

            event.preventDefault();

            // Clear previous message
            if (formMessage) {
                formMessage.textContent = "";
                formMessage.className = "form-message";
            }

            // Validate all required fields
            if (!reservationForm.checkValidity()) {
                reservationForm.reportValidity();
                return;
            }

            // Validate stay dates
            if (checkin && checkout) {

                if (checkout.value <= checkin.value) {

                    checkout.setCustomValidity(
                        "Please choose a check-out date after your check-in date."
                    );

                    checkout.reportValidity();
                    checkout.setCustomValidity("");

                    return;
                }
            }

            // Get guest information
            const formData = new FormData(reservationForm);

            const firstName = formData.get("firstName").trim();
            const lastName = formData.get("lastName").trim();

            const email = formData.get("email");
            const roomType = formData.get("roomType");

            // Display confirmation message
            if (formMessage) {

                formMessage.textContent =
                    `Thank you, ${firstName} ${lastName}. ` +
                    `Your reservation inquiry has been completed for ` +
                    `${roomType}. This is a demonstration form; ` +
                    `your information has not been sent to the resort.`;

                formMessage.classList.add("success");
            }

            // Scroll to confirmation message
            if (formMessage) {
                formMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            console.log("Reservation inquiry validated:", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                checkin: formData.get("checkin"),
                checkout: formData.get("checkout"),
                adults: formData.get("adults"),
                children: formData.get("children"),
                roomType: roomType,
                occasion: formData.get("occasion"),
                requests: formData.get("requests")
            });

        });

        // Clear confirmation when the guest edits the form
        reservationForm.addEventListener("input", function () {
            if (formMessage) {
                formMessage.textContent = "";
                formMessage.className = "form-message";
            }
        });

        reservationForm.addEventListener("change", function () {
            if (formMessage) {
                formMessage.textContent = "";
                formMessage.className = "form-message";
            }
        });

    }


    /* =====================================================
       5. SMOOTH SCROLLING
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });


    /* =====================================================
       6. IMAGE OPTIMIZATION
       ===================================================== */

    document.querySelectorAll("img").forEach(function (image) {

        image.decoding = "async";

        if (!image.hasAttribute("loading")) {
            image.loading = "lazy";
        }

    });


    /* =====================================================
       7. ACTIVE NAVIGATION LINK
       ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (mainNav) {

        mainNav.querySelectorAll("a").forEach(function (link) {

            const linkPage = link.getAttribute("href")
                .split("/")
                .pop()
                .toLowerCase();

            if (linkPage === currentPage) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }

        });

    }


    /* =====================================================
       8. PAGE INITIALIZATION
       ===================================================== */

    console.log(
        "The Grand Étoile Contact & Reservations Page Loaded Successfully."
    );

});


