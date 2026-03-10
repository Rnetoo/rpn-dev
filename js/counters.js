/**
 * counters.js — Contadores animados
 * ─────────────────────────────────────────────────────────
 * Anima números de 0 até o valor final (data-count) quando
 * o elemento entra na viewport.
 *
 * Técnica:
 *   easing easeOut — começa rápido e desacelera no final,
 *   criando sensação de "chegada" ao valor correto.
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Sem animação: mostra valor final diretamente
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('[data-count]').forEach(function (el) {
                el.textContent = el.getAttribute('data-count');
            });
        });
        return;
    }

    /**
     * animateCounter(el, target, duration)
     * Anima um elemento numérico de 0 até target.
     *
     * @param {HTMLElement} el       — elemento a animar
     * @param {number}      target   — valor final
     * @param {number}      duration — duração em ms (padrão 1400ms)
     */
    function animateCounter(el, target, duration) {
        duration = duration || 1400;
        const start = performance.now();

        /**
         * easeOut cubic — desacelera no final.
         * t: progresso de 0 a 1
         * retorna: valor easeOut de 0 a 1
         */
        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function frame(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value    = Math.round(easeOut(progress) * target);

            el.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                el.textContent = target; // garante valor exato no final
            }
        }

        requestAnimationFrame(frame);
    }

    document.addEventListener('DOMContentLoaded', function () {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const el     = entry.target;
                        const target = parseInt(el.getAttribute('data-count'), 10);
                        if (!isNaN(target)) {
                            animateCounter(el, target);
                        }
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll('[data-count]').forEach(function (el) {
            observer.observe(el);
        });
    });

})();
