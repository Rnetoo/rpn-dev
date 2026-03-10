/**
 * experience.js — Timeline expand/collapse
 * ─────────────────────────────────────────────────────────
 * Exibe apenas o primeiro item da timeline por padrão.
 * Os demais são revelados ao clicar em "Ver mais", com
 * animação de fade + slide a partir da esquerda em cascata.
 *
 * Comportamento:
 *   1. Itens 2+ ficam ocultos (opacity: 0, translateX(-16px))
 *   2. Botão "Ver mais" é injetado após o primeiro item
 *   3. Ao clicar, cada item revela com delay escalonado (100ms)
 *   4. O botão some após a expansão
 *   5. prefers-reduced-motion: revela tudo sem animação
 *
 * Nota sobre ordem de execução:
 *   O hide dos itens é feito no DOMContentLoaded com prioridade
 *   máxima (listener registrado antes do animations.js processar),
 *   e a classe .reveal é removida para que o IntersectionObserver
 *   do animations.js não sobrescreva a visibilidade.
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── HIDE ANTECIPADO ────────────────────────────────── */
    /**
     * Roda no DOMContentLoaded — mesmo evento do animations.js.
     * Por estar carregado depois (último script), o listener aqui
     * dispara após o do animations.js, mas removemos .reveal antes
     * que o observer chegue nos itens ocultos.
     *
     * Usamos requestAnimationFrame para garantir que o DOM já
     * foi pintado e o observer ainda não processou os itens.
     */
    document.addEventListener('DOMContentLoaded', function () {

        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        const items = Array.from(timeline.querySelectorAll('.tl-item'));
        if (items.length <= 1) return;

        const firstItem   = items[0];
        const hiddenItems = items.slice(1);

        if (reduced) return;

        /* ── ESCONDER ITENS ─────────────────────────────── */
        /**
         * Remove .reveal para sair do escopo do IntersectionObserver
         * do animations.js. Adiciona .tl-item--hidden para controle
         * de visibilidade via CSS (opacity + translateX).
         */
        hiddenItems.forEach(function (item) {
            item.classList.remove('reveal');
            item.classList.add('tl-item--hidden');
        });

        /* ── BOTÃO "VER MAIS" ───────────────────────────── */
        const btn = document.createElement('button');
        btn.className = 'tl-expand-btn';
        btn.type      = 'button';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'timeline-hidden');
        btn.setAttribute('data-i18n', 'exp.showMore');
        btn.innerHTML = `
            <span>Ver experiências anteriores</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="6 9 12 15 18 9"/>
            </svg>
        `;

        // Agrupa os itens ocultos num wrapper para aria-controls
        const hiddenGroup = document.createElement('div');
        hiddenGroup.id = 'timeline-hidden';
        hiddenItems.forEach(function (item) {
            hiddenGroup.appendChild(item);
        });

        // Insere: primeiro item → botão → grupo oculto
        firstItem.after(btn);
        btn.after(hiddenGroup);

        /* ── EXPANSÃO ───────────────────────────────────── */
        btn.addEventListener('click', function () {
            btn.setAttribute('aria-expanded', 'true');
            btn.classList.add('tl-expand-btn--exit');

            hiddenItems.forEach(function (item, index) {
                setTimeout(function () {
                    item.classList.remove('tl-item--hidden');
                    item.classList.add('tl-item--revealed');
                    // Delay escalonado via animation-delay
                    item.style.animationDelay = '0ms';
                }, index * 100);
            });

            // Remove o botão após a última animação terminar
            const totalDelay = (hiddenItems.length - 1) * 100 + 600;
            setTimeout(function () {
                btn.remove();
            }, totalDelay);
        });

        /* ── INTEGRAÇÃO COM i18n ────────────────────────── */
        window.addEventListener('langChange', function () {
            if (!btn.parentNode) return;
            const lang = window.i18n ? window.i18n.getLang() : 'pt';
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = lang === 'en'
                    ? 'See previous experience'
                    : 'Ver experiências anteriores';
            }
        });

    });

})();