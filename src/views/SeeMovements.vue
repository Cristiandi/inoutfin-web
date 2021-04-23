<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <router-link to="/home" class="link-dark">
          <BIconArrowLeft width="32" height="32" />
        </router-link>

        <h1 class="text-center">Movimientos</h1>
        <div v-if="!loadingMovements" class="row">
          <MovementList :movements="movements" />
        </div>
        <div v-else class="text-center">
          <pre></pre>

          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
import { BIconArrowLeft } from 'bootstrap-icons-vue';
import { mapState } from 'vuex';

import { movementsService } from '../modules/movements/movements.service';

import MovementList from '../components/MovementList.vue';

export default {
  name: 'SeeMovements',
  data () {
    return {
      loadingMovements: true,
      movements: []
    };
  },
  components: {
    BIconArrowLeft,
    MovementList
  },
  computed: mapState({
    userFromState: (state) => state.user
  }),
  created () {
    if (!this.userFromState.uid) {
      return;
    }

    // loading the movements
    this.loadMovements({ authUid: this.userFromState.uid });
  },
  methods: {
    async loadMovements ({ authUid }) {
      try {
        this.loadingMovements = true;

        const movements = await movementsService.getAll({
          userAuthUid: authUid,
          limit: 0,
          skip: 0
        });

        this.movements = movements;
      } catch (error) {
        this.$toast.error('problem loading the movements.', {
          position: 'top-right',
          queue: false
        });
        console.error(error);
      } finally {
        this.loadingMovements = false;
      }
    }
  }
};
</script>
