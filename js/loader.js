/**
 * loader.js — Loading Screen
 * ─────────────────────────────────────────────────────────
 * Exibe uma tela de carregamento elegante enquanto os
 * recursos da página carregam.
 *
 * Características:
 *   - Injetada 100% via JS (não polui o HTML)
 *   - Logo RPN com anéis giratórios
 *   - Barra de progresso não-linear (parece mais orgânica)
 *   - Remove-se do DOM após a animação de saída
 *   - Ignorada se prefers-reduced-motion
 *   - Timeout de segurança: 5s máximo
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    /* ── VERIFICAÇÕES ───────────────────────────────────── */
    // Não exibe em prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ── INJETAR HTML ───────────────────────────────────── */
    /**
     * Cria e injeta o markup do loader no body.
     * Feito via innerHTML para ser conciso — o loader é
     * simples e não precisa de sanitização (não usa dados do usuário).
     */
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', 'Carregando página');
    loader.innerHTML = `
        <div class="loader-orb loader-orb-1" aria-hidden="true"></div>
        <div class="loader-orb loader-orb-2" aria-hidden="true"></div>

        <div class="loader-logo-wrap">
            <div class="loader-ring"        aria-hidden="true"></div>
            <div class="loader-ring loader-ring--outer" aria-hidden="true"></div>
            <img class="loader-logo-img"
                 src="assets/images/rlogo.png"
                 alt="Logo RPN"
                 width="180" height="180">
        </div>

        <p class="loader-name">Rômulo Pereira Neto</p>

        <div class="loader-bar-wrap" aria-hidden="true">
            <div class="loader-bar" id="loader-bar-fill"></div>
        </div>

        <span class="loader-pct" id="loader-pct" aria-hidden="true">0%</span>
    `;
    document.body.insertBefore(loader, document.body.firstChild);

    /* ── CONTROLE DE PROGRESSO ──────────────────────────── */
    const barFill = document.getElementById('loader-bar-fill');
    const pctEl   = document.getElementById('loader-pct');
    let   progress = 0;
    let   intervalId = null;

    /**
     * setProgress(value)
     * Atualiza a barra de progresso e o percentual textual.
     *
     * @param {number} value — 0 a 100
     */
    function setProgress(value) {
        progress = Math.min(Math.max(value, 0), 100);
        if (barFill) barFill.style.width  = progress + '%';
        if (pctEl)   pctEl.textContent    = Math.round(progress) + '%';
    }

    /**
     * Simula progresso não-linear enquanto a página carrega.
     * Fases:
     *   0–40%:  rápido   (50ms/frame → +2%)
     *   40–70%: médio    (80ms/frame → +1.2%)
     *   70–90%: lento    (120ms/frame → +0.6%)
     *   90–100%: muito lento (aguarda o evento load)
     */
    intervalId = setInterval(function () {
        if (progress < 40) {
            setProgress(progress + 2);
        } else if (progress < 70) {
            setProgress(progress + 1.2);
        } else if (progress < 90) {
            setProgress(progress + 0.5);
        } else {
            // Congela em ~92% até a página terminar de carregar
            clearInterval(intervalId);
        }
    }, 60);

    /* ── SAÍDA ──────────────────────────────────────────── */
    /**
     * exitLoader()
     * Completa a barra para 100%, aguarda 400ms para o usuário
     * ver o 100%, e então dispara a animação de saída.
     * Remove o loader do DOM após a transição para liberar memória.
     */
    function exitLoader() {
        clearInterval(intervalId);
        setProgress(100);

        setTimeout(function () {
            loader.classList.add('exit');

            // Remove do DOM após a transição (600ms definida no CSS)
            setTimeout(function () {
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 700);
        }, 400);
    }

    /* ── EVENTOS DE CARREGAMENTO ────────────────────────── */
    /**
     * Aguarda o evento 'load' da página (todos os recursos
     * incluindo imagens) para completar a barra.
     *
     * Timeout de segurança: 5s máximo para não bloquear
     * caso algum recurso demore demais.
     */
    const safetyTimeout = setTimeout(exitLoader, 5000);

    if (document.readyState === 'complete') {
        // Página já carregada (cache rápido)
        clearTimeout(safetyTimeout);
        exitLoader();
    } else {
        window.addEventListener('load', function () {
            clearTimeout(safetyTimeout);
            // Aguarda um mínimo de 800ms para não piscar em conexões rápidas
            const elapsed = performance.now();
            const delay   = Math.max(0, 1300 - elapsed);
            setTimeout(exitLoader, delay);
        }, { once: true });
    }

})();