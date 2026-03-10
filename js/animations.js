/**
 * animations.js — Scroll Reveal & Skill Bars
 * ─────────────────────────────────────────────────────────
 * Controla:
 *   1. Reveal de elementos ao entrar na viewport (IntersectionObserver)
 *   2. Animação das barras de habilidades ao ficarem visíveis
 *   3. Indicador de progresso de leitura na navbar
 *
 * Técnica IntersectionObserver:
 *   É mais performático que scroll events porque não bloqueia
 *   a thread principal. O browser notifica quando o elemento
 *   cruza o threshold definido.
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    /* ── PREFERE MENOS MOVIMENTO ────────────────────────── */
    /**
     * Se o usuário preferir menos movimento, marcamos todos os
     * elementos como visíveis imediatamente, sem animação.
     * O CSS reduced-motion já remove as transições — aqui
     * apenas garantimos que o conteúdo seja exibido.
     */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── REVEAL OBSERVER ────────────────────────────────── */
    /**
     * Observer para elementos .reveal e variantes.
     * Ao entrar na viewport com threshold 0.12 (12% visível),
     * adiciona a classe .visible que dispara a transição CSS.
     *
     * once: true — para observar apenas uma vez por elemento.
     * Após ficar visível, o observer é desconectado daquele
     * elemento para economizar recursos.
     */
    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,       // reduzido: 8% visível já dispara
            rootMargin: '0px',     // sem offset: evita elementos presos
        }
    );

    function initReveal() {
        const SELECTORS = [
            '.reveal',
            '.reveal-left',
            '.reveal-right',
            '.reveal-scale',
        ].join(', ');

        document.querySelectorAll(SELECTORS).forEach(function (el) {
            if (reduced) {
                el.classList.add('visible');
            } else {
                // Verifica se o elemento já está visível na carga inicial
                // (ex: hero, navbar — estão no topo sem precisar rolar)
                const rect = el.getBoundingClientRect();
                const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
                if (inViewport) {
                    // Pequeno delay para a animação de entrada ser perceptível
                    setTimeout(function () {
                        el.classList.add('visible');
                    }, 100);
                } else {
                    revealObserver.observe(el);
                }
            }
        });
    }

    /* ── SKILL BARS ─────────────────────────────────────── */
    /**
     * Observer separado para as barras de habilidades.
     * Aguarda a barra entrar na viewport antes de animar
     * a largura — cria o efeito de "preenchimento ao ver".
     *
     * O valor alvo está em data-width no elemento .skill-bar-fill.
     * Ex: <div class="skill-bar-fill" data-width="85">
     *   → largura animada de 0% para 85%
     */
    function animateBar(fill) {
        var width = fill.getAttribute('data-width') || '0';
        fill.style.width = '0%';
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                fill.style.width = width + '%';
            });
        });
    }

    function initSkillBars() {
        var fills = document.querySelectorAll('.skill-bar-fill');

        if (reduced) {
            fills.forEach(function (fill) {
                fill.style.width = (fill.getAttribute('data-width') || '0') + '%';
                fill.style.transition = 'none';
            });
            return;
        }

        // Observa o grupo pai (.skill-group) — quando ele fica visível
        // (após o reveal), aí sim anima as barras dentro dele.
        var groupObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var group = entry.target;
                        // Aguarda o reveal (transição CSS ~600ms) antes de animar
                        setTimeout(function () {
                            group.querySelectorAll('.skill-bar-fill').forEach(function (fill) {
                                animateBar(fill);
                            });
                        }, 350);
                        groupObserver.unobserve(group);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        document.querySelectorAll('.skill-group').forEach(function (group) {
            // Garante que todas as barras começam em 0
            group.querySelectorAll('.skill-bar-fill').forEach(function (fill) {
                fill.style.width = '0%';
            });
            groupObserver.observe(group);
        });
    }

    /* ── INDICADOR DE LEITURA ───────────────────────────── */
    /**
     * Barra fina no topo da página que mostra o progresso de leitura.
     * Calculada como: scrollY / (documentHeight - viewportHeight)
     *
     * Inserida dinamicamente — não polui o HTML com markup
     * que só existe quando JS está ativo.
     */
    function initReadingProgress() {
        if (reduced) return; // Sem animação para reduced motion

        const bar = document.createElement('div');
        bar.id = 'reading-progress';
        bar.setAttribute('aria-hidden', 'true');
        bar.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            height: 2px;
            width: 0%;
            background: var(--accent-grad);
            z-index: 9998;
            transition: width 0.1s linear;
            pointer-events: none;
        `;
        document.body.appendChild(bar);

        /**
         * Atualiza a largura da barra ao rolar.
         * passive: true é essencial aqui — scroll listeners lentos
         * causam jank (travadas). Com passive, o browser sabe que
         * não vamos chamar preventDefault() e pode otimizar.
         */
        window.addEventListener('scroll', function () {
            const scrollTop    = window.scrollY;
            const docHeight    = document.documentElement.scrollHeight;
            const winHeight    = window.innerHeight;
            const scrollable   = docHeight - winHeight;

            if (scrollable <= 0) return;

            const progress = (scrollTop / scrollable) * 100;
            bar.style.width = Math.min(progress, 100) + '%';
        }, { passive: true });
    }

    /* ── ACTIVE NAV LINK ────────────────────────────────── */
    /**
     * Destaca o link de navegação correspondente à seção
     * atualmente visível na viewport.
     *
     * Usa um IntersectionObserver com rootMargin negativo
     * para considerar "visível" apenas a seção no centro
     * da tela, não apenas qualquer parte dela.
     */
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;

                        // Remove .active de todos os links
                        navLinks.forEach(function (link) {
                            link.classList.remove('active');
                        });

                        // Adiciona .active ao link correspondente
                        const activeLink = document.querySelector(
                            '.nav-link[href="#' + id + '"]'
                        );
                        if (activeLink) activeLink.classList.add('active');
                    }
                });
            },
            {
                // Considera ativa a seção que ocupa o terço central da tela
                rootMargin: '-40% 0px -40% 0px',
                threshold: 0,
            }
        );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    /* ── INICIALIZAÇÃO ──────────────────────────────────── */
    /**
     * Aguarda o DOM estar pronto.
     * DOMContentLoaded é mais rápido que load — não espera
     * imagens e recursos externos carregarem.
     */
    document.addEventListener('DOMContentLoaded', function () {
        initReveal();
        initSkillBars();
        initReadingProgress();
        initActiveNav();
    });

})();