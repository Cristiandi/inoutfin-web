<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <div class="row background">
          <img src="../assets/logo.png" width="100" height="120" />
        </div>
        <div class="row under-background">
          <div class="col-6 align-self-center text-center">
            <router-link to="/register" role="button" class="btn btn-dark">REGISTRARSE</router-link>
          </div>
          <div class="col-6 align-self-center text-center">
            <router-link to="/login" role="button" class="btn btn-outline-dark">INICIAR SESIÓN</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-image: url("../assets/background_one.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
  height: 90vh;
}

img {
  display:block;
  margin:auto;
}

.under-background {
  height: 10vh;;
}
</style>
