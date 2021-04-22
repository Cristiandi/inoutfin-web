<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <router-link to="/profile" class="link-dark">
          <BIconArrowLeft width="32" height="32" />
        </router-link>

        <h1 class="text-center">Cambiar email</h1>

        <div class="">
          <Form
            @submit="onSubmit"
            v-slot="{ errors }"
            :validation-schema="changeUserEmail"
          >
            <div>
              <div class="row">
                <div class="col-6">
                  <label for="email" class="fw-bold">Email</label>
                </div>
                <div class="col-6 text-end">
                  <small for="email" class="text-muted fw-light">
                    Tú nuevo email!
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
                CAMBIAR
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
import { mapState } from 'vuex';

import { changeUserEmail } from '../modules/users/schemas/change-user-email.schema';
import { usersService } from '../modules/users/users.service';
import { getErrorMessage } from '../utils';

export default {
  name: 'ChangeEmail',
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
  computed: mapState({
    userFromState: (state) => state.user
  }),
  setup () {
    return { changeUserEmail };
  },
  methods: {
    async onSubmit (values, { resetForm }) {
      try {
        this.loading = true;

        const { email } = this.data;

        if (email.trim() === this.userFromState?.email) {
          this.$toast.info('No es necesario cambiar, es igual al actual.', {
            position: 'top-right',
            queue: false
          });

          return;
        }

        const { message } = await usersService.changeEmail({ email, authUid: this.userFromState?.uid });

        this.$toast.success(message, {
          position: 'top-right',
          queue: false
        });

        resetForm();

        setTimeout(() => {
          this.$store.dispatch('logout');
        }, 3000);
      } catch (error) {
        this.$toast.error(getErrorMessage(error) || error.message, {
          position: 'top-right',
          queue: false
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
