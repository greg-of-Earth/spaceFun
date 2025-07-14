"use strict"

import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { db } from './firebase-init.js';


export const getTopThree = async () => {
    const userRef = collection(db, "users");
    const q = query(userRef, orderBy("highScore", "desc"), limit(3));

    try {
        const querySnap = await getDocs(q);
        const topThree = [];

        querySnap.forEach(doc => {
            const data = doc.data();
            const email = data.email || "unknown";
            const truncEmail = email.split('@')[0];
            topThree.push({ email: truncEmail, score: data.highScore || 0});
        });

        return topThree;
    } catch (err) {
        console.error("Failed to fetch leaders", err);
        return [];
    } 
}