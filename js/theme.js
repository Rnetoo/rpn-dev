/**
 * theme.js — Dark / Light Mode
 * ─────────────────────────────────────────────────────────
 * Controla o tema da página (dark/light).
 *
 * Estratégia:
 *   1. Lê preferência do localStorage
 *   2. Fallback para prefers-color-scheme do SO
 *   3. Aplica data-theme no <html> — o CSS reage via variáveis
 *   4. Persiste a escolha no localStorage
 *   5. Atualiza aria-label e aria-pressed dos botões de toggle
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    /* ── LEITURA DE PREFERÊNCIA ─────────────────────────── */
    /**
     * getInitialTheme()
     * Determina o tema inicial na seguinte ordem de prioridade:
     *   1. Preferência salva pelo usuário (localStorage)
     *   2. Preferência do sistema operacional (prefers-color-scheme)
     *   3. Fallback: 'dark'
     *
     * @returns {'dark'|'light'}
     */
    function getInitialTheme() {
        const saved = localStorage.getItem('rpn-theme');
        if (saved === 'dark' || saved === 'light') return saved;

        // Respeita a preferência do sistema se não houver escolha manual
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }

        return 'dark';
    }

    /* ── APLICAR TEMA ───────────────────────────────────── */
    /**
     * applyTheme(theme)
     * Define data-theme no <html> — todas as variáveis CSS
     * reagem automaticamente via seletores em tokens.css.
     * Também atualiza os botões de toggle para acessibilidade.
     *
     * @param {'dark'|'light'} theme
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Atualiza todos os botões de toggle (desktop + mobile)
        document.querySelectorAll('#theme-toggle, #theme-toggle-mobile')
            .forEach(function (btn) {
                const isLight = theme === 'light';

                // aria-pressed indica o estado atual para screen readers
                btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');

                // aria-label descreve a AÇÃO que o botão executará
                btn.setAttribute(
                    'aria-label',
                    isLight ? 'Ativar modo escuro' : 'Ativar modo claro'
                );
            });
    }

    /* ── TOGGLE ─────────────────────────────────────────── */
    /**
     * toggleTheme()
     * Alterna entre dark e light, persiste no localStorage
     * e atualiza a interface.
     */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';

        localStorage.setItem('rpn-theme', next);
        applyTheme(next);
    }

    /* ── INICIALIZAÇÃO ──────────────────────────────────── */
    /**
     * Aplica o tema inicial imediatamente (antes do DOMContentLoaded)
     * para evitar flash de tema incorreto ao carregar a página.
     *
     * O HTML já tem data-theme="dark" como fallback — aqui sobrescrevemos
     * com a preferência real do usuário assim que o script executa.
     */
    applyTheme(getInitialTheme());

    /**
     * Vincula os botões de toggle após o DOM estar pronto.
     */
    document.addEventListener('DOMContentLoaded', function () {

        document.querySelectorAll('#theme-toggle, #theme-toggle-mobile')
            .forEach(function (btn) {
                btn.addEventListener('click', toggleTheme);
            });

        // Atualiza aria-labels com o tema corrente
        applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

        /**
         * Ouve mudanças na preferência do sistema em tempo real.
         * Se o usuário não tiver uma preferência salva, o tema
         * acompanha automaticamente a mudança do SO.
         */
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: light)')
                .addEventListener('change', function (e) {
                    // Só aplica se não houver preferência manual
                    if (!localStorage.getItem('rpn-theme')) {
                        applyTheme(e.matches ? 'light' : 'dark');
                    }
                });
        }
    });

    // Expõe para uso externo
    window.rpnTheme = {
        get: function () { return document.documentElement.getAttribute('data-theme'); },
        toggle: toggleTheme,
    };

})();
