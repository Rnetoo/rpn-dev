/**
 * cursor.js — Cursor personalizado
 * ─────────────────────────────────────────────────────────
 * Cria um cursor de dois elementos:
 *   • dot:  ponto pequeno que segue o mouse exatamente
 *   • ring: anel maior que segue com delay (lerp)
 *
 * Estados contextuais:
 *   • is-hovering: sobre links e botões → ring expande
 *   • is-card: sobre cards → ring fica semitransparente
 *
 * Técnica de interpolação (lerp):
 *   posição_atual += (alvo - posição_atual) × fator
 *   Com fator 0.12: o ring percorre 12% do caminho restante
 *   a cada frame, criando a sensação de "inércia".
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    /* ── DETECÇÃO DE SUPORTE ────────────────────────────── */
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ── INICIALIZA APÓS O DOM ESTAR PRONTO ─────────────── */
    // Necessário porque o script tem defer mas os getElementById
    // precisam encontrar os elementos já no DOM
    document.addEventListener('DOMContentLoaded', function () {

        /* ── ELEMENTOS ──────────────────────────────────── */
        const dot  = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        if (!dot || !ring) return;

        /* ── ESTADO ─────────────────────────────────────── */
        const pos    = { x: -100, y: -100 };
        const target = { x: -100, y: -100 };
        let raf      = null;

        const LERP_FACTOR = 0.12;

        /* ── ESCONDER CURSOR NATIVO ─────────────────────── */
        // Feito aqui (não só no CSS) para garantir que seja aplicado
        // mesmo se o :has() não tiver suporte total
        document.documentElement.style.cursor = 'none';

        /* ── ATUALIZAÇÃO DO MOUSE ───────────────────────── */
        document.addEventListener('mousemove', function (e) {
            target.x = e.clientX;
            target.y = e.clientY;

            dot.style.left = target.x + 'px';
            dot.style.top  = target.y + 'px';
        }, { passive: true });

        /* ── LOOP DE ANIMAÇÃO (lerp) ────────────────────── */
        function animateRing() {
            pos.x += (target.x - pos.x) * LERP_FACTOR;
            pos.y += (target.y - pos.y) * LERP_FACTOR;

            ring.style.left = pos.x + 'px';
            ring.style.top  = pos.y + 'px';

            raf = requestAnimationFrame(animateRing);
        }
        raf = requestAnimationFrame(animateRing);

        /* ── ESTADOS CONTEXTUAIS ────────────────────────── */
        const HOVER_SELECTOR = 'a, button, [role="button"], label';
        const CARD_SELECTOR  = '.project-card, .edu-card, .skill-group, .tl-card';

        document.addEventListener('mouseover', function (e) {
            if (e.target.closest(CARD_SELECTOR)) {
                ring.classList.remove('is-hovering');
                ring.classList.add('is-card');
            } else if (e.target.closest(HOVER_SELECTOR)) {
                ring.classList.remove('is-card');
                ring.classList.add('is-hovering');
            }
        });

        document.addEventListener('mouseout', function (e) {
            const related = e.relatedTarget;
            if (!related || (!related.closest(CARD_SELECTOR) && !related.closest(HOVER_SELECTOR))) {
                ring.classList.remove('is-hovering', 'is-card');
            }
        });

        /* ── OCULTAR AO SAIR DA JANELA ──────────────────── */
        document.addEventListener('mouseleave', function () {
            dot.style.opacity  = '0';
            ring.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function () {
            dot.style.opacity  = '1';
            ring.style.opacity = '1';
        });

        /* ── CLIQUE ─────────────────────────────────────── */
        document.addEventListener('mousedown', function () {
            dot.style.transform = 'translate(-50%, -50%) scale(2)';
            dot.style.opacity   = '0.6';
        });
        document.addEventListener('mouseup', function () {
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
            dot.style.opacity   = '1';
        });

    }); // DOMContentLoaded

})();