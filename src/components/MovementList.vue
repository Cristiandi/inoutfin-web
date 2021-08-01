<template>
  <div class="container">
    <div class="row" v-for="movement in movements" :key="movement.id">
      <div class="col-1">
        <div v-if="movement.movementType.sign < 0">
          <router-link :to="'/detalled-movement/' + movement.id">
            <span class="badge rounded-pill bg-danger">M</span>
          </router-link>
        </div>
        <div v-else-if="movement.movementType.sign > 0">
          <router-link :to="'/detalled-movement/' + movement.id">
            <span class="badge rounded-pill bg-success">M</span>
          </router-link>
        </div>
      </div>
      <div class="col-1">
        <div v-if="movement.imageUrl">
          <BIconCheck width="20" height="20" />
        </div>
      </div>
      <div class="col-5">
        <p>
          <small
            ><strong>{{ movement.description }}</strong></small
          >
        </p>
      </div>
      <div class="col-5 text-end" v-tooltip="'creado el ' + movement.createdAt">
        <p>
          <small
            >{{ movement.movementType.sign > 0 ? "+" : "-"
            }}{{ movement.amount }}</small
          >
        </p>
      </div>
      <hr />
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
import { BIconCheck } from 'bootstrap-icons-vue';
import { currencyFormat, dateFormat } from '../utils';

const defMovements = [
  {
    id: 1,
    description: 'Gasto',
    amount: currencyFormat(1000),
    createdAt: dateFormat(new Date()),
    updatedAt: new Date().toISOString(),
    movementType: {
      sign: -1
    }
  },
  {
    id: 2,
    description: 'Pago',
    amount: currencyFormat(2000),
    createdAt: dateFormat(new Date()),
    updatedAt: new Date().toISOString(),
    movementType: {
      sign: 1
    }
  },
  {
    id: 2,
    description: 'Gasto',
    amount: currencyFormat(1200),
    createdAt: dateFormat(new Date()),
    updatedAt: new Date().toISOString(),
    movementType: {
      sign: -1
    }
  }
];

export default {
  name: 'MovementList',
  props: {
    movements: {
      type: Object,
      default: () => defMovements
    }
  },
  components: {
    BIconCheck
  }
};
</script>
