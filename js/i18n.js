/**
 * i18n.js — Sistema de internacionalização PT/EN
 * ─────────────────────────────────────────────────────────
 * Controla a troca de idioma sem recarregar a página.
 *
 * Estratégia:
 *   1. Strings de tradução em objeto JS (evita fetch/JSON)
 *   2. Elementos com data-i18n="chave" são atualizados
 *   3. Elementos com data-i18n-placeholder="chave" têm
 *      o placeholder atualizado
 *   4. Idioma persiste em localStorage
 *   5. html[data-lang] atualiza o CSS da lang toggle
 * ─────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    /* ── DICIONÁRIO ─────────────────────────────────────── */
    /**
     * Objeto com todas as strings traduzidas.
     * Cada chave mapeia para { pt: '...', en: '...' }.
     * Adicionar novas strings aqui e usar data-i18n="chave" no HTML.
     */
    const STRINGS = {
        'skip':                     { pt: 'Pular para o conteúdo',           en: 'Skip to content' },

        // Navbar
        'nav.about':                { pt: 'Sobre',       en: 'About' },
        'nav.projects':             { pt: 'Projetos',    en: 'Projects' },
        'nav.skills':               { pt: 'Skills',      en: 'Skills' },
        'nav.experience':           { pt: 'Experiência', en: 'Experience' },
        'nav.education':            { pt: 'Formação',    en: 'Education' },
        'nav.blog':                 { pt: 'Blog',        en: 'Blog' },
        'nav.contact':              { pt: 'Contato',     en: 'Contact' },

        // Hero
        'hero.status':              { pt: 'Disponível para projetos',                          en: 'Available for projects' },
        'hero.role.prefix':         { pt: 'Front-End Developer &',                             en: 'Front-End Developer &' },
        'hero.tagline':             { pt: 'Desenvolvo com React, JavaScript e CSS. Trago junto um olhar treinado em composição, proporção e hierarquia visual — e a disciplina de quem documenta, planeja e entrega.', en: 'I build with React, JavaScript and CSS. I bring along an eye trained in composition, proportion and visual hierarchy — and the discipline of someone who documents, plans and delivers.' },
        'hero.cta.projects':        { pt: 'Ver Projetos',  en: 'View Projects' },
        'hero.cta.cv':              { pt: 'Download CV',   en: 'Download CV' },
        'hero.card.projects':       { pt: 'Projetos',      en: 'Projects' },

        // Sobre
        'about.eyebrow':            { pt: 'Sobre mim',         en: 'About me' },
        'about.title.line1':        { pt: 'Multidisciplinar',  en: 'Multidisciplinary' },
        'about.title.line2':        { pt: 'por escolha.',      en: 'by choice.' },
        'about.lead':               { pt: 'Sou desenvolvedor front-end com formação em design e trajetória multidisciplinar. Escrevo código limpo, penso em componentes e me preocupo com o que o usuário sente ao interagir com uma interface.', en: 'I am a front-end developer with a design background and a multidisciplinary career. I write clean code, think in components and care about what the user feels when interacting with an interface.' },
        'about.body':               { pt: 'Minha formação em design me deu algo difícil de aprender no código: o olhar. A capacidade de perceber o que está fora de proporção, o que compete pela atenção, o que precisa de espaço para respirar. Isso se traduz diretamente em como estruturo layouts, escolho tipografia e tomo decisões de motion. No front-end, componentizar uma interface faz todo sentido para mim — é como montar um ambiente com peças que precisam ser coerentes entre si. Stack principal: React, JavaScript, Python e SQL.', en: 'My design background gave me something hard to learn from code: the eye. The ability to notice what is out of proportion, what competes for attention, what needs space to breathe. This translates directly into how I structure layouts, choose typography and make motion decisions. In front-end, componentizing an interface makes total sense to me — it is like assembling an environment with pieces that need to be coherent with each other. Main stack: React, JavaScript, Python and SQL.' },
        'about.quote':              { pt: '"Forma e função nunca se separam — no design de interiores aprendi isso com espaços. No front-end, aplico com código."', en: '"Form and function never separate — in interior design I learned this with spaces. In front-end, I apply it with code."' },
        'about.stat.projects':      { pt: 'Projetos publicados',               en: 'Published projects' },
        'about.stat.years':         { pt: 'Anos de experiência profissional',  en: 'Years of professional experience' },

        // Projetos
        'projects.eyebrow':         { pt: 'Portfólio',          en: 'Portfolio' },
        'projects.title.line1':     { pt: 'Trabalhos',          en: 'Selected' },
        'projects.title.line2':     { pt: 'selecionados.',      en: 'work.' },
        'projects.live':            { pt: 'Live',               en: 'Live' },
        'projects.preview':         { pt: 'Preview',            en: 'Preview' },
        'projects.viewlive':        { pt: 'Ver ao vivo',        en: 'View live' },
        'projects.github':          { pt: 'Ver todos no GitHub', en: 'View all on GitHub' },
        'projects.p1.title':        { pt: 'Dashboard de Qualidade da Água',    en: 'Water Quality Dashboard' },
        'projects.p1.desc':         { pt: 'Dashboard interativo para monitoramento de parâmetros físico-químicos. Dados reais, visualização clara e deploy público.', en: 'Interactive dashboard for monitoring physicochemical parameters. Real data, clear visualization and public deploy.' },
        'projects.p2.title':        { pt: 'Portfólio — Brushed Steel & Liquid Glass', en: 'Portfolio — Brushed Steel & Liquid Glass' },
        'projects.p2.desc':         { pt: 'Design system completo com motion design, acessibilidade WCAG AA e glassmorphism com aço escovado. Construído sem frameworks.', en: 'Complete design system with motion design, WCAG AA accessibility and brushed steel glassmorphism. Built without frameworks.' },
        'projects.p3.title':        { pt: 'Casa Quest',         en: 'Casa Quest' },
        'projects.p3.desc':         { pt: 'App gamificado de gestão de tarefas domésticas. Full stack com autenticação, banco relacional e gateway de pagamento.', en: 'Gamified home task management app. Full stack with authentication, relational database and payment gateway.' },

        // Skills
        'skills.eyebrow':           { pt: 'Competências',       en: 'Competencies' },
        'skills.title.line1':       { pt: 'Stack &',            en: 'Stack &' },
        'skills.title.line2':       { pt: 'especialidades.',    en: 'specialties.' },
        'skills.focus':             { pt: 'Foco técnico',       en: 'Technical focus' },
        'skills.focus.motion':      { pt: 'Animações & Motion', en: 'Animations & Motion' },
        'skills.focus.motion.desc': { pt: 'CSS transitions com intenção — cada movimento comunica, nenhum é decorativo.', en: 'CSS transitions with intention — every movement communicates, none is decorative.' },
        'skills.focus.a11y':        { pt: 'Acessibilidade (a11y)', en: 'Accessibility (a11y)' },
        'skills.focus.a11y.desc':   { pt: 'Interfaces para todos, não para a maioria. WCAG AA como piso, não teto.', en: 'Interfaces for everyone, not for the majority. WCAG AA as a floor, not a ceiling.' },
        'skills.focus.ds':          { pt: 'Design Systems',     en: 'Design Systems' },
        'skills.focus.ds.desc':     { pt: 'Componentes como peças de um ambiente: reutilizáveis, coerentes, escaláveis.', en: 'Components like pieces of a space: reusable, coherent, scalable.' },
        'skills.focus.perf':        { pt: 'Performance',        en: 'Performance' },
        'skills.focus.perf.desc':   { pt: 'Interface rápida é interface respeitosa — Core Web Vitals como critério de qualidade.', en: 'A fast interface is a respectful interface — Core Web Vitals as a quality standard.' },

        // Experiência
        'exp.eyebrow':              { pt: 'Trajetória',         en: 'Journey' },
        'exp.showMore':             { pt: 'Ver experiências anteriores', en: 'See previous experience' },
        'exp.title.line1':          { pt: 'Experiência',        en: 'Professional' },
        'exp.title.line2':          { pt: 'profissional.',      en: 'experience.' },
        'exp.current':              { pt: '● Atual',            en: '● Current' },
        // About stats
        'about.stat.start':         { pt: 'Início no front-end',      en: 'Started front-end' },
        'about.stat.background':    { pt: 'Formação de base',          en: 'Core background' },
        'about.stat.ai':            { pt: 'No fluxo de trabalho',      en: 'In the workflow' },

        // Experiência — Web Design (e0)
        'exp.e0.role':              { pt: 'Web Design & Desenvolvimento Front-End', en: 'Web Design & Front-End Development' },
        'exp.e0.desc':              { pt: 'Desenvolvimento de interfaces web com foco em experiência do usuário, acessibilidade e motion design. Construção de páginas e componentes com HTML, CSS e JavaScript — aplicando na prática os fundamentos de engenharia de software estudados no curso de ADS. Cada projeto é uma oportunidade de fechar o ciclo entre o olhar do design e a precisão do código.', en: 'Web interface development focused on user experience, accessibility and motion design. Building pages and components with HTML, CSS and JavaScript — applying in practice the software engineering fundamentals studied in the ADS program. Each project is an opportunity to close the loop between the designer\'s eye and the precision of code.' },


        'exp.e1.role':              { pt: 'Designer de Interiores', en: 'Interior Designer' },
        'exp.e1.company':           { pt: 'Autônomo · Remoto/Híbrido', en: 'Freelance · Remote/Hybrid' },
        'exp.e1.desc':              { pt: 'Projetos residenciais e comerciais do conceito à entrega. Modelagem 3D de móveis e layouts, renderização fotorrealista com Lumion e V-Ray, documentação técnica em CAD. Cada projeto começa com escuta — e termina com um ambiente que parece inevitável.', en: 'Residential and commercial projects from concept to delivery. 3D modeling of furniture and layouts, photorealistic rendering with Lumion and V-Ray, technical documentation in CAD. Every project starts with listening — and ends with a space that feels inevitable.' },
        'exp.e2.role':              { pt: 'Operação e Gestão de Processos', en: 'Operations & Process Management' },
        'exp.e2.desc':              { pt: 'Gestão de operação em ambiente de alta demanda. Padronização de processos, controle de insumos e qualidade. Aprendi que um sistema bem projetado — seja um fluxo de trabalho ou um componente React — precisa funcionar sem depender de improviso.', en: 'Operations management in a high-demand environment. Process standardization, input and quality control. I learned that a well-designed system — whether a workflow or a React component — needs to work without relying on improvisation.' },
        'exp.e3.role':              { pt: 'Técnico de Laboratório', en: 'Laboratory Technician' },
        'exp.e3.desc':              { pt: 'Ensaios físico-químicos e controle de qualidade da água. Precisão analítica, registro de dados e atenção a padrões — habilidades que hoje se traduzem em código legível, testes e documentação.', en: 'Physicochemical assays and water quality control. Analytical precision, data recording and attention to standards — skills that today translate into readable code, testing and documentation.' },
        'exp.e4.role':              { pt: 'Coordenador de ETA e ETE', en: 'WTP & WWTP Coordinator' },
        'exp.e4.desc':              { pt: 'Coordenação de tratamento de água e efluentes, controle de dosagem química e elaboração de relatórios técnicos. Gestão de processos críticos com margem mínima para erro — formação que moldou minha disciplina de processo e atenção a consequências.', en: 'Coordination of water and effluent treatment, chemical dosage control and technical report writing. Management of critical processes with minimal margin for error — training that shaped my process discipline and attention to consequences.' },
        'exp.tag.std':              { pt: 'Padronização',       en: 'Standardization' },
        'exp.tag.stock':            { pt: 'Gestão de Estoque',  en: 'Stock Management' },

        // Educação
        'edu.eyebrow':              { pt: 'Educação',           en: 'Education' },
        'edu.title.line1':          { pt: 'Formação',           en: 'Academic' },
        'edu.title.line2':          { pt: 'acadêmica.',         en: 'background.' },
        'edu.ongoing':              { pt: 'Em andamento',       en: 'Ongoing' },
        'edu.e1.degree':            { pt: 'Análise e Desenvolvimento de Sistemas', en: 'Systems Analysis and Development' },
        'edu.e1.desc':              { pt: 'A fundamentação técnica que fecha o ciclo: algoritmos, banco de dados, engenharia de software. Complementa na teoria o que já pratico no código.', en: 'The technical foundation that closes the loop: algorithms, databases, software engineering. Complements in theory what I already practice in code.' },
        'edu.e2.degree':            { pt: 'Tecnólogo em Design de Interiores', en: 'Interior Design Technologist' },
        'edu.e2.desc':              { pt: 'Onde o olhar foi formado. Composição, proporção, desenho técnico e modelagem 3D — a base visual que carrego para cada interface que construo.', en: 'Where the eye was formed. Composition, proportion, technical drawing and 3D modeling — the visual foundation I carry into every interface I build.' },
        'edu.e3.degree':            { pt: 'Técnico em Meio Ambiente', en: 'Environmental Technician' },
        'edu.e3.desc':              { pt: 'Gestão ambiental e controle de processos. Ensinou que boas práticas não são opcionais — são a diferença entre algo que funciona e algo que dura.', en: 'Environmental management and process control. Taught me that best practices are not optional — they are the difference between something that works and something that lasts.' },

        // Blog
        'blog.eyebrow':             { pt: 'Pensamentos',        en: 'Thoughts' },
        'blog.title.line1':         { pt: 'Blog',               en: 'Blog' },
        'blog.title.line2':         { pt: '& reflexões.',        en: '& reflections.' },
        'blog.sub':                 { pt: 'Artigos sobre front-end, motion design, acessibilidade e carreira em tecnologia.', en: 'Articles about front-end, motion design, accessibility and tech careers.' },
        'blog.placeholder.title':   { pt: 'Conteúdo a caminho', en: 'Content on the way' },
        'blog.placeholder.desc':    { pt: 'Em breve vou publicar artigos sobre as tecnologias que uso, decisões de design e aprendizados do dia a dia como desenvolvedor.', en: 'Soon I will publish articles about the technologies I use, design decisions and daily learnings as a developer.' },
        'blog.follow':              { pt: 'Seguir no GitHub',   en: 'Follow on GitHub' },

        // Contato
        'contact.eyebrow':          { pt: 'Contato',            en: 'Contact' },
        'contact.title.line1':      { pt: 'Vamos',              en: "Let's" },
        'contact.title.line2':      { pt: 'conversar.',         en: 'talk.' },
        'contact.intro':            { pt: 'Aberto a oportunidades CLT, projetos freelance e boas conversas sobre tecnologia.', en: 'Open to CLT positions, freelance projects and good conversations about technology.' },
        'contact.form.name':        { pt: 'Nome',               en: 'Name' },
        'contact.form.name.ph':     { pt: 'Seu nome completo',  en: 'Your full name' },
        'contact.form.message':     { pt: 'Mensagem',           en: 'Message' },
        'contact.form.message.ph':  { pt: 'Sua mensagem…',      en: 'Your message…' },
        'contact.form.send':        { pt: 'Enviar Mensagem',    en: 'Send Message' },
    };

    /* ── FRASES DO TYPING ───────────────────────────────── */
    /**
     * Frases exibidas no efeito de digitação do hero.
     * São separadas do dicionário para facilitar a animação
     * no typing.js sem depender de lookup por chave.
     */
    window.TYPING_PHRASES = {
        pt: [
            'Motion Designer',
            'Especialista em a11y',
            'Design System Builder',
            'React Developer',
        ],
        en: [
            'Motion Designer',
            'a11y Specialist',
            'Design System Builder',
            'React Developer',
        ],
    };

    /* ── ESTADO ─────────────────────────────────────────── */
    /**
     * Lê o idioma salvo no localStorage.
     * Fallback para 'pt' se não houver preferência salva.
     */
    let currentLang = localStorage.getItem('rpn-lang') || 'pt';

    /* ── APLICAR TRADUÇÃO ───────────────────────────────── */
    /**
     * applyTranslation(lang)
     * Percorre todos os elementos com data-i18n e substitui
     * o textContent pela string traduzida.
     * Também atualiza placeholders de inputs.
     *
     * @param {string} lang — 'pt' ou 'en'
     */
    function applyTranslation(lang) {
        // Atualiza o atributo data-lang no html para controlar CSS
        document.documentElement.setAttribute('data-lang', lang);
        document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');

        // Atualiza todos os elementos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            const str = STRINGS[key];
            if (str && str[lang]) {
                el.textContent = str[lang];
            }
        });

        // Atualiza placeholders de inputs e textareas
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            const key = el.getAttribute('data-i18n-placeholder');
            const str = STRINGS[key];
            if (str && str[lang]) {
                el.placeholder = str[lang];
            }
        });

        // Atualiza o aria-label dos botões de toggle
        const langBtns = document.querySelectorAll('#lang-toggle, #lang-toggle-mobile');
        langBtns.forEach(function (btn) {
            btn.setAttribute(
                'aria-label',
                lang === 'pt' ? 'Switch language to English' : 'Mudar idioma para Português'
            );
            btn.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
        });

        // Atualiza o tagline do hero (tem \n que deve virar espaço)
        const taglineEl = document.querySelector('.hero-tagline');
        if (taglineEl && STRINGS['hero.tagline']) {
            taglineEl.textContent = STRINGS['hero.tagline'][lang];
        }

        currentLang = lang;
    }

    /* ── TOGGLE ─────────────────────────────────────────── */
    /**
     * toggleLang()
     * Alterna entre PT e EN, salva no localStorage e
     * dispara evento customizado para o typing.js resetar.
     */
    function toggleLang() {
        const next = currentLang === 'pt' ? 'en' : 'pt';
        localStorage.setItem('rpn-lang', next);
        applyTranslation(next);

        // Notifica outros módulos (ex: typing.js) sobre a mudança
        window.dispatchEvent(new CustomEvent('langChange', { detail: { lang: next } }));
    }

    /* ── INICIALIZAÇÃO ──────────────────────────────────── */
    /**
     * Aguarda o DOM estar pronto antes de aplicar traduções.
     * Isso evita tentar selecionar elementos antes de existirem.
     */
    document.addEventListener('DOMContentLoaded', function () {
        // Aplica a tradução inicial
        applyTranslation(currentLang);

        // Vincula o toggle nos dois botões (desktop + mobile)
        document.querySelectorAll('#lang-toggle, #lang-toggle-mobile')
            .forEach(function (btn) {
                btn.addEventListener('click', toggleLang);
            });
    });

    // Expõe para uso externo (ex: typing.js precisa do lang atual)
    window.i18n = {
        getLang: function () { return currentLang; },
        getString: function (key) {
            const str = STRINGS[key];
            return str ? str[currentLang] : key;
        },
    };

})();