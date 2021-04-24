<template>
  <div class="container">
    <div class="row">
      <div
        class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2"
      >
        <pre></pre>

        <h1>Ey {{ firstName }}</h1>

        <div class="row">
          <div class="col-10 offset-1 balance-card">
            <div class="row">
              <div class="col-12">
                <pre></pre>
                <h5>Tú balance</h5>
              </div>
              <div v-if="!loadingBalanceInfo" class="col-12">
                <h2 class="text-center">{{ balanceAmount }}</h2>
              </div>
              <div v-else class="text-center">
                <div class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>

        <pre></pre>

        <h5><strong>Tús movimientos...</strong></h5>
        <div v-if="!loadingMovements" class="row">
          <MovementList :movements="movements" />
        </div>
        <div v-else class="text-center">
          <pre></pre>

          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-if="movements[4]" class="text-end">
          <router-link to="/see-movements">
            Ver todos...
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.balance-card {
  background-image: url("../assets/background_one.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
  height: 25vh;
  border-radius: 10px;
  transform: rotate(0deg);
}

.balance-card h2, .balance-card h5 {
  color: white;
}

.balance-card hr {
  color: white;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>

<script>
import { mapState } from 'vuex';

import { movementsService } from '../modules/movements/movements.service';

import { currencyFormat } from '../utils';

import MovementList from '../components/MovementList.vue';

export default {
  name: 'Home',
  data () {
    return {
      firstName: '',
      balanceAmount: currencyFormat(0),
      loadingBalanceInfo: true,
      movements: [],
      loadingMovements: true
    };
  },
  components: {
    MovementList
  },
  computed: mapState({
    userFromState: (state) => state.user
  }),
  watch: {
    userFromState: function () {
      if (!this.userFromState?.uid) {
        return;
      }

      // loading the balance info
      this.loadBalanceInfo({ authUid: this.userFromState.uid });

      // loading the movements
      this.loadMovements({ authUid: this.userFromState.uid });

      this.getFirstName({ fullName: this.userFromState.fullName });
    }
  },
  created () {
    if (!this.userFromState?.uid) {
      return;
    }

    // loading the balance info
    this.loadBalanceInfo({ authUid: this.userFromState.uid });

    // loading the movements
    this.loadMovements({ authUid: this.userFromState.uid });

    this.getFirstName({ fullName: this.userFromState.fullName });
  },
  methods: {
    getFirstName ({ fullName = '' }) {
      this.firstName = fullName.trim().split(' ')[0];
    },
    async loadBalanceInfo ({ authUid }) {
      try {
        this.loadingBalanceInfo = true;

        const { amount } = await movementsService.getBalanceResume({
          userAuthUid: authUid
        });
        this.balanceAmount = currencyFormat(amount);
      } catch (error) {
        this.$toast.error('problem loading the balance info.', {
          position: 'top-right',
          queue: false
        });
        console.error(error);
      } finally {
        this.loadingBalanceInfo = false;
      }
    },
    async loadMovements ({ authUid }) {
      try {
        this.loadingMovements = true;

        const movements = await movementsService.getAll({
          userAuthUid: authUid,
          limit: 5,
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
