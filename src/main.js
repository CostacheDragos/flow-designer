import { createApp } from 'vue';
import { createPinia } from "pinia";
import './style.css';
import App from './App.vue';

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faAngleRight, faAngleDown, faPlus, faMinus, faXmark, faCircleXmark, faTrash, faGears, faPenToSquare, faDownload, faUpload,
        faCode, faCloudArrowUp, faSpinner, faFileCode } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap-icons/font/bootstrap-icons.css'

import router from "@/router/index.js";

import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/includes/firebase.js";


/* add icons to the library */
library.add(faAngleRight, faAngleDown, faPlus, faMinus, faXmark, faCircleXmark, faTrash, faGears, faPenToSquare, faDownload, faUpload,
    faCode, faCloudArrowUp, faSpinner, faFileCode)

let app;
onAuthStateChanged(auth, () => {
        if(!app) {
           const pinia = createPinia();
           app = createApp(App)
            .use(pinia)
            .use(router)
            .component('font-awesome-icon', FontAwesomeIcon)
            .mount('#app');
        }
});




