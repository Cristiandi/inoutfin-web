import { createRouter, createWebHashHistory } from 'vue-router';

import { auth } from '../firebase';

// views
import LoggedOut from '../views/LoggedOut.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import ResetPassword from '../views/ResetPassword.vue';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import ChangeEmail from '../views/ChangeEmail.vue';
import ChangePassword from '../views/ChangePassword.vue';
import ChangePhone from '../views/ChangePhone.vue';
import CreateOutcome from '../views/CreateOutcome.vue';

const routes = [
  {
    path: '/',
    name: 'LoggedOut',
    component: LoggedOut
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/change-email',
    name: 'ChangeEmail',
    component: ChangeEmail,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/change-phone',
    name: 'ChangePhone',
    component: ChangePhone,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create-outcome',
    name: 'CreateOutcome',
    component: CreateOutcome,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  // console.log('requiresAuth', requiresAuth);

  // console.log('auth.currentUser', auth.currentUser);

  if (requiresAuth && !auth.currentUser) {
    return next('/');
  } else if (!requiresAuth && auth.currentUser) {
    return next('/home');
  } else {
    return next();
  }
});

export default router;
