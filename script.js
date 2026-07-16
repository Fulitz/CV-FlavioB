/* CV corporativo — navegación, movimiento, profundidad y accesibilidad */
(function () {
    "use strict";

    const body = document.body;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    function safeStorageGet(key) {
        try { return window.localStorage.getItem(key); } catch (_) { return null; }
    }

    function safeStorageSet(key, value) {
        try { window.localStorage.setItem(key, value); } catch (_) { /* Optional enhancement. */ }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /* ── Tema editorial ──────────────────────────────────────────────── */
    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
        const isDark = theme === "dark";
        body.classList.toggle("dark", isDark);
        if (themeIcon) themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        if (themeButton) {
            const label = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
            themeButton.setAttribute("aria-label", label);
            themeButton.title = label;
        }
        if (themeMeta) themeMeta.content = isDark ? "#101712" : "#f2eee5";
    }

    applyTheme(safeStorageGet("cv-corporate-theme") || "light");

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            const next = body.classList.contains("dark") ? "light" : "dark";
            safeStorageSet("cv-corporate-theme", next);
            applyTheme(next);
        });
    }

    /* ── Hora local ──────────────────────────────────────────────────── */
    const localTime = document.getElementById("local-time");
    function updateLocalTime() {
        if (!localTime) return;
        const time = new Intl.DateTimeFormat("es-PE", {
            timeZone: "America/Lima",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).format(new Date());
        localTime.textContent = "Lima · " + time;
        localTime.setAttribute("aria-label", "Hora local en Lima: " + time);
    }
    updateLocalTime();
    window.setInterval(updateLocalTime, 30000);

    /* ── Menú responsive ─────────────────────────────────────────────── */
    const menuButton = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    function setMenu(open) {
        if (!menuButton || !navLinks) return;
        navLinks.classList.toggle("open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", function () {
            setMenu(menuButton.getAttribute("aria-expanded") !== "true");
        });
        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () { setMenu(false); });
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") setMenu(false);
        });
        document.addEventListener("click", function (event) {
            if (!navLinks.classList.contains("open")) return;
            if (!navLinks.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
        });
    }

    /* ── Revelado progresivo ─────────────────────────────────────────── */
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    revealItems.forEach(function (item) {
        const delay = Number(item.dataset.delay || 0);
        item.style.setProperty("--reveal-delay", delay + "ms");
    });

    if (!reducedMotion.matches && "IntersectionObserver" in window) {
        body.classList.add("motion-ready");
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -8%", threshold: .08 });
        revealItems.forEach(function (item) { revealObserver.observe(item); });
    } else {
        revealItems.forEach(function (item) { item.classList.add("revealed"); });
    }

    /* ── Scroll: progreso, cabecera, navegación y parallax ───────────── */
    const header = document.getElementById("site-header");
    const progressBar = document.getElementById("scroll-progress-bar");
    const scrollTopButton = document.getElementById("scroll-top");
    const experienceSection = document.getElementById("experience");
    const experienceProgress = document.querySelector(".aside-line span");
    const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
    let previousScrollY = window.scrollY;
    let scrollTicking = false;

    function updateScrollState() {
        const scrollY = window.scrollY;
        const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = clamp(scrollY / scrollable, 0, 1);

        if (progressBar) progressBar.style.transform = "scaleX(" + progress + ")";
        if (header) {
            header.classList.toggle("scrolled", scrollY > 26);
            const movingDown = scrollY > previousScrollY + 8;
            const movingUp = scrollY < previousScrollY - 5;
            const menuOpen = menuButton && menuButton.getAttribute("aria-expanded") === "true";
            if (movingDown && scrollY > 520 && !menuOpen) header.classList.add("header-hidden");
            if (movingUp || scrollY < 120) header.classList.remove("header-hidden");
        }
        if (scrollTopButton) scrollTopButton.classList.toggle("visible", scrollY > 780);

        if (experienceSection && experienceProgress) {
            const rect = experienceSection.getBoundingClientRect();
            const sectionProgress = clamp((window.innerHeight * .45 - rect.top) / Math.max(rect.height - window.innerHeight * .5, 1), 0, 1);
            experienceProgress.style.width = (sectionProgress * 100) + "%";
        }

        if (!reducedMotion.matches && window.innerWidth > 700) {
            parallaxItems.forEach(function (item) {
                const rect = item.getBoundingClientRect();
                if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
                const factor = Number(item.dataset.parallax || 0);
                const distance = (rect.top + rect.height / 2) - window.innerHeight / 2;
                const offset = clamp(-distance * factor, -46, 46);
                item.style.setProperty("--parallax-y", offset.toFixed(2) + "px");
                if (item.classList.contains("portrait-stage")) {
                    item.style.setProperty("--scroll-rotate", clamp(-distance * .0035, -2.5, 4.5).toFixed(2) + "deg");
                }
            });
        }

        previousScrollY = scrollY;
        scrollTicking = false;
    }

    function requestScrollUpdate() {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollState);
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    updateScrollState();

    if (scrollTopButton) {
        scrollTopButton.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
        });
    }

    /* ── Navegación activa ───────────────────────────────────────────── */
    const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const observedSections = sectionLinks.map(function (link) {
        return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);

    if ("IntersectionObserver" in window) {
        const navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                sectionLinks.forEach(function (link) { link.classList.remove("active"); });
                const active = sectionLinks.find(function (link) { return link.getAttribute("href") === "#" + entry.target.id; });
                if (active) active.classList.add("active");
            });
        }, { rootMargin: "-28% 0px -62%", threshold: 0 });
        observedSections.forEach(function (section) { navObserver.observe(section); });
    }

    /* ── Contadores ──────────────────────────────────────────────────── */
    const metricNumbers = Array.from(document.querySelectorAll(".metric-number[data-target]"));
    if (!reducedMotion.matches && "IntersectionObserver" in window) {
        metricNumbers.forEach(function (number) { number.textContent = "0"; });
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                counterObserver.unobserve(entry.target);
                const target = Number(entry.target.dataset.target);
                const duration = target > 1000 ? 1500 : 1000;
                const start = performance.now();
                function frame(now) {
                    const progress = clamp((now - start) / duration, 0, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    entry.target.textContent = Math.round(target * eased).toLocaleString("es-PE");
                    if (progress < 1) window.requestAnimationFrame(frame);
                }
                window.requestAnimationFrame(frame);
            });
        }, { threshold: .5 });
        metricNumbers.forEach(function (number) { counterObserver.observe(number); });
    }

    /* ── Superficies reactivas y profundidad 3D ──────────────────────── */
    const interactiveSurfaces = Array.from(document.querySelectorAll(".interactive-surface"));
    interactiveSurfaces.forEach(function (surface) {
        surface.addEventListener("pointermove", function (event) {
            const rect = surface.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            surface.style.setProperty("--pointer-x", x.toFixed(1) + "%");
            surface.style.setProperty("--pointer-y", y.toFixed(1) + "%");
        });
    });

    const tiltItems = Array.from(document.querySelectorAll("[data-tilt]"));
    if (finePointer.matches && !reducedMotion.matches) {
        tiltItems.forEach(function (item) {
            item.addEventListener("pointermove", function (event) {
                const rect = item.getBoundingClientRect();
                const strength = Number(item.dataset.tiltStrength || 3);
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;
                item.classList.add("tilting");
                item.style.setProperty("--tilt-x", (-y * strength).toFixed(2) + "deg");
                item.style.setProperty("--tilt-y", (x * strength).toFixed(2) + "deg");
            });
            item.addEventListener("pointerleave", function () {
                item.classList.remove("tilting");
                item.style.setProperty("--tilt-x", "0deg");
                item.style.setProperty("--tilt-y", "0deg");
            });
        });
    }

    /* ── Botones magnéticos ──────────────────────────────────────────── */
    const magneticItems = Array.from(document.querySelectorAll(".magnetic"));
    if (finePointer.matches && !reducedMotion.matches) {
        magneticItems.forEach(function (item) {
            item.addEventListener("pointermove", function (event) {
                const rect = item.getBoundingClientRect();
                const x = (event.clientX - rect.left - rect.width / 2) * .12;
                const y = (event.clientY - rect.top - rect.height / 2) * .16;
                item.style.setProperty("--magnetic-x", x.toFixed(2) + "px");
                item.style.setProperty("--magnetic-y", y.toFixed(2) + "px");
            });
            item.addEventListener("pointerleave", function () {
                item.style.setProperty("--magnetic-x", "0px");
                item.style.setProperty("--magnetic-y", "0px");
            });
        });
    }

    /* ── Galerías compactas de proyectos ─────────────────────────────── */
    const projectGalleries = Array.from(document.querySelectorAll("[data-project-gallery]"));
    projectGalleries.forEach(function (gallery) {
        const activeImage = gallery.querySelector(".project-active-image");
        const controls = Array.from(gallery.querySelectorAll("[data-gallery-src]"));
        if (!activeImage || !controls.length) return;

        controls.forEach(function (control) {
            control.addEventListener("click", function () {
                if (control.classList.contains("is-active")) return;
                controls.forEach(function (item) {
                    const selected = item === control;
                    item.classList.toggle("is-active", selected);
                    item.setAttribute("aria-selected", String(selected));
                });

                activeImage.classList.add("is-switching");
                const updateImage = function () {
                    activeImage.src = control.dataset.gallerySrc;
                    activeImage.alt = control.dataset.galleryAlt || "Captura del proyecto";
                    activeImage.classList.remove("is-switching");
                };
                if (reducedMotion.matches) updateImage();
                else window.setTimeout(updateImage, 140);
            });
        });
    });

    /* ── Copiar correo y exportar ────────────────────────────────────── */
    const copyButton = document.getElementById("copy-email");
    const copyStatus = document.getElementById("copy-status");

    function fallbackCopy(text) {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const success = document.execCommand("copy");
        field.remove();
        return success;
    }

    if (copyButton) {
        copyButton.addEventListener("click", async function () {
            const email = copyButton.dataset.email;
            let copied = false;
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                    copied = true;
                } else copied = fallbackCopy(email);
            } catch (_) {
                copied = fallbackCopy(email);
            }
            if (copyStatus) copyStatus.textContent = copied ? "Correo copiado: " + email : "Correo: " + email;
            window.setTimeout(function () { if (copyStatus) copyStatus.textContent = ""; }, 3500);
        });
    }

    const printButton = document.getElementById("print-pdf");
    let originalTitle = document.title;
    if (printButton) printButton.addEventListener("click", function () { window.print(); });
    window.addEventListener("beforeprint", function () {
        originalTitle = document.title;
        document.title = "CV_Flavio_Bravo_Perfil_Integral";
    });
    window.addEventListener("afterprint", function () { document.title = originalTitle; });

    /* ── Fecha y cambios de preferencias ─────────────────────────────── */
    const currentYear = document.getElementById("current-year");
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());

    reducedMotion.addEventListener("change", function () {
        if (reducedMotion.matches) {
            body.classList.remove("motion-ready");
            revealItems.forEach(function (item) { item.classList.add("revealed"); });
            parallaxItems.forEach(function (item) { item.style.setProperty("--parallax-y", "0px"); });
        }
    });
}());
