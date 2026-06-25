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

    themeBtn.addEventListener("click", () => {
        const goLight = !body.classList.contains("light");
        localStorage.setItem("theme", goLight ? "light" : "dark");
        applyTheme(goLight);
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

})();
