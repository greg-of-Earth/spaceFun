"use strict"

import { logIn, signUp } from "./auth.js";

let isLogin = true;

const toggleForm = () => {

    isLogin = !isLogin;

    document.getElementById('gameFormTitle').textContent = isLogin ? "Log In" : "Sign Up";
    document.getElementById('authActionBtn').textContent = isLogin ? "Log In" : "Sign Up";
    document.getElementById('toggleText').textContent = isLogin 
        ? "Don't have an account?" 
        : "Already have an account?";
    document.getElementById('formToggleLink').textContent = isLogin 
        ? "Sign Up" 
        : "Log In";
};

document.getElementById('formToggleLink').addEventListener('click', toggleForm);

document.getElementById('authActionBtn').addEventListener('click', () => {
    isLogin ? logIn() : signUp();
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('authModal').classList.add('hidden');
});
