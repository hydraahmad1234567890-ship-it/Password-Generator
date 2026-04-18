/**
 * GLOBAL: Theme Toggle Logic
 */
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('theme-icon-light');
const moonIcon = document.getElementById('theme-icon-dark');
const html = document.documentElement;

function applyTheme(theme) {
    if (theme === 'dark') {
        html.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        html.classList.remove('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
    localStorage.setItem('theme', theme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = html.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
    });
}

function initCopyButtons() {
    const actions = [
        { id: 'copy-pw', target: 'pw-output', msg: 'Password copied!' },
        { id: 'copy-aes-key', target: 'aes-key', msg: 'Key copied!' },
        { id: 'copy-aes-output', target: 'aes-output', msg: 'Output copied!' },
        { id: 'copy-cipher-output', target: 'cipher-output', msg: 'Result copied!' }
    ];

    actions.forEach(({ id, target, msg }) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => copyToClipboard(target, msg));
        }
    });
}

/**
 * INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCopyButtons();
    initPasswordGenerator();
    initCrypto();
    initCiphers();
});
