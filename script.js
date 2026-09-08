document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SOUND EFFECT ON CLICK
       ========================================================================== */
    const clickSound = document.getElementById('clickSound');
    
    function playClickSound() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {}); // Play Audio
        }
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('button, .tab-btn, .btn-icon, li, .tool-btn')) {
            playClickSound();
            createRipple(e);
        }
    });

    /* ==========================================================================
       2. RIPPLE EFFECT
       ========================================================================== */
    function createRipple(event) {
        const target = event.target.closest('.ripple-btn, .btn-icon, .tab-btn');
        if (!target) return;

        const circle = document.createElement('span');
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        const rect = target.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const existingRipple = target.querySelector('.ripple');
        if (existingRipple) existingRipple.remove();

        target.appendChild(circle);
    }

    /* ==========================================================================
       3. MAGNETIC BUTTONS
       ========================================================================== */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    /* ==========================================================================
       4. TEXT SCRAMBLE EFFECT
       ========================================================================== */
    const scrambleEl = document.querySelector('.scramble-text');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    function scrambleText(element) {
        let iterations = 0;
        const originalText = element.dataset.value;
        
        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((letter, index) => {
                    if (index < iterations) return originalText[index];
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join('');

            if (iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    }

    if (scrambleEl) {
        scrambleEl.addEventListener('mouseover', () => scrambleText(scrambleEl));
    }

    /* ==========================================================================
       5. DARK / LIGHT MODE TOGGLE
       ========================================================================== */
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);

    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    }

    /* ==========================================================================
       6. PAGE & TAB TRANSITIONS
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const editorSections = document.querySelectorAll('.editor-section');
    const pageTransition = document.getElementById('pageTransition');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Trigger Transition animation
            pageTransition.classList.add('active');

            setTimeout(() => {
                tabBtns.forEach(b => b.classList.remove('active'));
                editorSections.forEach(s => s.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');

                pageTransition.classList.remove('active');
            }, 300);
        });
    });

    /* ==========================================================================
       7. CODEPEN-LIKE LIVE EDITOR ENGINE
       ========================================================================== */
    const htmlCode = document.getElementById('htmlCode');
    const cssCode = document.getElementById('cssCode');
    const jsCode = document.getElementById('jsCode');
    const livePreview = document.getElementById('livePreview');
    const refreshPreview = document.getElementById('refreshPreview');
    const mainActionBtn = document.getElementById('mainActionBtn');

    function updatePreview() {
        const previewDoc = livePreview.contentDocument || livePreview.contentWindow.document;
        previewDoc.open();
        previewDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>${cssCode.value}</style>
            </head>
            <body>
                ${htmlCode.value}
                <script>${jsCode.value}<\/script>
            </body>
            </html>
        `);
        previewDoc.close();
    }

    // Auto-update preview on typing
    [htmlCode, cssCode, jsCode].forEach(input => {
        input.addEventListener('keyup', updatePreview);
    });

    refreshPreview.addEventListener('click', updatePreview);
    mainActionBtn.addEventListener('click', () => {
        updatePreview();
        triggerConfetti();
    });

    // Initial run
    updatePreview();

    /* ==========================================================================
       8. IMPORT CUSTOM FONT
       ========================================================================== */
    const fontUpload = document.getElementById('fontUpload');
    const activeFontName = document.getElementById('activeFontName');

    fontUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const fontName = 'CustomUserFont';
                const newFont = new FontFace(fontName, event.target.result);
                newFont.load().then((loadedFont) => {
                    document.fonts.add(loadedFont);
                    document.documentElement.style.setProperty('--font-family', `'${fontName}', sans-serif`);
                    activeFontName.innerText = `Loaded: ${file.name}`;
                    alert(`Font "${file.name}" berhasil diimport & diterapkan!`);
                });
            };
            reader.readAsArrayBuffer(file);
        }
    });

    /* ==========================================================================
       9. COMMAND PALETTE (CTRL + K)
       ========================================================================== */
    const commandPalette = document.getElementById('commandPalette');
    const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');

    function toggleCommandPalette() {
        commandPalette.classList.toggle('active');
    }

    cmdPaletteBtn.addEventListener('click', toggleCommandPalette);

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleCommandPalette();
        }
        if (e.key === 'Escape' && commandPalette.classList.contains('active')) {
            commandPalette.classList.remove('active');
        }
    });

    // Action execution inside palette
    document.querySelectorAll('#paletteResults li').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            toggleCommandPalette();

            if (action === 'toggle-mode') toggleTheme();
            if (action === 'run-code') updatePreview();
            if (action === 'import-font') fontUpload.click();
            if (action === 'confetti') triggerConfetti();
            if (action === 'export-video') alert('Meng-export project motion ke format MP4/GIF...');
        });
    });

    /* ==========================================================================
       10. CONFETTI BURST EFFECT
       ========================================================================== */
    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0072ff', '#00d2ff', '#ffffff']
            });
        }
    }
});
