/**
 * nav.js — Navegação
 * ─────────────────────────────────────────────────────────
 * Controla:
 *   1. Navbar: adiciona .scrolled ao rolar para ativar sombra
 *   2. Menu mobile: abre/fecha com animação e foco gerenciado
 *   3. Smooth scroll: ancora clicada → scroll suave via JS
 *   4. Foco: ao fechar o menu, retorna foco ao botão hamburguer
 *   5. Escape: fecha o menu ao pressionar ESC
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        /* ── ELEMENTOS ────────────────────────────────── */
        const navbar   = document.getElementById('navbar');
        const menuBtn  = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        /* ── 1. NAVBAR SCROLL ─────────────────────────── */
        /**
         * Adiciona a classe .scrolled à navbar quando a página
         * rola mais de 60px. O CSS usa isso para ativar a sombra.
         * passive: true garante que o scroll não seja bloqueado.
         */
        if (navbar) {
            function handleScroll() {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
            }

            window.addEventListener('scroll', handleScroll, { passive: true });

            // Verifica o estado inicial (caso a página já comece rolada)
            handleScroll();
        }

        /* ── 2. MENU MOBILE ───────────────────────────── */
        /**
         * isOpen: rastreia o estado do menu para evitar ler o DOM
         * a cada interação.
         */
        let isOpen = false;

        /**
         * openMenu()
         * Abre o menu mobile.
         * Atualiza ARIA, adiciona a classe .open e move o foco
         * para o primeiro link dentro do menu.
         */
        function openMenu() {
            isOpen = true;
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            menuBtn.setAttribute('aria-expanded', 'true');
            menuBtn.classList.add('open');

            // Impede rolagem do body quando o menu está aberto
            document.body.style.overflow = 'hidden';

            // Move o foco para o primeiro link (acessibilidade)
            const firstLink = mobileMenu.querySelector('a');
            if (firstLink) {
                setTimeout(function () { firstLink.focus(); }, 100);
            }
        }

        /**
         * closeMenu()
         * Fecha o menu mobile.
         * Retorna o foco ao botão hamburguer (acessibilidade).
         */
        function closeMenu() {
            isOpen = false;
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.classList.remove('open');

            // Restaura rolagem do body
            document.body.style.overflow = '';

            // Retorna foco ao botão que abriu o menu
            if (menuBtn) menuBtn.focus();
        }

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', function () {
                isOpen ? closeMenu() : openMenu();
            });

            // Fecha ao pressionar ESC
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && isOpen) {
                    closeMenu();
                }
            });
        }

        /* ── 3. SMOOTH SCROLL ─────────────────────────── */
        /**
         * Intercepta cliques em links de âncora (#section)
         * e aplica scrollIntoView com behavior: 'smooth'.
         *
         * Motivo para fazer via JS (não via CSS scroll-behavior):
         * CSS smooth scroll + mousewheel inertia causa tremor.
         * O JS respeita prefers-reduced-motion manualmente.
         */
        const prefersReduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        document.addEventListener('click', function (e) {
            // Sobe na árvore DOM para encontrar o <a> mais próximo
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            // Fecha o menu mobile se estiver aberto
            if (isOpen) closeMenu();

            // Scroll suave (ou imediato se reduced motion)
            target.scrollIntoView({
                behavior: prefersReduced ? 'auto' : 'smooth',
                block: 'start',
            });

            // Atualiza a URL sem criar novo item no histórico
            history.replaceState(null, '', href);

            // Move o foco para a seção alvo (acessibilidade com teclado)
            // tabIndex=-1 temporário para permitir foco programático
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            target.addEventListener('blur', function () {
                target.removeAttribute('tabindex');
            }, { once: true });
        });

        /* ── 4. FECHAR MENU AO CLICAR FORA ───────────── */
        /**
         * Fecha o menu mobile ao clicar em qualquer lugar
         * fora do menu e do botão hamburguer.
         */
        document.addEventListener('click', function (e) {
            if (!isOpen) return;
            if (mobileMenu && mobileMenu.contains(e.target)) return;
            if (menuBtn && menuBtn.contains(e.target)) return;
            closeMenu();
        });

        /* ── 5. FECHAR MENU AO REDIMENSIONAR ─────────── */
        /**
         * Se o usuário redimensionar a janela para desktop
         * enquanto o menu está aberto, fecha automaticamente.
         */
        window.addEventListener('resize', function () {
            if (isOpen && window.innerWidth > 900) {
                closeMenu();
            }
        }, { passive: true });

        /* ── Back to top ─────────────────────────── */
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 400) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }, { passive: true });
        }

    }); // DOMContentLoaded

})();