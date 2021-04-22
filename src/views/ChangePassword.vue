<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <router-link to="/profile" class="link-dark">
          <BIconArrowLeft width="32" height="32" />
        </router-link>

        <h1 class="text-center">Cambiar clave</h1>

        <div class="">
          <Form
            @submit="onSubmit"
            v-slot="{ errors }"
            :validation-schema="changeUserPassword"
          >

            <div>
              <div class="row">
                <div class="col-6">
                  <label for="oldPassword" class="fw-bold">Clave</label>
                </div>
                <div class="col-6 text-end">
                  <small for="oldPassword" class="text-muted fw-light">
                    Tú clave actual.
                  </small>
                </div>
              </div>
              <div class="">
                <Field
                  type="password"
                  class="form-control"
                  id="oldPassword"
                  name="oldPassword"
                  as="input"
                  v-model="data.oldPassword"
                />
                <small class="validation">{{ errors.oldPassword }}</small>
              </div>
            </div>

            <div>
              <div class="row">
                <div class="col-6">
                  <label for="newPassword" class="fw-bold"> Clave </label>
                </div>
                <div class="col-6 text-end">
                  <small for="newPassword" class="text-muted fw-light">
                    Tú nueva clave
                  </small>
                </div>
              </div>
              <div class="">
                <Field
                  type="password"
                  class="form-control"
                  id="newPassword"
                  name="newPassword"
                  as="input"
                  v-model="data.newPassword"
                />
                <small class="validation">{{ errors.newPassword }}</small>
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

import { changeUserPassword } from '../modules/users/schemas/change-user-password.schema';
import { usersService } from '../modules/users/users.service';
import { getErrorMessage } from '../utils';

export default {
  name: 'ChangePassword',
  data () {
    return {
      data: {
        oldPassword: '',
        newPassword: ''
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
    return { changeUserPassword };
  },
  methods: {
    async onSubmit (values, { resetForm }) {
      try {
        this.loading = true;

        const { oldPassword, newPassword } = this.data;

        const { message } = await usersService.changePassword({
          authUid: this.userFromState?.uid,
          oldPassword,
          newPassword
        });

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
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
