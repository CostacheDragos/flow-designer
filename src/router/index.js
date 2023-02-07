import { createRouter, createWebHistory} from "vue-router";

import Login from "@/components/pages/auth/Login.vue";
import Register from "@/components/pages/auth/Register.vue";
import FlowEditor from "@/components/pages/edit/FlowEditor.vue";
import Home from "@/components/pages/dashboard/Home.vue";

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

export default router;
