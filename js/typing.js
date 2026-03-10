/**
 * typing.js — Efeito de digitação no hero
 * ─────────────────────────────────────────────────────────
 * Digita e apaga frases complementares ao título principal.
 * As frases vêm do i18n.js (window.TYPING_PHRASES) para
 * suportar PT/EN sem duplicar lógica.
 *
 * Algoritmo:
 *   1. Digita caractere a caractere com variação humana
 *   2. Pausa ao terminar (2s)
 *   3. Apaga mais rápido
 *   4. Pausa antes da próxima frase (400ms)
 *   5. Recomeça em loop
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Em reduced motion: mostra a primeira frase estática
        const el = document.getElementById('typing-target');
        if (el && window.TYPING_PHRASES) {
            const lang = window.i18n ? window.i18n.getLang() : 'pt';
            el.textContent = (window.TYPING_PHRASES[lang] || [])[0] || '';
        }
        return;
    }

    document.addEventListener('DOMContentLoaded', function () {
        const el = document.getElementById('typing-target');
        if (!el) return;

        let pi       = 0;       // índice da frase atual
        let ci       = 0;       // índice do caractere atual
        let deleting = false;   // estado: digitando ou apagando
        let timeoutId = null;   // id do setTimeout ativo

        /**
         * getPhrases()
         * Retorna as frases no idioma atual.
         * Chamada a cada iteração para reagir à troca de idioma.
         */
        function getPhrases() {
            const lang = window.i18n ? window.i18n.getLang() : 'pt';
            return (window.TYPING_PHRASES && window.TYPING_PHRASES[lang]) || [
                'Motion Designer',
                'React Developer',
            ];
        }

        /**
         * tick()
         * Executa um frame do efeito de digitação.
         * Agendada via setTimeout com duração variável para
         * simular o ritmo irregular de digitação humana.
         */
        function tick() {
            const phrases = getPhrases();
            const phrase  = phrases[pi % phrases.length];
            el.textContent = phrase.substring(0, ci);

            let speed;

            if (!deleting) {
                ci++;
                // Variação de ±40ms simula digitação humana
                speed = 80 + Math.random() * 40;

                if (ci > phrase.length) {
                    deleting = true;
                    speed = 2000; // pausa ao terminar de escrever
                }
            } else {
                ci--;
                speed = 38; // apaga mais rápido

                if (ci < 0) {
                    deleting = false;
                    ci = 0;
                    pi++;
                    speed = 420; // pausa antes da próxima frase
                }
            }

            timeoutId = setTimeout(tick, speed);
        }

        // Inicia após 1200ms para deixar as animações do hero terminarem
        timeoutId = setTimeout(tick, 1200);

        /**
         * Reinicia o typing quando o idioma mudar.
         * O i18n.js dispara o evento 'langChange' ao trocar.
         */
        window.addEventListener('langChange', function () {
            clearTimeout(timeoutId);
            ci = 0;
            deleting = false;
            el.textContent = '';
            timeoutId = setTimeout(tick, 300);
        });
    });

})();
