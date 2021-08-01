<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <h1 class="text-center">Ingresos vs Egresos</h1>

        <div v-if="!loading">
          <ByMonthChart :data="data"/>
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

</style>

<script>
import { movementsService } from '../modules/movements/movements.service';
import { mapState } from 'vuex';

import ByMonthChart from '../components/ByMonthChart/ByMonthChart.vue';

export default {
  name: 'ChartByMonth',
  data () {
    return {
      data: [],
      loading: true
    };
  },
  components: {
    ByMonthChart
  },
  computed: mapState({
    userFromState: (state) => state.user
  }),
  created () {
    if (!this.userFromState?.uid) {
      return;
    }

    this.loadData({ userAuthUid: this.userFromState?.uid });
  },
  methods: {
    async loadData ({ userAuthUid }) {
      try {
        this.loading = true;
        this.data = await movementsService.getIncomeVsOutcome({ userAuthUid });
      } catch (error) {
        this.$toast.error('problem loading the data.', {
          position: 'top-right',
          queue: false
        });
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
