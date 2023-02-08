import { createRouter, createWebHistory} from "vue-router";

import Login from "@/components/pages/auth/Login.vue";
import Register from "@/components/pages/auth/Register.vue";
import FlowEditor from "@/components/pages/edit/FlowEditor.vue";
import Home from "@/components/pages/dashboard/Home.vue";

import { useUserStore } from "@/stores/user.js";

// Define the routes
const routes = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
    },
    {
        path: "/edit",
        name: "Editor",
        component: FlowEditor,
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
    }
];

// Create the router
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});


// Add navigation guards so that unauthenticated users
// can only access login and register
router.beforeEach((to, from) => {
    const { isLoggedIn } = useUserStore();

    // If the user tries to access login or register but he is already logged, redirect to home
    if(to.name === "Login" || to.name === "Register") {
        if (isLoggedIn)
            return {name: "Home"};
    }
    // If the user tries to access other pages and is not logged in, redirect to login
    else if(!isLoggedIn) {
        return {name: "Login"};
    }
});

export default router;
