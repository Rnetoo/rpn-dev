/**
 * form.js — Formulário de contato
 * ─────────────────────────────────────────────────────────
 * Controla:
 *   1. Validação de campos em tempo real (blur)
 *   2. Envio assíncrono via Fetch para o Formspree
 *   3. Feedback visual de sucesso/erro
 *   4. Acessibilidade: aria-invalid, aria-describedby, live regions
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const form     = document.getElementById('contact-form');
        const submitBtn = form ? form.querySelector('.btn-submit') : null;
        if (!form || !submitBtn) return;

        /* ── MENSAGENS DE ERRO ──────────────────────────── */
        const ERRORS = {
            pt: {
                nome:     'Por favor, informe seu nome.',
                email:    'Por favor, informe um e-mail válido.',
                mensagem: 'Por favor, escreva sua mensagem.',
                success:  'Mensagem enviada! Responderei em breve.',
                fail:     'Erro ao enviar. Tente novamente ou envie por e-mail.',
            },
            en: {
                nome:     'Please enter your name.',
                email:    'Please enter a valid email.',
                mensagem: 'Please write your message.',
                success:  'Message sent! I will reply soon.',
                fail:     'Send error. Try again or email me directly.',
            },
        };

        /**
         * getLang() — retorna o idioma atual
         */
        function getLang() {
            return window.i18n ? window.i18n.getLang() : 'pt';
        }

        /* ── VALIDAÇÃO DE CAMPO ─────────────────────────── */
        /**
         * validateField(input)
         * Valida um campo e exibe a mensagem de erro.
         * Atualiza aria-invalid para screen readers.
         *
         * @param {HTMLInputElement|HTMLTextAreaElement} input
         * @returns {boolean} true se válido
         */
        function validateField(input) {
            const name  = input.name;
            const value = input.value.trim();
            const msgs  = ERRORS[getLang()] || ERRORS.pt;
            let errorMsg = '';

            if (name === 'nome' && !value) {
                errorMsg = msgs.nome;
            } else if (name === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    errorMsg = msgs.email;
                }
            } else if (name === 'mensagem' && !value) {
                errorMsg = msgs.mensagem;
            }

            // Exibe ou limpa o erro
            showFieldError(input, errorMsg);
            return !errorMsg;
        }

        /**
         * showFieldError(input, message)
         * Cria ou atualiza o elemento de erro associado ao campo.
         * Usa aria-describedby para associar o erro ao input.
         *
         * @param {HTMLElement} input
         * @param {string}      message — '' para limpar o erro
         */
        function showFieldError(input, message) {
            const errorId = input.id + '-error';
            let errorEl   = document.getElementById(errorId);

            if (message) {
                input.setAttribute('aria-invalid', 'true');
                input.setAttribute('aria-describedby', errorId);
                input.classList.add('field-error');

                // Cria o elemento de erro se não existir
                if (!errorEl) {
                    errorEl = document.createElement('span');
                    errorEl.id        = errorId;
                    errorEl.className = 'field-error-msg';
                    errorEl.setAttribute('role', 'alert');
                    input.parentNode.appendChild(errorEl);
                }
                errorEl.textContent = message;

            } else {
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
                input.classList.remove('field-error');
                if (errorEl) errorEl.remove();
            }
        }

        /* ── VALIDAÇÃO EM TEMPO REAL ────────────────────── */
        // Valida ao sair do campo (blur)
        form.querySelectorAll('input, textarea').forEach(function (input) {
            input.addEventListener('blur', function () {
                validateField(input);
            });

            // Limpa o erro enquanto digita (após primeiro blur)
            input.addEventListener('input', function () {
                if (input.getAttribute('aria-invalid') === 'true') {
                    showFieldError(input, '');
                }
            });
        });

        /* ── ESTADO DO BOTÃO ────────────────────────────── */
        /**
         * setLoading(isLoading)
         * Altera o botão de envio para estado de carregamento.
         * Desabilita o botão e muda o texto para evitar reenvios.
         */
        function setLoading(isLoading) {
            submitBtn.disabled = isLoading;
            submitBtn.classList.toggle('btn-loading', isLoading);

            const span = submitBtn.querySelector('span');
            if (span) {
                span.textContent = isLoading
                    ? (getLang() === 'pt' ? 'Enviando…' : 'Sending…')
                    : (getLang() === 'pt' ? 'Enviar Mensagem' : 'Send Message');
            }
        }

        /* ── FEEDBACK GLOBAL ────────────────────────────── */
        /**
         * showFormFeedback(type, message)
         * Exibe mensagem de sucesso ou erro no formulário.
         * Usa role="status" para leitores de tela.
         *
         * @param {'success'|'error'} type
         * @param {string}            message
         */
        function showFormFeedback(type, message) {
            let feedbackEl = document.getElementById('form-feedback');

            if (!feedbackEl) {
                feedbackEl = document.createElement('div');
                feedbackEl.id = 'form-feedback';
                feedbackEl.setAttribute('role', 'status');
                feedbackEl.setAttribute('aria-live', 'polite');
                form.parentNode.insertBefore(feedbackEl, form.nextSibling);
            }

            feedbackEl.className   = 'form-feedback form-feedback--' + type;
            feedbackEl.textContent = message;

            // Remove o feedback após 6 segundos
            setTimeout(function () {
                if (feedbackEl) feedbackEl.remove();
            }, 6000);
        }

        /* ── ENVIO ──────────────────────────────────────── */
        /**
         * Intercepta o submit para envio assíncrono.
         * Formspree aceita fetch com Content-Type: application/json.
         */
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const lang = getLang();
            const msgs = ERRORS[lang] || ERRORS.pt;

            // Valida todos os campos antes de enviar
            const inputs  = form.querySelectorAll('input[required], textarea[required]');
            let   isValid = true;

            inputs.forEach(function (input) {
                if (!validateField(input)) isValid = false;
            });

            if (!isValid) {
                // Foca no primeiro campo inválido para acessibilidade
                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            setLoading(true);

            // Monta o payload
            const data = {
                nome:     form.nome.value.trim(),
                email:    form.email.value.trim(),
                mensagem: form.mensagem.value.trim(),
            };

            try {
                const response = await fetch(form.action, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify(data),
                });

                if (response.ok) {
                    form.reset();
                    showFormFeedback('success', msgs.success);
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-loading');
                    const span = submitBtn.querySelector('span');
                    if (span) span.textContent = lang === 'pt' ? 'Enviar Mensagem' : 'Send Message';
                } else {
                    throw new Error('Response not ok: ' + response.status);
                }
            } catch (err) {
                console.error('Form submit error:', err);
                showFormFeedback('error', msgs.fail);
                setLoading(false);
            }
        });

    }); // DOMContentLoaded

})();
