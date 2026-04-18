/**
 * TOOL 2: AES-GCM Encryption Logic
 */
async function generateAESKey() {
    try {
        const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const rawKey = await window.crypto.subtle.exportKey("raw", key);
        const base64Key = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
        document.getElementById('aes-key').value = base64Key;
        showToast("New 256-bit key generated!");
    } catch (err) {
        showToast("Key generation failed!", "error");
    }
}

async function getCryptoKey() {
    const keyStr = document.getElementById('aes-key').value;
    if (!keyStr) throw new Error("Key is required");
    const binaryKey = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
        "raw", binaryKey, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]
    );
}

async function encryptAES() {
    const plaintext = document.getElementById('aes-plaintext').value;
    if (!plaintext) return showToast("Enter plaintext", "error");
    try {
        if (!document.getElementById('aes-key').value) await generateAESKey();
        const cryptoKey = await getCryptoKey();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(plaintext);
        const ciphertext = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, cryptoKey, encoded);
        const bundle = new Uint8Array(iv.length + ciphertext.byteLength);
        bundle.set(iv);
        bundle.set(new Uint8Array(ciphertext), iv.length);
        document.getElementById('aes-ciphertext').value = btoa(String.fromCharCode(...bundle));
        showToast("Encrypted successfully!");
    } catch (err) {
        showToast("Encryption failed", "error");
    }
}

async function decryptAES() {
    const bundleStr = document.getElementById('aes-ciphertext').value.trim();
    if (!bundleStr) return showToast("Ciphertext needed", "error");
    try {
        const cryptoKey = await getCryptoKey();
        const bundle = Uint8Array.from(atob(bundleStr), c => c.charCodeAt(0));
        const iv = bundle.slice(0, 12);
        const data = bundle.slice(12);
        const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, cryptoKey, data);
        document.getElementById('aes-output').value = new TextDecoder().decode(decrypted);
        showToast("Decrypted successfully!");
    } catch (err) {
        showToast("Decryption failed", "error");
    }
}

function initCrypto() {
    const genKeyBtn = document.getElementById('gen-aes-key-btn');
    if (genKeyBtn) genKeyBtn.addEventListener('click', generateAESKey);

    const encryptBtn = document.getElementById('aes-encrypt-btn');
    if (encryptBtn) encryptBtn.addEventListener('click', encryptAES);

    const decryptBtn = document.getElementById('aes-decrypt-btn');
    if (decryptBtn) decryptBtn.addEventListener('click', decryptAES);

    if (!window.isSecureContext) {
        const warning = document.getElementById('crypto-warning');
        if (warning) warning.classList.remove('hidden');
    }
}
