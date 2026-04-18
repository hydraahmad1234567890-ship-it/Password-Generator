/**
 * UTILITY: Toast Notification System
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-x-full glass border-l-4 ${
        type === 'success' ? 'border-primary-500' : 'border-red-500'
    }`;
    toast.innerHTML = `<span class="text-sm font-medium dark:text-white">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-x-full'), 10);
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * UTILITY: Copy to Clipboard
 */
function copyToClipboard(id, msg) {
    const el = document.getElementById(id);
    if (!el || !el.value) return;
    el.select();
    document.execCommand('copy');
    showToast(msg);
}
