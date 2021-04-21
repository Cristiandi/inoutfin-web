<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <div class="row header">
          <div class="image">
            <img
              src="https://i.imgur.com/0LKZQYM.jpg"
              class="rounded-circle"
              width="100"
            />
          </div>
        </div>

        <div class="row body">
          <Form
            @submit="onSubmit"
            v-slot="{ errors }"
            :validation-schema="changeName"
          >
            <div>
              <div class="row">
                <div class="col-4">
                  <label for="fullName" class="fw-bold">Nombre</label>
                </div>
                <div class="col-4 text-end">
                  <small for="fullName" class="text-muted fw-light">
                    Tú nombre.
                  </small>
                </div>
              </div>
              <div class="row">
                <div class="col-8">
                  <Field
                    type="text"
                    class="form-control"
                    id="fullName"
                    name="fullName"
                    as="input"
                    v-model="data.fullName"
                  />
                  <small class="validation">{{ errors.fullName }}</small>
                </div>
                <div class="col-4">
                  <div v-if="loading" class="text-center">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>

                  <div v-if="!loading">
                    <button type="submit" class="btn btn-dark form-control">
                      CAMBIAR
                    </button>
                  </div>

                </div>
              </div>
            </div>

            <hr />

            <router-link
              to="/change-email"
              role="button"
              class="btn btn-outline-dark form-control"
              >CAMBIAR EMAIL</router-link
            >

            <pre></pre>

            <router-link
              to="/change-password"
              role="button"
              class="btn btn-outline-dark form-control"
              >CAMBIAR CLAVE</router-link
            >

            <pre></pre>

            <router-link
              to="/"
              role="button"
              class="btn btn-outline-dark form-control"
              >CAMBIAR TÉLEFONO</router-link
            >

            <hr />

            <button
              type="submit"
              class="btn btn-dark form-control"
              @click.prevent="logout"
            >
              SALIR
            </button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  background-color: black;
  background-size: 100% 100%;
  height: 20vh;
}

.body {
  margin-top: 10vh;
}

img {
  display: block;
  margin: auto;
  margin-top: 10vh;
}

.validation {
  color: red;
}

input {
  border-radius: 0;
  border: 1px solid #000;
}

small {
  font-size: 8pt;
}
</style>

<script>
import { mapState } from 'vuex';
import { Field, Form } from 'vee-validate';

import { usersService } from '../modules/users/users.service';

import { getErrorMessage } from '../utils';

import { changeName } from '../modules/users/schemas/change-name.schema';

export default {
  name: 'Profile',
  data () {
    return {
      data: {
        fullName: ''
      },
      loading: false
    };
  },
  components: {
    Form,
    Field
  },
  computed: mapState({
    user: (state) => state.user
  }),
  setup () {
    return { changeName };
  },
  mounted () {
    this.data.fullName = this.user?.fullName;
  },
  methods: {
    async onSubmit (args) {
      try {
        this.loading = true;

        const { fullName } = this.data;

        if (fullName === this.user.fullName) return;

        const { message } = await usersService.update({
          authUid: this.user?.authUid,
          fullName
        });

        this.$toast.success(message, {
          position: 'top-right',
          queue: false
        });

        this.user.fullName = fullName;
      } catch (error) {
        console.log(error);
        this.$toast.error(getErrorMessage(error) || error.message, {
          position: 'top-right',
          queue: false
        });
      } finally {
        this.loading = false;
      }
    },
    async logout () {
      await this.$store.dispatch('logout');
    }
  }
};
</script>
