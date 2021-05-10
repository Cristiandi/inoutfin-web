<template>
  <div>
    <div v-if="status !== 'no-data'">
      <canvas id="outcome-per-categories-chart" width="400" height="400"></canvas>
    </div>
    <div v-else class="text-center">
      <pre></pre>
      <h1>No data</h1>
    </div>
  </div>
</template>

<script>
import {
  Chart,
  PieController,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
  ArcElement
} from 'chart.js';

// import data from './data';

Chart.register(Title, PieController, Legend, ArcElement, CategoryScale, LinearScale, Tooltip);

export default {
  name: 'OutcomePerCategoriesChart',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      ctx: null,
      byMonthChart: null,
      dataToRender: {},
      status: ''
    };
  },
  mounted () {
    this.ctx = document.getElementById('outcome-per-categories-chart');

    this.renderChart();
  },
  watch: {
    data: function (pre, cur) {
      if (this.byMonthChart) {
        this.byMonthChart.destroy();

        this.ctx = document.getElementById('outcome-per-categories-chart');

        this.renderChart();
      }
    }
  },
  methods: {
    renderChart () {
      this.dataToRender = this.parseData({ data: this.data });

      if (!this.dataToRender.categories.length) {
        this.status = 'no-data';
      } else {
        this.status = '';
      }

      this.byMonthChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: this.dataToRender.categories,
          datasets: [
            {
              label: 'Categorias',
              data: this.dataToRender.percentages,
              backgroundColor: this.determinateBackgroundColors({ data: this.dataToRender.categories })
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
              text: 'Gráfica por cátegorias'
            }
          }
        }
      });
    },
    parseData ({ data = [] }) {
      const result = data.reduce((pre, cur) => {
        return {
          categories: [...pre.categories, cur.movementCategoryName],
          percentages: [...pre.percentages, cur.percentage]
        };
      }, { categories: [], percentages: [] });

      return result;
    },
    determinateBackgroundColors ({ data = [] }) {
      const colors = {
        Emergencia: 'red',
        Fijo: 'orange',
        Ahorro: 'yellow',
        Ocio: 'green'
      };

      return data.map(item => colors[item]);
    }
  }
};
</script>
