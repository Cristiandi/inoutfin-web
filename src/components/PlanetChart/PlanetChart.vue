<template>
  <div>
    <canvas id="planet-chart" width="400" height="400">></canvas>
  </div>
</template>

<script>
import {
  Chart,
  LineController,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement
} from 'chart.js';

import planetChartData from './planet-data.js';

Chart.register(LineController, LinearScale, CategoryScale, PointElement, LineElement);

export default {
  name: 'PlanetChart',
  data () {
    return {
      planetChart: null,
      planetChartData
    };
  },
  mounted () {
    const ctx = document.getElementById('planet-chart');

    this.planetChart = new Chart(ctx, this.planetChartData);

    // console.log('chart id', this.planetChart.id);
  },
  beforeUnmount () {
    // console.log('leaving');
    this.planetChart?.destroy();
  }
};
</script>
