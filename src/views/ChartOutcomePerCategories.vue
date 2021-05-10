<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <h1 class="text-center">Egresos</h1>

        <div>
          <Form
            @submit="onSubmit"
            v-slot="{ errors }"
            :validation-schema="getOutcomePerCategoriesSchema"
          >
          <div class="row">
            <div class="col-6">
              <div>
                <div class="row">
                  <div class="col-6">
                    <label for="startDate" class="fw-bold">Fecha</label>
                  </div>
                  <div class="col-6 text-end">
                    <small for="startDate" class="text-muted fw-light">
                      Inicial
                    </small>
                  </div>
                </div>
                <div>
                  <Field
                    type="date"
                    class="form-control"
                    id="startDate"
                    name="startDate"
                    as="input"
                    v-model="data.startDate"
                  />
                  <small class="validation">{{ errors.startDate }}</small>
                </div>
              </div>
            </div>

            <div class="col-6">
              <div>
                <div class="row">
                  <div class="col-6">
                    <label for="endDate" class="fw-bold">Fecha</label>
                  </div>
                  <div class="col-6 text-end">
                    <small for="endDate" class="text-muted fw-light">
                      Final
                    </small>
                  </div>
                </div>
                <div>
                  <Field
                    type="date"
                    class="form-control"
                    id="endDate"
                    name="endDate"
                    as="input"
                    v-model="data.endDate"
                  />
                  <small class="validation">{{ errors.endDate }}</small>
                </div>
              </div>
            </div>

            <div v-if="!loading">
              <pre></pre>
              <button
                type="submit"
                class="btn btn-dark form-control"
                tabindex="4"
              >
                VER
              </button>
            </div>
          </div>
          </Form>
        </div>

        <div v-if="!loading">
          <OutcomePerCategoriesChart :data="data.data" />
        </div>
        <div v-else class="text-center">
          <pre></pre>

          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div>
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
</style>

<script>
import { Field, Form } from 'vee-validate';
import { mapState } from 'vuex';

import { movementsService } from '../modules/movements/movements.service';

import OutcomePerCategoriesChart from '../components/OutcomePerCategoriesChart/OutcomePerCategoriesChart.vue';

import { getErrorMessage } from '../utils';

import { getOutcomePerCategoriesSchema } from '../modules/movements/schemas/get-outcome-per-categories.schema';

export default {
  name: 'ChartOutcomePerCategories',
  data () {
    return {
      data: {
        startDate: '',
        endDate: '',
        data: undefined
      },
      loading: false
    };
  },
  components: {
    OutcomePerCategoriesChart,
    Field,
    Form
  },
  computed: mapState({
    userFromState: (state) => state.user
  }),
  setup () {
    return { getOutcomePerCategoriesSchema };
  },
  methods: {
    async onSubmit (values, { resetForm }) {
      try {
        this.loading = true;

        const { startDate, endDate } = this.data;

        const result = await movementsService.getOutcomePerCategories({
          userAuthUid: this.userFromState?.uid,
          startDate,
          endDate
        });

        this.data.data = result;

        this.loading = true;
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
