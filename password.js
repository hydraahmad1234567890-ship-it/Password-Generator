/**
 * TOOL 1: Password Generator Logic
 */
function initPasswordGenerator() {
    const lengthInput = document.getElementById('pw-length');
    if (lengthInput) {
        lengthInput.addEventListener('input', (e) => {
            document.getElementById('pw-length-val').innerText = e.target.value;
        });
    }

    const generateBtn = document.getElementById('generate-pw-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePassword);
    }
}

function generatePassword() {
    const length = parseInt(document.getElementById('pw-length').value);
    const useUpper = document.getElementById('pw-upper').checked;
    const useLower = document.getElementById('pw-lower').checked;
    const useNumbers = document.getElementById('pw-numbers').checked;
    const useSymbols = document.getElementById('pw-symbols').checked;
    const excludeSimilar = document.getElementById('pw-exclude-similar').checked;

    const upperChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; 
    const lowerChars = "abcdefghijkmnopqrstuvwxyz"; 
    const numberChars = "23456789"; 
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const fullUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fullLower = "abcdefghijklmnopqrstuvwxyz";
    const fullNumbers = "0123456789";

    let charset = "";
    if (useUpper) charset += excludeSimilar ? upperChars : fullUpper;
    if (useLower) charset += excludeSimilar ? lowerChars : fullLower;
    if (useNumbers) charset += excludeSimilar ? numberChars : fullNumbers;
    if (useSymbols) charset += symbolChars;

    if (charset === "") {
        showToast("Please select at least one character set!", "error");
        return;
    }

    let password = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += charset.charAt(array[i] % charset.length);
    }

    document.getElementById('pw-output').value = password;
    updateStrength(password, length, [useUpper, useLower, useNumbers, useSymbols].filter(Boolean).length);
}

function updateStrength(password, length, variety) {
    const bar = document.getElementById('pw-strength-bar');
    const text = document.getElementById('pw-strength-text');
    const entropyEl = document.getElementById('pw-entropy');
    const entropy = Math.floor(length * Math.log2(variety * 20 || 1));
    entropyEl.innerText = `${entropy} bits`;

    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (variety >= 3) score++;
    if (variety >= 4) score++;

    if (score <= 1) {
        bar.className = "h-full w-1/3 bg-red-500 transition-all duration-500";
        text.innerText = "Weak";
    } else if (score <= 3) {
        bar.className = "h-full w-2/3 bg-amber-500 transition-all duration-500";
        text.innerText = "Medium";
    } else {
        bar.className = "h-full w-full bg-emerald-500 transition-all duration-500";
        text.innerText = "Strong";
    }
}
