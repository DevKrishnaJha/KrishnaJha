// =================================
// CRINGE GAMES
// Main JavaScript
// =================================


// Scroll Reveal
const revealElements = document.querySelectorAll(
    ".section-heading, .game-card, .project, .about-content"
);


const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("revealed");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);


revealElements.forEach((element, index) => {

    element.classList.add("reveal");

    element.style.transitionDelay = `${index * 0.08}s`;

    revealObserver.observe(element);

});