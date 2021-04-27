import { createStore } from 'vuex';

import router from '../router';

import { usersService } from '../modules/users/users.service';
import { getFirebaseProviderId } from '@/utils';

export default createStore({
  state: {
    user: {},
    showNavbar: false
  },
  mutations: {
    setUser (state, val) {
      state.user = val;
    },
    setShowNavbar (state, val) {
      state.showNavbar = val;
    }
  },
  actions: {
    async login ({ dispatch }, { email, password }) {
      // sign user in
      // const user = await usersService.login({ email, password });

      await usersService.login({ email, password });

      // await dispatch('setCurrentUser', user);

      // change route to home
      // router.push('/home');
    },
    async loginWithGoogle ({ dispatch }) {
      // sign user in
      // const user = await usersService.loginWithGoogle();

      await usersService.loginWithGoogle();

      // await dispatch('setCurrentUser', user);

      // change route to home
      // router.push('/home');
    },
    async logout ({ commit }) {
      await usersService.logout();

      // clear user and redirect to /
      commit('setUser', {});

      router.push('/');
    },
    async setCurrentUser ({ commit }, user) {
      // TODO: get the user info from API
      const myInfo = await usersService.myInfo({ authUid: user.uid });

      const providerId = getFirebaseProviderId();

      // set user in state
      commit('setUser', {
        ...user,
        ...myInfo,
        providerId
      });
    },
    handleShowNavbar ({ commit }, showNavbar) {
      // set the show side bar value
      // console.log('showSideBar', showSideBar);
      commit('setShowNavbar', showNavbar);
    }
  },
  modules: {},
  getters: {
    user (state) {
      return state.user;
    },
    showNavbar (state) {
      return state.showNavbar;
    }
  }
});
