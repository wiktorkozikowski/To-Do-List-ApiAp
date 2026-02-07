const API_URL = 'http://localhost:3000/api';

async function login() {
    const identifier = document.getElementById('loginIdentifierInput')?.value.trim();
    const password = document.getElementById('loginPasswordInput')?.value;

    if (!identifier || !password) {
        alert('Podaj login lub email oraz haslo');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Blad logowania');
        }

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Blad:', error);
        alert(error.message || 'Blad logowania');
    }
}

async function register() {
    const email = document.getElementById('registerEmailInput')?.value.trim();
    const loginValue = document.getElementById('registerLoginInput')?.value.trim();
    const password = document.getElementById('registerPasswordInput')?.value;

    if (!email || !loginValue || !password) {
        alert('Uzupelnij email, login i haslo');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, login: loginValue, password })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Blad rejestracji');
        }

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Blad:', error);
        alert(error.message || 'Blad rejestracji');
    }
}

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

if (loginBtn) {
    loginBtn.addEventListener('click', login);
}

if (registerBtn) {
    registerBtn.addEventListener('click', register);
}
