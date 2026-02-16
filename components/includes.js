(async () => {
    const fallbackTemplates = {
        "components/site-header.html": `<header class="site-header" id="top">
    <a class="brand" href="#home" aria-label="Startseite">Riad Chowdhury</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Menü öffnen">
        <span></span>
        <span></span>
        <span></span>
    </button>
    <nav class="site-nav" id="primary-nav">
        <a href="#story">Vision</a>
        <a href="#services">Leistungen</a>
        <a href="#case-studies">Case Studies</a>
        <a href="#testimonials">Kundenstimmen</a>
        <a href="#about">Über mich</a>
        <a href="#contact" class="nav-cta">Kontakt</a>
    </nav>
</header>`,
        "components/site-footer.html": `<footer class="site-footer">
    <div class="container footer-grid">
        <nav class="footer-nav" aria-label="Footer Navigation">
            <a href="#home">Start</a>
            <a href="#services">Leistungen</a>
            <a href="#case-studies">Case Studies</a>
            <a href="#testimonials">Kundenstimmen</a>
            <a href="#about">Über mich</a>
            <a href="#contact">Kontakt</a>
        </nav>
        <div class="footer-meta">
            <a href="mailto:riad-chowdhury@outlook.com">riad-chowdhury@outlook.com</a>
            <a href="impressum.html">Impressum</a>
            <a href="datenschutz.html">Datenschutz</a>
        </div>
        <p>&copy; 2026 Riad Chowdhury. Alle Rechte vorbehalten.</p>
    </div>
</footer>`
    };

    const includeNodes = Array.from(document.querySelectorAll('[data-include]'));

    await Promise.all(
        includeNodes.map(async (node) => {
            const file = node.getAttribute('data-include');
            if (!file) return;

            try {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Include konnte nicht geladen werden: ${file}`);
                node.outerHTML = await response.text();
            } catch (error) {
                const fallback = fallbackTemplates[file];
                if (fallback) {
                    node.outerHTML = fallback;
                } else {
                    console.error(error);
                }
            }
        })
    );

    const isHomePage = /\/$|\/index\.html$/.test(window.location.pathname);

    if (!isHomePage) {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            const target = link.getAttribute('href');
            if (!target || target === '#') return;
            link.setAttribute('href', `index.html${target}`);
        });

        const brand = document.querySelector('.brand');
        if (brand) brand.setAttribute('href', 'index.html#home');
    }

    const body = document.body;
    const menuButton = document.querySelector('.menu-toggle');

    menuButton?.addEventListener('click', () => {
        const expanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!expanded));
        body.classList.toggle('menu-open', !expanded);
    });

    document.querySelectorAll('.site-nav a').forEach((link) => {
        link.addEventListener('click', () => {
            body.classList.remove('menu-open');
            menuButton?.setAttribute('aria-expanded', 'false');
        });
    });

    window.componentsReady = true;
    document.dispatchEvent(new Event('components:ready'));
})();
