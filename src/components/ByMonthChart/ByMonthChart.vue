<template>
  <div>
    <canvas id="by-month-chart" width="400" height="400">></canvas>
  </div>
</template>

<script>
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title
} from 'chart.js';

import data from './data';

Chart.register(Title, BarController, Legend, BarElement, CategoryScale, LinearScale, Tooltip);

export default {
  name: 'ByMonthChart',
  props: {
    data: {
      type: Object,
      default: () => data
    }
  },
  data () {
    return {
      byMonthChart: null,
      dataToRender: {}
    };
  },
  mounted () {
    const ctx = document.getElementById('by-month-chart');

    this.dataToRender = this.parseData({ data: this.data });

    this.byMonthChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.dataToRender.months,
        datasets: [
          {
            label: 'Ingresos',
            data: this.dataToRender.incomes,
            backgroundColor: 'rgba(34, 204, 0, 0.5',
            borderColor: '#147500',
            borderWidth: 1
          },
          {
            label: 'Egresos',
            data: this.dataToRender.outcomes,
            backgroundColor: 'rgba(249, 144, 144, .5)',
            borderColor: '#e51515',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Gráfica por mes'
          }
        }
      }
    });

    // console.log('chart id', this.byMonthChart.id);
  },
  methods: {
    parseData ({ data = [] }) {
      const result = data.reduce((pre, cur) => {
        return {
          months: [...pre.months, cur.month],
          incomes: [...pre.incomes, cur.income],
          outcomes: [...pre.outcomes, cur.outcome]
        };
      }, { months: [], incomes: [], outcomes: [] });

      return result;
    }
  }
};
</script>
