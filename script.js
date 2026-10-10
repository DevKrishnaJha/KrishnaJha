
/* =========================================
   KRISHNA JHA — PORTFOLIO INTERACTIONS
========================================= */

(() => {
    "use strict";

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    /* ---------- Inject animation styles ---------- */

    const style = document.createElement("style");

    style.textContent = `
        :root {
            --scroll-progress: 0%;
        }

        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: var(--scroll-progress);
            height: 3px;
            background: linear-gradient(90deg, #ffffff, #888888);
            z-index: 2000;
            pointer-events: none;
            transition: width 0.08s linear;
        }

        .navbar {
            transition:
                background 0.3s ease,
                border-color 0.3s ease,
                box-shadow 0.3s ease;
        }

        .navbar.scrolled {
            background: rgba(8, 8, 8, 0.94);
            border-bottom-color: rgba(255, 255, 255, 0.13);
            box-shadow: 0 8px 35px rgba(0, 0, 0, 0.2);
        }

        .nav-links a.active {
            color: #ffffff;
        }

        .nav-links a.active::after {
            width: 100%;
        }

        .reveal {
            opacity: 0;
            transform: translateY(32px);
            transition:
                opacity 0.75s ease,
                transform 0.75s cubic-bezier(.2,.7,.2,1);
            transition-delay: var(--reveal-delay, 0ms);
        }

        .reveal.revealed {
            opacity: 1;
            transform: translateY(0);
        }

        .game-card,
        .project {
            will-change: auto;
        }

        .game-card {
            transform-style: preserve-3d;
            backface-visibility: hidden;
        }

        .game-card .card-content {
            transition: transform 0.3s ease;
        }

        .game-card:hover .card-content {
            transform: translateZ(10px);
        }

        .btn {
            position: relative;
            overflow: hidden;
            isolation: isolate;
        }

        .btn::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(-110%);
            transition: transform 0.4s ease;
            z-index: -1;
        }

        .btn:hover::before {
            transform: translateX(0);
        }

        .game-card .card-number {
            transition:
                color 0.35s ease,
                transform 0.45s ease;
        }

        .game-card:hover .card-number {
            color: rgba(255, 255, 255, 0.13);
            transform: translateY(-5px);
        }

        .hero-glow {
            pointer-events: none;
        }

        .cursor-glow {
            position: fixed;
            left: 0;
            top: 0;
            width: 280px;
            height: 280px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            opacity: 0;
            background: radial-gradient(
                circle,
                rgba(255,255,255,0.045),
                transparent 70%
            );
            transform: translate(-50%, -50%);
            transition: opacity 0.25s ease;
        }

        .menu-toggle {
            display: none;
            width: 44px;
            height: 44px;
            border: 1px solid #333;
            border-radius: 10px;
            background: #111;
            color: white;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 5px;
        }

        .menu-toggle span {
            width: 18px;
            height: 2px;
            background: currentColor;
            transition: transform 0.25s ease;
        }

        .menu-toggle[aria-expanded="true"] span:first-child {
            transform: translateY(3.5px) rotate(45deg);
        }

        .menu-toggle[aria-expanded="true"] span:last-child {
            transform: translateY(-3.5px) rotate(-45deg);
        }

        @media (max-width: 500px) {
            .navbar {
                height: 70px;
            }

            .menu-toggle {
                display: flex;
                position: relative;
                z-index: 1002;
            }

            .nav-links {
                display: flex !important;
                position: absolute;
                top: 70px;
                left: 0;
                right: 0;
                padding: 12px 7% 22px;
                flex-direction: column;
                gap: 0;
                background: rgba(8, 8, 8, 0.98);
                border-bottom: 1px solid #252525;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition:
                    opacity 0.25s ease,
                    transform 0.25s ease,
                    visibility 0.25s ease;
            }

            .nav-links.menu-open {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .nav-links a {
                padding: 14px 0;
                font-size: 0.95rem;
            }

            .nav-links a::after {
                bottom: 7px;
                width: 0;
            }

            .nav-links a.active::after {
                width: 35px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                scroll-behavior: auto !important;
                transition-duration: 0.01ms !important;
            }

            .reveal {
                opacity: 1;
                transform: none;
            }

            .cursor-glow {
                display: none;
            }
        }
    `;

    document.head.appendChild(style);

    /* ---------- Scroll progress ---------- */

    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    let scrollTicking = false;

    function updateScroll() {
        const scrollable =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage = scrollable > 0
            ? (window.scrollY / scrollable) * 100
            : 0;

        document.documentElement.style.setProperty(
            "--scroll-progress",
            `${Math.min(100, Math.max(0, percentage))}%`
        );

        $(".navbar")?.classList.toggle("scrolled", window.scrollY > 30);

        scrollTicking = false;
    }

    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            requestAnimationFrame(updateScroll);
            scrollTicking = true;
        }
    }, { passive: true });

    updateScroll();

    /* ---------- Scroll reveal ---------- */

    const revealTargets = $$(
        ".section-heading, .game-card, .project, .about-content"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealTargets.forEach(element => {
            element.classList.add("revealed");
        });
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        });

        revealTargets.forEach((element, index) => {
            element.classList.add("reveal");
            element.style.setProperty(
                "--reveal-delay",
                `${(index % 3) * 100}ms`
            );

            revealObserver.observe(element);
        });
    }

    /* ---------- Mobile navigation ---------- */

    const navbar = $(".navbar");
    const navLinks = $(".nav-links");

    if (navbar && navLinks) {
        const menuButton = document.createElement("button");

        menuButton.className = "menu-toggle";
        menuButton.type = "button";
        menuButton.setAttribute("aria-label", "Open navigation menu");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-controls", "portfolio-navigation");
        menuButton.innerHTML = "<span></span><span></span>";

        navLinks.id = "portfolio-navigation";
        navbar.appendChild(menuButton);

        function closeMenu() {
            navLinks.classList.remove("menu-open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
        }

        menuButton.addEventListener("click", () => {
            const isOpen =
                menuButton.getAttribute("aria-expanded") === "true";

            menuButton.setAttribute("aria-expanded", String(!isOpen));
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Open navigation menu" : "Close navigation menu"
            );

            navLinks.classList.toggle("menu-open", !isOpen);
        });

        $$("a", navLinks).forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeMenu();
        });

        document.addEventListener("click", event => {
            if (!navbar.contains(event.target)) closeMenu();
        });
    }

    /* ---------- Active navigation section ---------- */

    const navigationLinks = $$(".nav-links a[href^='#']");
    const sections = navigationLinks
        .map(link => $(link.getAttribute("href")))
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                navigationLinks.forEach(link => {
                    const active =
                        link.getAttribute("href") === `#${entry.target.id}`;

                    if (active) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }

                    link.classList.toggle("active", active);
                });
            });
        }, {
            rootMargin: "-25% 0px -60% 0px",
            threshold: 0
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    /* ---------- Subtle 3D card tilt ---------- */

    if (finePointer && !reduceMotion) {
        $$(".game-card").forEach(card => {
            card.addEventListener("pointermove", event => {
                const rect = card.getBoundingClientRect();

                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 5;
                const rotateX = (0.5 - y) * 5;

                card.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* ---------- Desktop cursor glow ---------- */

    if (finePointer && !reduceMotion) {
        const glow = document.createElement("div");

        glow.className = "cursor-glow";
        glow.setAttribute("aria-hidden", "true");
        document.body.appendChild(glow);

        let pointerFrame = null;

        window.addEventListener("pointermove", event => {
            if (pointerFrame) return;

            pointerFrame = requestAnimationFrame(() => {
                glow.style.left = `${event.clientX}px`;
                glow.style.top = `${event.clientY}px`;
                glow.style.opacity = "1";
                pointerFrame = null;
            });
        }, { passive: true });

        document.addEventListener("pointerleave", () => {
            glow.style.opacity = "0";
        });
    }

    /* ---------- Button press feedback ---------- */

    $$(".btn").forEach(button => {
        button.addEventListener("pointerdown", () => {
            if (reduceMotion) return;
            button.style.transform = "translateY(0) scale(0.97)";
        });

        const resetButton = () => {
            button.style.transform = "";
        };

        button.addEventListener("pointerup", resetButton);
        button.addEventListener("pointercancel", resetButton);
        button.addEventListener("pointerleave", resetButton);
    });

    /* ---------- Footer year ---------- */

    const footer = $("footer");

    if (footer && !$(".footer-year", footer)) {
        const year = document.createElement("span");

        year.className = "footer-year";
        year.textContent = new Date().getFullYear();
        year.style.fontSize = "0.8rem";
        year.style.opacity = "0.65";

        footer.appendChild(year);
    }

    console.log("Krishna Jha portfolio initialized.");
})();
