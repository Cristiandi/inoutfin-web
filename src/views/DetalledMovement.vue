<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <h1 class="text-center">Movimiento {{ $route.params.id }}</h1>

        <div v-if="!loadingFormData">
          <Form
            @submit="onSubmit"
            v-slot="{ errors }"
            :validation-schema="updateMovementSchema"
          >
            <div>
              <div class="row">
                <div class="col-6">
                  <label for="description" class="fw-bold">Nombre</label>
                </div>
                <div class="col-6 text-end">
                  <small for="description" class="text-muted fw-light">
                    Algo que describa el ingreso.
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
                    El valor del ingreso.
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
                  <label for="movementCategoryId" class="fw-bold"
                    >Categoria</label
                  >
                </div>
                <div class="col-6 text-end">
                  <small for="movementCategoryId" class="text-muted fw-light">
                    A que categoria pertenece
                  </small>
                </div>
              </div>
              <div class="">
                <vue-select
                  v-model="data.movementCategoryId"
                  :options="movementCategories"
                  label-by="name"
                  value-by="id"
                  close-on-select
                  id="movementCategoryId"
                  name="movementCategoryId"
                  class="form-control"
                  :tabindex="3"
                ></vue-select>

                <small class="validation">{{
                  errors.movementCategoryId
                }}</small>
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
                  v-model="data.image"
                  type="file"
                  class="form-control form-control-sm"
                  id="image"
                  name="image"
                  rules="image"
                />
                <small class="validation">{{ errors.image }}</small>
              </div>
            </div>

            <div class="form-check">
              <pre></pre>
              <Field
                type="checkbox"
                class="form-check-input"
                id="wanToDelete"
                name="wanToDelete"
                :value="true"
                v-model="data.wanToDelete"
              />
              <label class="form-check-label" for="wanToDelete">
                ¿Eliminar movimiento?
              </label>
            </div>

            <div class="form-check">
              <pre></pre>
              <Field
                type="checkbox"
                class="form-check-input"
                id="closed"
                name="closed"
                :value="true"
                v-model="data.closed"
              />
              <label class="form-check-label" for="closed">
                ¿Movimiento cerrado?
              </label>
            </div>

            <div v-if="data.imageUrl">
              <pre></pre>
              <a href="#" @click.prevent="showModal">Ver imagen</a>
            </div>

            <div v-if="loading" class="text-center">
              <pre></pre>

              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-if="!loading">
              <pre></pre>
              <button
                type="submit"
                class="btn btn-dark form-control"
                tabindex="4"
              >
                ENVIAR
              </button>
            </div>
          </Form>
        </div>
        <div v-else class="text-center">
          <pre></pre>

          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <Modal v-if="isModalVisible" @close="closeModal">
          <template v-slot:header>
            <div class="text-center">
              <h1>Imagen comprobante</h1>
            </div>
          </template>
          <template v-slot:body>
            <img :src="data.imageUrl" class="img-fluid" alt="..." />
          </template>
        </Modal>
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

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>

<script>
import VueSelect from 'vue-next-select';
import { mapState } from 'vuex';
import { Field, Form } from 'vee-validate';

import Modal from '../components/Modal';

import { movementsService } from '../modules/movements/movements.service';
import { movementCategoriesService } from '../modules/movement-categories/movement-categories.service';

import { getErrorMessage } from '../utils';

import { updateMovementSchema } from '../modules/movements/schemas/update-movement.schema';

export default {
  name: 'DetalledMovement',
  data () {
    return {
      data: {
        description: '',
        amount: null,
        movementCategoryId: null,
        wanToDelete: undefined,
        closed: undefined,
        imageUrl: '',
        image: null
      },
      loading: false,
      loadingFormData: true,
      movementCategories: [],
      movementSign: undefined,
      isModalVisible: false
    };
  },
  computed: mapState({
    userFromState: (state) => state.user
  }),
  components: {
    Field,
    Form,
    VueSelect,
    Modal
  },
  setup () {
    return { updateMovementSchema };
  },
  created () {
    if (isNaN(parseInt(this.$route.params.id, 10))) {
      this.$toast.error('id param is not valid.', {
        position: 'top-right',
        queue: false
      });

      return;
    }

    if (!this.userFromState?.uid) {
      return;
    }

    // loading the form data
    this.loadFormData({
      userAuthUid: this.userFromState.uid,
      id: parseInt(this.$route.params.id, 10)
    });
  },
  methods: {
    showModal () {
      this.isModalVisible = true;
    },
    closeModal () {
      this.isModalVisible = false;
    },
    async loadFormData ({ userAuthUid, id }) {
      try {
        this.loadingFormData = true;

        const currentMovement = await movementsService.getOne({
          userAuthUid,
          id
        });

        const { description, amount, closed } = currentMovement;

        this.movementCategories = await movementCategoriesService.getAll({
          sign: currentMovement?.movementType?.sign
        });

        this.data.description = description;
        this.data.amount = amount;
        this.data.closed = closed;
        this.data.movementCategoryId = currentMovement?.movementCategory?.id;
        this.data.imageUrl = currentMovement?.imageUrl;

        this.movementSign = currentMovement?.movementCategory?.sign;
      } catch (error) {
        this.$toast.error('problem loading the movements.', {
          position: 'top-right',
          queue: false
        });
        console.error(error);
      } finally {
        this.loadingFormData = false;
      }
    },
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

        const { wanToDelete } = this.data;

        if (!this.movementSign) {
          this.$toast.error('can not determinate the movement sign.', {
            position: 'top-right',
            queue: false
          });

          return;
        }

        if (wanToDelete) {
          const { message } = await movementsService.remove({
            userAuthUid: this.userFromState?.uid,
            id: parseInt(this.$route.params.id, 10)
          });

          this.$toast.success(message, {
            position: 'top-right',
            queue: false
          });

          return;
        }

        let movementId = null;

        if (this.movementSign === 1) {
          const { message, id } = await movementsService.updateIncome({
            userAuthUid: this.userFromState?.uid,
            id: parseInt(this.$route.params.id, 10),
            description: this.data.description,
            amount: parseFloat(this.data.amount),
            closed: this.data.closed,
            movementCategoryId: this.data.movementCategoryId
          });

          movementId = id;

          this.$toast.success(message, {
            position: 'top-right',
            queue: false
          });
        } else if (this.movementSign === -1) {
          const { message, id } = await movementsService.updateOutcome({
            userAuthUid: this.userFromState?.uid,
            id: parseInt(this.$route.params.id, 10),
            description: this.data.description,
            amount: parseFloat(this.data.amount),
            closed: this.data.closed,
            movementCategoryId: this.data.movementCategoryId
          });

          movementId = id;

          this.$toast.success(message, {
            position: 'top-right',
            queue: false
          });
        }

        const { image } = this.data;
        if (image) {
          const file = image[0];

          movementsService
            .uploadFile({
              userAuthUid: this.userFromState?.uid,
              id: movementId,
              file
            })
            .then(({ imageUrl }) => {
              this.data.imageUrl = imageUrl;
            })
            .catch((err) => console.error(err));
        }
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
