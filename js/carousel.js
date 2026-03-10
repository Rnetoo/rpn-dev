/**
 * carousel.js — Projects Carousel
 * Scroll horizontal com mouse wheel, drag e barra de progresso.
 */

document.addEventListener('DOMContentLoaded', () => {

    const carousel  = document.getElementById('projects-carousel');
    const progressBar = document.getElementById('carousel-progress-bar');
    const hint      = document.querySelector('.carousel-hint');

    if (!carousel) return;

    /* ── Barra de progresso ─────────────────────────── */
    function updateProgress() {
        const max = carousel.scrollWidth - carousel.clientWidth;
        if (max <= 0) return;
        const pct = (carousel.scrollLeft / max) * 100;
        if (progressBar) progressBar.style.width = pct + '%';

        /* Esconde a dica após primeiro scroll */
        if (hint && carousel.scrollLeft > 10) hint.classList.add('is-hidden');
    }

    carousel.addEventListener('scroll', updateProgress, { passive: true });

    /* ── Scroll horizontal com wheel ────────────────── */
    carousel.addEventListener('wheel', (e) => {
        /* Só intercepta scroll horizontal ou delta horizontal nulo */
        if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
        e.preventDefault();
        carousel.scrollLeft += e.deltaY * 1.2;
    }, { passive: false });

    /* ── Drag com mouse ─────────────────────────────── */
    let isDragging  = false;
    let startX      = 0;
    let scrollStart = 0;

    carousel.addEventListener('mousedown', (e) => {
        isDragging  = true;
        startX      = e.pageX - carousel.offsetLeft;
        scrollStart = carousel.scrollLeft;
        carousel.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x    = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.4;
        carousel.scrollLeft = scrollStart - walk;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.classList.remove('is-dragging');
    });

    /* Evita navegação ao clicar nos links após drag */
    carousel.addEventListener('click', (e) => {
        if (Math.abs(carousel.scrollLeft - scrollStart) > 5) {
            e.preventDefault();
        }
    });

    /* ── Touch — já funciona nativamente via CSS ────── */
    carousel.addEventListener('touchmove', updateProgress, { passive: true });

    /* Init */
    updateProgress();
});