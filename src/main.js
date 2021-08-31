import Toaster from '@meforma/vue-toaster';
import VTooltipPlugin from 'v-tooltip';

import { createApp } from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'v-tooltip/dist/v-tooltip.css';

import { auth, onAuthStateChanged } from './firebase';

import App from './App.vue';
import router from './router';
import store from './store';

// import './index.css';
import './registerServiceWorker';

let createdApp;

onAuthStateChanged(auth, user => {
  if (!createdApp) {
    createdApp = createApp(App)
      .use(store)
      .use(router)
      .use(Toaster)
      .use(VTooltipPlugin)
      .mount('#app');
  }

  if (user && user.emailVerified) {
    store.dispatch('setCurrentUser', user)
      .then(() => router.push('/home'))
      .catch(err => {
        console.error('error making setCurrentUser', err);
        store.dispatch('logout');
      });
  }
});
