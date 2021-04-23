<template>
  <Navbar v-if="currentUser.uid" />
  <router-view/>
</template>

<style>
#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  data () {
    return {
      currentUser: {}
    };
  },
  components: {
    Navbar
  },
  created () {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      const { type, payload } = mutation;

      // console.log('mutation.type', type);
      // console.log('mutation.payload', payload);

      if (type === 'setUser' && payload && payload.uid) {
        this.currentUser = payload;
      } else if (type === 'setUser') {
        this.currentUser = {};
      }
    });
  },
  beforeUnmount () {
    this.unsubscribe();
  }
};
</script>
