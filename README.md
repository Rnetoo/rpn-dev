# Rômulo Pereira Neto — Portfólio

**Front-End Developer** com formação em design. Interfaces acessíveis, rápidas e bem construídas com React, JavaScript e CSS.

🌐 **[rnetoo.github.io](https://rnetoo.github.io)**  &nbsp;·&nbsp;  ✉️ romulo.psnw@gmail.com  &nbsp;·&nbsp;  [LinkedIn](https://www.linkedin.com/in/romulo-pereira-de-souza-neto/)

---

## Sobre o projeto

Portfólio pessoal construído do zero — sem frameworks, sem dependências, sem build step. HTML, CSS e JavaScript puros, organizados em uma arquitetura modular clara.

O design system **Sunset Neon / Liquid Graphite** foi desenvolvido inteiramente com variáveis CSS, suportando dark e light mode de forma nativa. Todo o código foi escrito com atenção a performance, acessibilidade e motion design.

---

## Destaques técnicos

| | |
|---|---|
| **Stack** | HTML5 · CSS3 · JavaScript ES6+ |
| **Tema** | Dark / Light mode com persistência via `localStorage` |
| **i18n** | PT-BR / EN — sistema bilíngue com 80+ strings traduzidas |
| **Acessibilidade** | WCAG AA — skip link, ARIA, focus visible, reduced motion |
| **Performance** | Zero dependências, zero build, `defer` em todos os scripts |
| **Fontes** | Clash Display + Cabinet Grotesk via Fontshare |

---

## Arquitetura

```
portfolio/
├── index.html              # HTML semântico — única página
├── css/
│   ├── tokens.css          # Design tokens: cores, tipografia, espaçamento, easings
│   ├── reset.css           # Reset moderno + skip link + focus visible
│   ├── layout.css          # Container, navbar, grids de seção, responsivo
│   ├── components.css      # Componentes visuais — botões, cards, formulário…
│   ├── animations.css      # Reveal, stagger, hero entrance
│   └── theme.css           # Loading screen e utilitários de tema
├── js/
│   ├── loader.js           # Loading screen injetada via JS
│   ├── i18n.js             # Sistema bilíngue PT/EN
│   ├── theme.js            # Dark/Light mode com fallback prefers-color-scheme
│   ├── cursor.js           # Cursor customizado — dot + ring com lerp
│   ├── animations.js       # IntersectionObserver: reveal, skill bars, active nav
│   ├── typing.js           # Efeito de digitação no hero
│   ├── counters.js         # Contadores animados com easeOut cúbico
│   ├── form.js             # Validação + envio assíncrono (Formspree) + ARIA
│   ├── nav.js              # Navbar scroll, menu mobile, smooth scroll
│   └── carousel.js         # Carrossel de projetos — wheel, drag, touch
├── blog/
│   ├── wcag-no-frontend.html
│   ├── tailwind-css.html
│   └── motion-design-frontend.html
└── assets/
    ├── images/             # Logo, foto, thumbnails, OG cover
    └── docs/               # CV para download
```

---

## Funcionalidades

- **Loading screen** com barra de progresso não-linear e timeout de segurança
- **Cursor personalizado** com interpolação lerp e estados contextuais (hover, card)
- **Scroll reveal** via `IntersectionObserver` — performático, sem scroll events
- **Skill bars** animadas ao entrar na viewport
- **Efeito de digitação** no hero com variação de ritmo humano (±40ms)
- **Contadores animados** com easing easeOut cúbico via `requestAnimationFrame`
- **Carrossel de projetos** com mouse wheel, drag e barra de progresso
- **Barra de leitura** injetada via JS no topo da página
- **Formulário** com validação em tempo real, `aria-invalid` e envio via Formspree
- **Menu mobile** com foco gerenciado e fechamento por ESC

---

## Acessibilidade

Decisões implementadas para garantir WCAG AA:

- Skip link visível ao receber foco de teclado
- `aria-expanded`, `aria-hidden` e `aria-live` nos componentes interativos
- `role="progressbar"` nas skill bars com `aria-valuenow`
- Cursor customizado desabilitado em dispositivos touch (`hover: none`)
- Todas as animações respeitam `prefers-reduced-motion`
- Formulário com `aria-describedby` associando campo ao erro, foco no primeiro erro inválido

---

## Como rodar localmente

Não há build step. Basta servir os arquivos estáticos:

```bash
# VS Code: extensão Live Server → botão "Go Live"

# Python
python -m http.server 3000

# Node.js
npx serve .
```

---

## Créditos

- Fontes: [Fontshare](https://www.fontshare.com/) — Clash Display, Cabinet Grotesk
- Formulário: [Formspree](https://formspree.io/)
- Ícones: SVG inline, sem biblioteca externa

---

© 2026 Rômulo Pereira Neto RPN Front-End