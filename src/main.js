import { createApp } from 'vue';
import { createPinia } from "pinia";
import './style.css';
import App from './App.vue';

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faAngleRight, faAngleDown, faPlus, faMinus, faXmark, faCircleXmark, faTrash, faGears, faPenToSquare, faDownload, faUpload,
        faCode } from '@fortawesome/free-solid-svg-icons';

import router from "@/router/index.js";


/* add icons to the library */
library.add(faAngleRight, faAngleDown, faPlus, faMinus, faXmark, faCircleXmark, faTrash, faGears, faPenToSquare, faDownload, faUpload,
    faCode)

const pinia = createPinia();
createApp(App)
    .use(pinia)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');


