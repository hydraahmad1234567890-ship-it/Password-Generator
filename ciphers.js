/**
 * TOOL 3: Classical Ciphers Logic
 */
const CIPHER_DESCS = {
    caesar: "Caesar cipher shifts letters by a fixed number of positions down the alphabet.",
    atbash: "Atbash cipher maps alphabet to its reverse (A↔Z).",
    vigenere: "Vigenère cipher uses a keyword to shift letters.",
    railfence: "Rail Fence cipher writes text in a zigzag pattern.",
    grid: "Grid cipher writes text row-by-row into a fixed grid, then reads it column-by-column."
};

function initCiphers() {
    const typeSelect = document.getElementById('cipher-type');
    if (typeSelect) {
        typeSelect.addEventListener('change', toggleCipherParams);
    }

    const encodeBtn = document.getElementById('cipher-encode-btn');
    if (encodeBtn) encodeBtn.addEventListener('click', () => processCipher('encode'));

    const decodeBtn = document.getElementById('cipher-decode-btn');
    if (decodeBtn) decodeBtn.addEventListener('click', () => processCipher('decode'));

    const swapBtn = document.getElementById('cipher-swap-btn');
    if (swapBtn) swapBtn.addEventListener('click', swapCipherIO);

    toggleCipherParams();
}

function toggleCipherParams() {
    const type = document.getElementById('cipher-type').value;
    document.querySelectorAll('#cipher-params > div').forEach(div => div.classList.add('hidden'));
    document.getElementById(`params-${type}`).classList.remove('hidden');
    document.getElementById('cipher-desc').innerText = CIPHER_DESCS[type];
}

function swapCipherIO() {
    const out = document.getElementById('cipher-output').value;
    if (!out) return;
    document.getElementById('cipher-input').value = out;
    document.getElementById('cipher-output').value = '';
    showToast("Swapped!");
}

function processCipher(mode) {
    const type = document.getElementById('cipher-type').value;
    const input = document.getElementById('cipher-input').value;
    if (!input) return showToast("No input text", "error");

    let result = "";
    switch (type) {
        case 'caesar':
            const shift = parseInt(document.getElementById('caesar-shift').value) || 0;
            result = caesarCipher(input, mode === 'encode' ? shift : -shift);
            break;
        case 'atbash':
            result = atbashCipher(input);
            break;
        case 'vigenere':
            const key = document.getElementById('vigenere-key').value;
            if (!key) return showToast("Keyword required", "error");
            result = vigenereCipher(input, key, mode === 'encode');
            break;
        case 'railfence':
            const rails = parseInt(document.getElementById('rail-rails').value) || 2;
            result = mode === 'encode' ? railEncode(input, rails) : railDecode(input, rails);
            break;
        case 'grid':
            const cols = parseInt(document.getElementById('grid-cols').value) || 4;
            const pad = document.getElementById('grid-padding').value || 'X';
            const rev = document.getElementById('grid-reverse').checked;
            result = mode === 'encode' ? gridEncode(input, cols, pad, rev) : gridDecode(input, cols, rev);
            break;
    }
    document.getElementById('cipher-output').value = result;
}

function caesarCipher(text, shift) {
    return text.replace(/[a-z]/gi, char => {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - start + shift + 26) % 26) + start);
    });
}

function atbashCipher(text) {
    return text.replace(/[a-z]/gi, char => {
        const isUpper = char <= 'Z';
        const code = char.charCodeAt(0);
        const start = isUpper ? 65 : 97;
        const end = isUpper ? 90 : 122;
        return String.fromCharCode(end - (code - start));
    });
}

function vigenereCipher(text, key, encode = true) {
    let j = 0;
    const k = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!k) return text;
    return text.replace(/[a-z]/gi, char => {
        const isUpper = char <= 'Z';
        const start = isUpper ? 65 : 97;
        const shift = k.charCodeAt(j % k.length) - 65;
        j++;
        const finalShift = encode ? shift : -shift;
        return String.fromCharCode(((char.charCodeAt(0) - start + finalShift + 26) % 26) + start);
    });
}

function railEncode(text, rails) {
    if (rails < 2) return text;
    let fence = Array.from({length: rails}, () => []);
    let rail = 0, dir = 1;
    for (let char of text) {
        fence[rail].push(char);
        rail += dir;
        if (rail === rails - 1 || rail === 0) dir *= -1;
    }
    return fence.flat().join('');
}

function railDecode(text, rails) {
    if (rails < 2) return text;
    let pattern = Array.from({length: rails}, () => []);
    let rail = 0, dir = 1;
    for (let i = 0; i < text.length; i++) {
        pattern[rail].push(i);
        rail += dir;
        if (rail === rails - 1 || rail === 0) dir *= -1;
    }
    let res = new Array(text.length);
    let idx = 0;
    for (let r = 0; r < rails; r++) {
        for (let pos of pattern[r]) res[pos] = text[idx++];
    }
    return res.join('');
}

function gridEncode(text, cols, pad, reverse) {
    const rows = Math.ceil(text.length / cols);
    const grid = Array.from({length: rows}, () => new Array(cols).fill(pad));
    let k = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) if (k < text.length) grid[i][j] = text[k++];
    }
    let result = "";
    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) result += grid[i][j];
    }
    return reverse ? result.split('').reverse().join('') : result;
}

function gridDecode(text, cols, reverse) {
    if (reverse) text = text.split('').reverse().join('');
    const rows = Math.ceil(text.length / cols);
    const grid = Array.from({length: rows}, () => new Array(cols));
    let k = 0;
    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) if (k < text.length) grid[i][j] = text[k++];
    }
    return grid.flat().join('').replace(/X+$/, ''); 
}
