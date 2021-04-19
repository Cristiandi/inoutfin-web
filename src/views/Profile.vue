<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <button type="submit" class="btn btn-dark form-control" @click.prevent="logout">
          SALIR
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  methods: {
    logout () {
      this.$store.dispatch('logout');
    }
  }
};
</script>
