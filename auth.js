"use strict"

import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const signUp = async () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!checkFields(email, password)) return;

    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0) {
            alert('User already exists.')
        } else {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            alert('Account created for: ' + userCred.user.email);
            document.getElementById('authModal').classList.add('hidden');
        }
        emailInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        console.error('Signup error:', error);
        alert('Error signing up: ' + error.message);
    }
}

const logIn = async () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!checkFields(email, password)) return;
    
    try{
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        alert('Sign in successful ' + userCred);
        document.getElementById('authModal').classList.add('hidden');
        emailInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        console.log(error)
        if (error.code === 'auth/user-not-found') {
            alert('No user found. Please sign up.')
            emailInput.value = '';
            passwordInput.value = '';
        } else if (error.code === 'auth/wrong-password') {
            alert('Incorrect password.');
            passwordInput.value = '';
        }else {
            alert('Login error: ' + error.message);
            emailInput.value = '';
            passwordInput.value = '';
        }
        
    }
}

const logOut = async () => {
    try {
        await signOut(auth);
        alert('Sign out successful');
        console.log('signing out');
        document.getElementById('authModal').classList.add('hidden');
        email.value = '';
        password.value = '';
    } catch (error) {
        console.error('Logout failed:', error);
        alert("Logout error: " + error.message);
    }
}

const checkFields = (email, password) => {
    if (!email || !password) {
        alert('Missing fields');
        return false;
    }
    return true;
}

export { logIn, signUp, logOut };