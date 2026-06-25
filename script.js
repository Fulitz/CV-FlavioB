/* script.js — Theme toggle, typed animation, scroll spy, stat counter */
(function () {
    "use strict";

    /* ── THEME ─────────────────────────────── */
    const body        = document.body;
    const themeBtn    = document.getElementById("theme-toggle");
    const themeIcon   = document.getElementById("theme-icon");
    const saved       = localStorage.getItem("theme");

    function applyTheme(isLight) {
        body.classList.toggle("light", isLight);
        themeIcon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    }
    applyTheme(saved === "light");

    themeBtn.addEventListener("click", (e) => {
        const goLight = !body.classList.contains("light");

        // Fallback for browsers that don't support View Transitions or if user prefers reduced motion
        if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            localStorage.setItem("theme", goLight ? "light" : "dark");
            applyTheme(goLight);
            return;
        }

        // Get click coordinates (or fall back to button center if keyboard event)
        const rect = themeBtn.getBoundingClientRect();
        const x = e.clientX ?? (rect.left + rect.width / 2);
        const y = e.clientY ?? (rect.top + rect.height / 2);

        // Distance to furthest corner of screen
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Start transition
        const transition = document.startViewTransition(() => {
            localStorage.setItem("theme", goLight ? "light" : "dark");
            applyTheme(goLight);
        });

        // Animate the clipPath
        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];

            document.documentElement.animate(
                {
                    clipPath: goLight ? clipPath : [...clipPath].reverse(),
                },
                {
                    duration: 450,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    pseudoElement: goLight
                        ? "::view-transition-new(root)"
                        : "::view-transition-old(root)"
                }
            );
        });
    });

    /* ── PRINT PDF ─────────────────────────── */
    document.getElementById("print-pdf").addEventListener("click", () => window.print());

    /* ── TYPED EFFECT ──────────────────────── */
    const phrases = [
        "Fundador de STROMA",
        "Analista de Datos",
        "Especialista SSOMA",
        "Automatización Python",
        "Power BI & SQL",
        "SIG ISO 9001/14001/45001"
    ];
    const el = document.getElementById("typed-role");
    if (el) {
        let pi = 0, ci = 0, deleting = false;
        function type() {
            const phrase = phrases[pi];
            el.textContent = deleting ? phrase.slice(0, ci--) : phrase.slice(0, ci++);
            if (!el.nextSibling || el.nextSibling.className !== "cursor") {
                const cur = document.createElement("span");
                cur.className = "cursor";
                el.after(cur);
            }
            let delay = deleting ? 55 : 95;
            if (!deleting && ci > phrase.length)      { delay = 1800; deleting = true; }
            else if (deleting && ci < 0)               { deleting = false; ci = 0; pi = (pi + 1) % phrases.length; delay = 400; }
            setTimeout(type, delay);
        }
        setTimeout(type, 800);
    }

    /* ── SCROLL REVEAL ─────────────────────── */
    const sections = document.querySelectorAll(".cv-section");
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); revealObs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    sections.forEach(s => revealObs.observe(s));

    /* ── SIDE NAV SPY ──────────────────────── */
    const navDots    = document.querySelectorAll(".nav-dot");
    const allSections = document.querySelectorAll("section[id]");
    const spyObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navDots.forEach(d => d.classList.remove("active"));
                const active = document.querySelector(`.nav-dot[href="#${e.target.id}"]`);
                if (active) active.classList.add("active");
            }
        });
    }, { threshold: 0.4 });
    allSections.forEach(s => spyObs.observe(s));

    /* ── ANIMATED COUNTERS ─────────────────── */
    const statNums = document.querySelectorAll(".stat-number[data-target]");
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            countObs.unobserve(e.target);
            const target = +e.target.dataset.target;
            const duration = 1200;
            const start = performance.now();
            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                e.target.textContent = Math.round(ease * target);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }, { threshold: 0.5 });
    statNums.forEach(n => countObs.observe(n));

    /* ── SMOOTH NAV CLICK ──────────────────── */
    navDots.forEach(dot => {
        dot.addEventListener("click", e => {
            e.preventDefault();
            const target = document.querySelector(dot.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });

    /* ── 3D TILT EFFECT & GLOW COORDINATES ── */
    const tiltCards = document.querySelectorAll(".job-body, .edu-card, .skill-group, .cert-card, .stat-card");
    tiltCards.forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const angleX = (yc - y) / 35; // Max angle X: ~3deg (much more subtle)
            const angleY = (x - xc) / 35; // Max angle Y: ~3deg (much more subtle)
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.008, 1.008, 1.008)`;
            
            // Set coordinates for CSS radial glow
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
    /* ── STROMA INTERACTIVE WIDGET ────────── */
    const widgetTabs = document.querySelectorAll(".widget-tab");
    const stromaDisplay = document.getElementById("stromaDisplay");
    
    const ipercData = {
        soldador: {
            peligro: "Exposición a humos metálicos (óx. de hierro, manganeso) y radiación UV no ionizante.",
            riesgo: "Inhalación de sustancias tóxicas / Neumoconiosis, conjuntivitis actínica y quemaduras oculares.",
            control: "Campanas extractoras móviles de alto vacío, respirador 3M con filtro P100 y sensor IoT de radiación UV en EPP."
        },
        operario: {
            peligro: "Manipulación manual de cargas pesadas y tránsito de equipos móviles (montacargas).",
            riesgo: "Sobreesfuerzo físico / Lumbalgia aguda y atropello por maquinaria / Fracturas graves.",
            control: "Fajas lumbares ergonómicas de control activo, delimitación de pasarelas peatonales mediante proyectores LED y telemetría de proximidad."
        },
        conductor: {
            peligro: "Jornadas de conducción prolongadas y factores climáticos adversos en rutas (neblina, lluvia).",
            riesgo: "Somnolencia y fatiga extrema / Colisión vehicular, despiste o volcadura con fatalidad.",
            control: "Cámaras inteligentes de fatiga activa (DSM) con alertas en cabina, telemetría GPS y control automático de horas de descanso."
        }
    };

    if (widgetTabs && stromaDisplay) {
        widgetTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                widgetTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                
                const puesto = tab.dataset.puesto;
                const data = ipercData[puesto];
                if (data) {
                    stromaDisplay.innerHTML = `
                        <div class="display-row"><span class="display-label">[Peligro]</span> <span class="display-val">${data.peligro}</span></div>
                        <div class="display-row"><span class="display-label">[Riesgo]</span> <span class="display-val">${data.riesgo}</span></div>
                        <div class="display-row"><span class="display-label">[Control Predictivo IA]</span> <span class="display-val display-val--hl">${data.control}</span></div>
                    `;
                }
            });
        });
    }

    /* ── CANVAS PARTICLE SYSTEM ──────────────── */
    const canvas = document.getElementById("bg-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        const maxParticles = 65;
        const connectionDist = 110;
        const mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.colorType = Math.random() > 0.5 ? "green" : "blue";
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction (gentle attraction)
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 0.5;
                        this.y += (dy / dist) * force * 0.5;
                    }
                }

                // Wrap boundaries
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw(isLight) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                if (isLight) {
                    ctx.fillStyle = this.colorType === "green" 
                        ? "rgba(46, 204, 113, 0.35)" 
                        : "rgba(52, 152, 219, 0.35)";
                } else {
                    ctx.fillStyle = this.colorType === "green" 
                        ? "rgba(43, 201, 142, 0.35)" 
                        : "rgba(55, 126, 255, 0.35)";
                }
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener("mouseleave", () => {
            mouse.x = null;
            mouse.y = null;
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isLight = document.body.classList.contains("light");

            // Update & Draw
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(isLight);
            }

            // Draw connection lines
            ctx.lineWidth = 0.6;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDist) {
                        const alpha = (1 - dist / connectionDist) * 0.12;
                        if (isLight) {
                            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
                        } else {
                            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
                        }
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        resizeCanvas();
        animate();
    }

    /* ── PORTFOLIO FILTERS ─────────────────── */
    const filterBtns = document.querySelectorAll(".portfolio-filter-btn");
    const portCards  = document.querySelectorAll(".portfolio-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.dataset.filter;

            portCards.forEach(card => {
                const categories = card.dataset.category.split(" ");
                if (filterValue === "all" || categories.includes(filterValue)) {
                    card.classList.remove("fade-out");
                    card.classList.add("fade-in");
                } else {
                    card.classList.remove("fade-in");
                    card.classList.add("fade-out");
                }
            });
        });
    });

    /* ── PORTFOLIO DETAIL MODAL ────────────── */
    const projectsData = {
        stroma: {
            title: "STROMA Suite &middot; Control Predictivo IA",
            subtitle: "Tecnología & IA &middot; SSOMA &middot; Consultoría",
            img: "stroma_dashboard.png",
            problem: "Dificultad para anticipar actos inseguros, fatiga extrema o condiciones de riesgo en campo (minería y construcción) en tiempo real, lo que derivaba en incidentes graves.",
            solution: "Plataforma de IoT y visión computacional que recolecta datos de cámaras inteligentes de fatiga (DSM), telemetría corporal en EPPs y genera reportes automáticos de control operacional predictivo y planes de acción preventivos.",
            impact: "Simulación de reducción de incidentes graves en un 80%, control continuo de fatiga y cumplimiento automatizado de la Ley N° 29783.",
            tech: ["Python", "Flask", "OpenCV", "TensorFlow", "IoT Telemetry", "Tailwind CSS", "Bootstrap", "Google Fonts"]
        },
        checklist: {
            title: "Auditor SSOMA & Checklist Interactivo",
            subtitle: "SSOMA & Consultoría &middot; Analítica & BI",
            img: "", // Placeholder
            placeholderClass: "portfolio-card-placeholder--ssoma",
            placeholderIcon: "fa-solid fa-list-check",
            problem: "Las inspecciones de seguridad en campo suelen ser en papel, lentas de consolidar, propensas a pérdida de información y con retrasos de semanas en la homologación de subcontratistas.",
            solution: "Aplicación web ligera para auditoría interactiva de 23 estándares críticos de SST, que compila los hallazgos en caliente, asigna responsables, y genera un plan de acción inmediato descargable en PDF.",
            impact: "Reducción del 30% en tiempos de homologación de proveedores y 100% de trazabilidad de inspecciones técnico-legales.",
            tech: ["HTML5", "CSS Grid", "JS Vanilla", "jspdf", "Local Storage", "Font Awesome"]
        },
        nifi: {
            title: "Pipeline de Ingesta Telecom IPT",
            subtitle: "Tecnología & IA &middot; Analítica & BI",
            img: "", // Placeholder
            placeholderClass: "portfolio-card-placeholder--tech",
            placeholderIcon: "fa-solid fa-circle-nodes",
            problem: "Ingesta manual de miles de incidentes y alarmas de red diarias desde múltiples APIs del operador Atento/IPT, resultando en reportes fuera de tiempo y carga laboral excesiva.",
            solution: "Pipeline automatizado en Apache NiFi que extrae datos de red en tiempo real, los almacena en Google Cloud Platform y ejecuta scripts Python para limpiar e integrar información directamente en bases de datos SQL.",
            impact: "Ahorro de 40 horas semanales de carga operativa para la gerencia, eliminando el 100% de errores manuales de reportería.",
            tech: ["Python", "Apache NiFi", "Google Cloud Platform", "Pandas", "SQL Server", "Cron Jobs"]
        },
        powerbi: {
            title: "Dashboard Ejecutivo de Sostenibilidad",
            subtitle: "Analítica & BI &middot; Cumplimiento Ambiental",
            img: "sustainability_dashboard.png",
            problem: "La dirección general carecía de visibilidad agregada sobre los indicadores clave de sostenibilidad, Uptime de infraestructura crítica y conformidad reglamentaria de residuos sólidos.",
            solution: "Cuadro de mando estratégico desarrollado en Power BI Avanzado, integrado mediante SQL a las bases de datos de operaciones, registros SSOMA e indicadores corporativos.",
            impact: "Uptime sostenido de 99.9%, monitoreo inmediato de KPIs ambientales de residuos y control activo de cero accidentes.",
            tech: ["Power BI", "DAX", "MS SQL Server", "ETL Pipelines", "Data Analytics", "Power Query"]
        }
    };

    const modal        = document.getElementById("portfolio-modal");
    const modalImg     = document.getElementById("modal-img-container");
    const modalTitle   = document.getElementById("modal-title");
    const modalSub     = document.getElementById("modal-subtitle");
    const modalProb    = document.getElementById("modal-problem");
    const modalSol     = document.getElementById("modal-solution");
    const modalImpact  = document.getElementById("modal-impact");
    const modalTech    = document.getElementById("modal-tech");
    const modalClose   = modal ? modal.querySelector(".modal-close") : null;
    const modalBack    = modal ? modal.querySelector(".modal-backdrop") : null;

    function openModal(projectKey) {
        const data = projectsData[projectKey];
        if (!data || !modal) return;

        // Image or Placeholder
        if (data.img) {
            modalImg.innerHTML = `<img src="${data.img}" alt="${data.title}">`;
        } else {
            modalImg.innerHTML = `
                <div class="portfolio-card-placeholder ${data.placeholderClass || ''}">
                    <i class="${data.placeholderIcon || 'fa-solid fa-folder-open'}"></i>
                </div>
            `;
        }

        // Text content
        modalTitle.innerHTML = data.title;
        modalSub.textContent = data.subtitle;
        modalProb.textContent = data.problem;
        modalSol.textContent = data.solution;
        modalImpact.textContent = data.impact;

        // Tech tags
        modalTech.innerHTML = "";
        data.tech.forEach(tech => {
            const span = document.createElement("span");
            span.className = "tag tag--tech";
            span.textContent = tech;
            modalTech.appendChild(span);
        });

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Attach click events to portfolio buttons
    document.querySelectorAll(".portfolio-card-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const projectKey = btn.dataset.project;
            openModal(projectKey);
        });
    });

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalBack) modalBack.addEventListener("click", closeModal);

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.classList.contains("active")) {
            closeModal();
        }
    });

    /* ── SVG CIRCLE PROGRESS ANIMATION ──────── */
    const circles = document.querySelectorAll(".circle-progress");
    const statsSection = document.getElementById("stats");

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            statsObserver.unobserve(e.target);

            // Animate progress circles
            circles.forEach(circle => {
                const targetVal = +circle.dataset.value;
                const radius = circle.r.baseVal.value;
                const circumference = 2 * Math.PI * radius; // ~251.2
                
                // Animate dashoffset
                const offset = circumference - (circumference * targetVal) / 100;
                circle.style.strokeDashoffset = offset;
            });
        });
    }, { threshold: 0.2 });

    if (statsSection) statsObserver.observe(statsSection);

    /* ── SAVINGS SIMULATOR (ROI) ────────────── */
    const simHours      = document.getElementById("sim-hours");
    const simRate       = document.getElementById("sim-rate");
    const valHours      = document.getElementById("val-hours");
    const valRate       = document.getElementById("val-rate");
    const outHours      = document.getElementById("out-hours");
    const outMoney      = document.getElementById("out-money");
    const valEfficiency = document.getElementById("val-efficiency");
    const simBarFill    = document.querySelector(".sim-bar-fill");

    function calculateSavings() {
        if (!simHours || !simRate) return;

        const hours = +simHours.value;
        const rate  = +simRate.value;

        // Formula: Weekly Hours * 52 weeks * 75% efficiency of Python automation
        const savedH = Math.round(hours * 52 * 0.75);
        const savedM = savedH * rate;

        // Dynamic productivity efficiency rating depending on scale
        const efficiency = Math.min(60 + Math.round(hours / 2.5), 92);

        // Update view
        if (valHours) valHours.textContent = hours;
        if (valRate) valRate.textContent = rate;
        if (outHours) outHours.textContent = savedH.toLocaleString() + " hrs";
        if (outMoney) outMoney.textContent = "$" + savedM.toLocaleString() + " USD";
        if (valEfficiency) valEfficiency.textContent = efficiency + "%";
        if (simBarFill) simBarFill.style.width = efficiency + "%";
    }

    if (simHours && simRate) {
        simHours.addEventListener("input", calculateSavings);
        simRate.addEventListener("input", calculateSavings);
        // Initial calculation
        calculateSavings();
    }

})();
