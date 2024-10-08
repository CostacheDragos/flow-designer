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
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        }catch (e) {
            console.log(e);
            return "Invalid credentials";
        }

        await router.push("/home");
    }

    async function loginWithEmailAndPassword(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            console.log(e);
            return "Invalid credentials";
        }

        await router.push("/home");
    }

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);

        await router.push("/home");
    }

    async function logout() {
        // If the current route is login do not attempt to change to
        // login as the push method will return an error because
        // of redundant navigation
        if(router.currentRoute.value.path === "/login") {
            await signOut(auth);
            return;
        }

        const navigationResult = await router.push("/login");

        // If the navigation result is anything but undefined, the
        // route was blocked
        if(!navigationResult)
            await signOut(auth);

    }

    return {isLoggedIn, registerWithEmailAndPassword, loginWithEmailAndPassword, loginWithGoogle, logout};
})