import Toaster from '@meforma/vue-toaster';

import { createApp } from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { auth } from './firebase';

import App from './App.vue';
import router from './router';
import store from './store';

// import './index.css';

let createdApp;

auth.onAuthStateChanged(user => {
  if (!createdApp) {
    createdApp = createApp(App)
      .use(store)
      .use(router)
      .use(Toaster)
      .mount('#app');
  }

  if (user && user.emailVerified) {
    router.push('/home');

    store.dispatch('setCurrentUser', user)
      .catch(err => {
        console.error('error making setCurrentUser', err);
        store.dispatch('logout');
      });
  }
});
