import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faAngleRight, faAngleDown, faPlus, faMinus, faXmark, faCircleXmark, faTrash, faGears, faPenToSquare, faDownload, faUpload,
        faCode }
        from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faAngleRight, faAngleDown, faPlus, faMinus, faXmark, faCircleXmark, faTrash, faGears, faPenToSquare, faDownload, faUpload,
    faCode)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
