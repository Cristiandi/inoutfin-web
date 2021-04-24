<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <router-link to="/" class="link-dark">
          <BIconArrowLeft width="32" height="32" />
        </router-link>

        <h1 class="text-center">Crear egreso</h1>

        <div class="">
          <Form
            @submit="onSubmit"
            v-slot="{ errors }"
            :validation-schema="createOutcomeMovementSchema"
          >
            <div>
              <div class="row">
                <div class="col-6">
                  <label for="description" class="fw-bold">Nombre</label>
                </div>
                <div class="col-6 text-end">
                  <small for="description" class="text-muted fw-light">
                    Algo que describa el gasto
                  </small>
                </div>
              </div>
              <div class="">
                <Field
                  type="text"
                  class="form-control"
                  id="description"
                  name="description"
                  as="input"
                  tabindex="1"
                  v-model="data.description"
                />
                <small class="validation">{{ errors.description }}</small>
              </div>
            </div>

            <div>
              <div class="row">
                <div class="col-6">
                  <label for="amount" class="fw-bold">Monto</label>
                </div>
                <div class="col-6 text-end">
                  <small for="amount" class="text-muted fw-light">
                    El valor del gasto.
                  </small>
                </div>
              </div>
              <div class="">
                <Field
                  type="number"
                  class="form-control"
                  id="amount"
                  name="amount"
                  as="input"
                  tabindex="2"
                  v-model="data.amount"
                />
                <small class="validation">{{ errors.amount }}</small>
              </div>
            </div>

            <div>
              <div class="row">
                <div class="col-6">
                  <label for="movementCategoryId" class="fw-bold">Categoria</label>
                </div>
                <div class="col-6 text-end">
                  <small for="movementCategoryId" class="text-muted fw-light">
                    A que categoria pertenece
                  </small>
                </div>
              </div>
              <div class="">
                <vue-select v-model="data.movementCategoryId"
                            :options="movementCategories"
                            label-by="name"
                            value-by="id"
                            close-on-select
                            id="movementCategoryId"
                            name="movementCategoryId"
                            class="form-control"
                            :tabindex=3></vue-select>

                <small class="validation">{{ errors.movementCategoryId }}</small>
              </div>
            </div>

            <div>
              <div class="mb-3">
                <div class="row">
                  <div class="col-6">
                    <label for="image" class="fw-bold">Comprobante</label>
                  </div>
                  <div class="col-6 text-end">
                    <small for="image" class="text-muted fw-light">
                      Una imagen.
                    </small>
                  </div>
                </div>
                <Field
                  type="file"
                  class="form-control form-control-sm"
                  id="image"
                  name="image"
                  v-model="data.image"
                  rules="image"
                />
                <small class="validation">{{ errors.image }}</small>
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
              <button type="submit" class="btn btn-dark form-control" tabindex="4">
                CREAR
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

.vue-select {
  width: 100%;
  border-radius: 0;
  border: 1px solid #000;
}
</style>

<script>
import VueSelect from 'vue-next-select';
import { Field, Form } from 'vee-validate';
import { BIconArrowLeft } from 'bootstrap-icons-vue';
import { mapState } from 'vuex';

import { createOutcomeMovementSchema } from '../modules/movements/schemas/create-outcome-movement.schema';

import { movementCategoriesService } from '../modules/movement-categories/movement-categories.service';
import { movementsService } from '../modules/movements/movements.service';

import { getErrorMessage } from '../utils';

export default {
  name: 'ChangePhone',
  data () {
    return {
      data: {
        description: '',
        amount: null,
        movementCategoryId: null,
        image: null
      },
      loading: false,
      movementCategories: []
    };
  },
  components: {
    Form,
    Field,
    BIconArrowLeft,
    VueSelect
  },
  computed: mapState({
    userFromState: (state) => state.user
  }),
  setup () {
    return { createOutcomeMovementSchema };
  },
  async mounted () {
    try {
      this.movementCategories = await movementCategoriesService.getAll({ sign: -1 });
    } catch (error) {
      this.$toast.error('problem loading the categories.', {
        position: 'top-right',
        queue: false
      });
      console.error(error);
    }
  },
  methods: {
    async onSubmit (values, { resetForm }) {
      try {
        this.loading = true;

        if (!this.data.movementCategoryId) {
          this.$toast.error('Por favor selecciona una categoria', {
            position: 'top-right',
            queue: false
          });

          return;
        }

        const { message, id: movementId } = await movementsService.createOutcome({
          userAuthUid: this.userFromState?.uid,
          movementCategoryId: this.data.movementCategoryId,
          amount: parseFloat(this.data.amount),
          description: this.data.description
        });

        const { image } = this.data;
        if (image) {
          const file = image[0];

          movementsService
            .uploadFile({
              userAuthUid: this.userFromState?.uid,
              id: movementId,
              file
            })
            .catch((err) => console.error(err));
        }

        this.$toast.success(message, {
          position: 'top-right',
          queue: false
        });

        resetForm();
        this.data.movementCategoryId = null;
        this.data.image = null;
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
