<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <router-link v-if="!loginLoading" to="/" class="link-dark">
          <BIconArrowLeft width="32" height="32" />
        </router-link>

        <div class="centered">
          <div v-if="!loginLoading">
            <h1 class="text-center">Iniciar sesión</h1>
            <Form
              @submit="onSubmit"
              v-slot="{ errors }"
              :validation-schema="loginUser"
            >
              <div>
                <div class="row">
                  <div class="col-6">
                    <label for="email" class="fw-bold">Email</label>
                  </div>
                  <div class="col-6 text-end">
                    <small for="email" class="text-muted fw-light">
                      Uno válido porfa!
                    </small>
                  </div>
                </div>
                <div class="">
                  <Field
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    as="input"
                    v-model="data.email"
                  />
                  <small class="validation">{{ errors.email }}</small>
                </div>
              </div>

              <div>
                <div class="row">
                  <div class="col-6">
                    <label for="password" class="fw-bold">Clave</label>
                  </div>
                  <div class="col-6 text-end">
                    <small for="password" class="text-muted fw-light">
                      Que sea segura.
                    </small>
                  </div>
                </div>
                <div class="">
                  <Field
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    as="input"
                    v-model="data.password"
                  />
                  <small class="validation">{{ errors.password }}</small>
                </div>
              </div>

              <div class="text-end">
                <small class="text-muted fw-light">
                  <router-link to="/reset-password">
                    ¿Olvidaste tú clave?
                  </router-link>
                </small>
              </div>

              <div v-if="loading" class="text-center">
                <pre></pre>

                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div v-if="!loading">
                <pre></pre>
                <button type="submit" class="btn btn-dark form-control">
                  GO
                </button>
                <hr />
                <button
                  @click="loginWithGoogle"
                  class="btn btn-outline-dark form-control"
                >
                  <BIconGoogle width="20" height="20" />
                </button>
              </div>
            </Form>
          </div>
          <div v-else class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 95vh;
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

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>

<script>
import { Field, Form } from 'vee-validate';
import { BIconArrowLeft, BIconGoogle } from 'bootstrap-icons-vue';

import { getFromObjectPathParsed } from '../utils';

import { loginUser } from '../modules/users/schemas/login-user.schema';

export default {
  name: 'Login',
  data () {
    return {
      data: {
        email: '',
        password: ''
      },
      loading: false,
      loginLoading: false
    };
  },
  components: {
    Form,
    Field,
    BIconArrowLeft,
    BIconGoogle
  },
  setup () {
    return { loginUser };
  },
  methods: {
    async onSubmit (values, { resetForm }) {
      try {
        this.loading = true;

        const { email, password } = this.data;

        await this.$store.dispatch('login', {
          email,
          password
        });

        resetForm();
      } catch (error) {
        this.$toast.error(
          getFromObjectPathParsed(error, 'response.data.message') ||
            error.message,
          {
            position: 'top-right',
            queue: false
          }
        );
      } finally {
        this.loading = false;
      }
    },
    async loginWithGoogle () {
      try {
        this.loginLoading = true;
        await this.$store.dispatch('loginWithGoogle');
      } catch (error) {
        console.error(error);
        this.$toast.error(
          getFromObjectPathParsed(error, 'response.data.message') ||
            error.message,
          {
            position: 'top-right',
            queue: false
          }
        );
      }
    }
  }
};
</script>
