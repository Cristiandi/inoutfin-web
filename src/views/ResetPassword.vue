<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <router-link to="/login" class="link-dark">
          <BIconArrowLeft width="32" height="32" />
        </router-link>

        <h1 class="text-center">Reiniciar clave</h1>

        <div class="">
          <Form
            @submit="onSubmit"
            v-slot="{ errors }"
            :validation-schema="resetUserPassword"
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

            <div v-if="loading" class="text-center">
              <pre></pre>

              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-if="!loading">
              <pre></pre>
              <button type="submit" class="btn btn-dark form-control">
                ENVIAR CORREO
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
import { BIconArrowLeft } from 'bootstrap-icons-vue';

import { resetUserPassword } from '../modules/users/schemas/reset-user-password.schema';
import { usersService } from '../modules/users/users.service';
import { getErrorMessage } from '../utils';

export default {
  name: 'ResetPasswrod',
  data () {
    return {
      data: {
        email: ''
      },
      loading: false
    };
  },
  components: {
    Form,
    Field,
    BIconArrowLeft
  },
  setup () {
    return { resetUserPassword };
  },
  methods: {
    async onSubmit (values, { resetForm }) {
      this.loading = true;

      try {
        const { email } = this.data;

        const { message } = await usersService.resetPassword({ email });

        this.$toast.success(message, {
          position: 'top-right',
          queue: false
        });

        resetForm();
      } catch (error) {
        this.$toast.error(getErrorMessage(error) || error.message, {
          position: 'top-right',
          queue: false
        });
      }

      this.loading = false;
    }
  }
};
</script>
