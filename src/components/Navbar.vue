<template>
  <nav class="navbar fixed-bottom navbar-light bg-light">
    <form class="container-fluid justify-content-between">
      <router-link to="/profile" class="link-dark">
        <BIconPerson width="25" height="25" />
      </router-link>
      <router-link to="/" class="link-dark">
        <BIconDashCircle width="25" height="25" />
      </router-link>
      <router-link to="/home" class="link-dark">
        <BIconHouseDoor width="32" height="32" />
      </router-link>
      <router-link to="/" class="link-dark">
        <BIconPlusCircle width="25" height="25" />
      </router-link>
      <router-link to="/" class="link-dark">
        <BIconQuestionCircle width="25" height="25" />
      </router-link>
    </form>
  </nav>
</template>

<script>
import {
  BIconPerson,
  BIconDashCircle,
  BIconHouseDoor,
  BIconPlusCircle,
  BIconQuestionCircle
} from 'bootstrap-icons-vue';

export default {
  name: 'Navbar',
  // data () {},
  components: {
    BIconPerson,
    BIconDashCircle,
    BIconHouseDoor,
    BIconPlusCircle,
    BIconQuestionCircle
  },
  methods: {}
};
</script>
