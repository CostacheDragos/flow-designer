import { defineStore } from "pinia";

import  { auth } from "@/includes/firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    onAuthStateChanged
} from "firebase/auth";

import router from "@/router/index.js";
import {ref} from "vue";

export const useUserStore = defineStore('user', () => {
    const isLoggedIn = ref(false);

    // Used to listen for when the user logs in or out and redirect to appropriate pages
    onAuthStateChanged(auth, (user) => {
        if(user)
            isLoggedIn.value = true;
        else
            isLoggedIn.value = false;
    });

    async function registerWithEmailAndPassword(email, password) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        await router.push("/edit");
    }

    async function loginWithEmailAndPassword(email, password) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        await router.push("/edit");
    }

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);

        await router.push("/edit");
    }

    async function logout() {
        await signOut(auth);

        await router.push("/login");
    }

    return {isLoggedIn, registerWithEmailAndPassword, loginWithEmailAndPassword, loginWithGoogle, logout};
})