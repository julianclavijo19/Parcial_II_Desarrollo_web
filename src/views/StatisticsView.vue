<template>
  <div class="statistics-view">
    <div class="page-header">
      <h1>Estadísticas</h1>
      <p>Análisis detallado de ventas, productos y clientes</p>
    </div>

    <!-- Time Selector -->
    <div class="time-selector-container">
      <label for="time-select">
        <i class="bi bi-calendar"></i>
        Período:
      </label>
      <select 
        id="time-select"
        v-model="selectedTime" 
        @change="onTimeChange"
        class="time-select"
      >
        <option value="september">Septiembre 2025</option>
        <option value="october">Octubre 2025</option>
      </select>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid" :key="selectedTime" :class="{ 'animating': isAnimating }">
      <!-- Sales Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>
            <i class="bi bi-currency-dollar"></i>
            Ventas Diarias
          </h3>
          <span class="chart-value">{{ formatCurrency(currentData.sales.total) }}</span>
        </div>
        <div class="chart-container">
          <apexchart
            type="line"
            height="280"
            :options="salesChartOptions"
            :series="currentData.sales.series"
          ></apexchart>
        </div>
      </div>

      <!-- Products Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>
            <i class="bi bi-box-seam"></i>
            Productos Vendidos
          </h3>
          <span class="chart-value">{{ currentData.products.total }}</span>
        </div>
        <div class="chart-container">
          <apexchart
            type="bar"
            height="280"
            :options="productsChartOptions"
            :series="currentData.products.series"
          ></apexchart>
        </div>
      </div>

      <!-- Clients Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>
            <i class="bi bi-people"></i>
            Nuevos Clientes
          </h3>
          <span class="chart-value">{{ currentData.clients.total }}</span>
        </div>
        <div class="chart-container">
          <apexchart
            type="area"
            height="280"
            :options="clientsChartOptions"
            :series="currentData.clients.series"
          ></apexchart>
        </div>
      </div>

      <!-- Revenue by Category -->
      <div class="chart-card chart-card-wide">
        <div class="chart-header">
          <h3>
            <i class="bi bi-pie-chart"></i>
            Ingresos por Categoría
          </h3>
        </div>
        <div class="chart-container chart-container-pie">
          <apexchart
            type="donut"
            height="350"
            :options="categoriesChartOptions"
            :series="currentData.categories.series"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import { formatCurrency } from '../utils/formatters';
import { useStatistics } from '../composables/useStatistics';

export default {
  name: 'StatisticsView',
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      selectedTime: 'september',
      isAnimating: false,
      // Generar datos realistas para septiembre (30 días) con variación más natural
      septemberData: {
        sales: {
          total: 1425000,
          series: [{
            name: 'Ventas Diarias',
            data: [
              42500, 43800, 41200, 44800, 46200, 48500, 52500, 44200, 45200, 46800,
              47500, 49200, 51500, 53500, 55200, 48200, 49800, 51200, 52800, 54500,
              56200, 58200, 49800, 50800, 51800, 53200, 54800, 56300, 57800, 59200
            ]
          }]
        },
        products: {
          total: 1245,
          series: [{
            name: 'Productos Vendidos',
            data: [
              38, 42, 36, 44, 48, 52, 58, 41, 43, 46,
              47, 49, 51, 54, 55, 48, 50, 52, 54, 56,
              58, 60, 50, 52, 53, 54, 55, 57, 58, 59
            ]
          }]
        },
        clients: {
          total: 342,
          series: [{
            name: 'Nuevos Clientes',
            data: [
              10, 12, 9, 14, 15, 16, 18, 11, 12, 13,
              14, 15, 16, 17, 18, 14, 15, 16, 17, 18,
              19, 20, 15, 16, 17, 18, 19, 20, 21, 22
            ]
          }]
        },
        categories: {
          series: [485000, 420000, 285000, 235000],
          labels: ['Laptops', 'Smartphones', 'Tablets', 'Accesorios']
        }
      },
      // Generar datos realistas para octubre (31 días) con tendencia ascendente
      octoberData: {
        sales: {
          total: 1580000,
          series: [{
            name: 'Ventas Diarias',
            data: [
              46200, 47800, 49200, 51200, 53200, 55200, 57200, 48200, 49800, 51200,
              52800, 54200, 56200, 58200, 60200, 52200, 53800, 55200, 56800, 58200,
              60200, 62200, 54200, 55800, 57200, 58800, 60200, 61800, 63200, 64800, 66200
            ]
          }]
        },
        products: {
          total: 1380,
          series: [{
            name: 'Productos Vendidos',
            data: [
              42, 44, 46, 48, 50, 52, 54, 46, 48, 50,
              52, 54, 56, 58, 60, 52, 54, 56, 58, 60,
              62, 64, 56, 58, 60, 62, 64, 66, 68, 70, 72
            ]
          }]
        },
        clients: {
          total: 385,
          series: [{
            name: 'Nuevos Clientes',
            data: [
              12, 13, 14, 15, 16, 17, 18, 14, 15, 16,
              17, 18, 19, 20, 21, 17, 18, 19, 20, 21,
              22, 23, 19, 20, 21, 22, 23, 24, 25, 26, 27
            ]
          }]
        },
        categories: {
          series: [540000, 470000, 320000, 250000],
          labels: ['Laptops', 'Smartphones', 'Tablets', 'Accesorios']
        }
      }
    };
  },
  computed: {
    currentData() {
      return this.selectedTime === 'september' ? this.septemberData : this.octoberData;
    },
    // Obtener las etiquetas del mes actual
    monthLabels() {
      const days = this.selectedTime === 'september' ? 30 : 31;
      return Array.from({ length: days }, (_, i) => {
        return (i + 1).toString();
      });
    },
    // Opciones para gráfica de ventas
    salesChartOptions() {
      return {
        chart: {
          type: 'line',
          height: 280,
          toolbar: { show: false },
          zoom: { enabled: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        colors: ['#6366f1'],
        stroke: {
          curve: 'smooth',
          width: 3
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: ['#818cf8'],
            inverseColors: false,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 100]
          }
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          borderColor: '#e9ecef',
          strokeDashArray: 3,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } }
        },
        xaxis: {
          categories: this.monthLabels,
          labels: {
            style: { colors: '#6c757d', fontSize: '10px' },
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            maxHeight: 60
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
          tickAmount: 10
        },
        yaxis: {
          labels: {
            style: { colors: '#6c757d', fontSize: '11px' },
            formatter: (value) => {
              return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value);
            }
          }
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (value) => {
              return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(value);
            }
          }
        },
        markers: {
          size: 4,
          hover: { size: 6 }
        }
      };
    },
    // Opciones para gráfica de productos
    productsChartOptions() {
      return {
        chart: {
          type: 'bar',
          height: 280,
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        colors: ['#10b981'],
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%',
            dataLabels: { position: 'top' }
          }
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          borderColor: '#e9ecef',
          strokeDashArray: 3,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } }
        },
        xaxis: {
          categories: this.monthLabels,
          labels: {
            style: { colors: '#6c757d', fontSize: '10px' },
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            maxHeight: 60
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
          tickAmount: 10
        },
        yaxis: {
          labels: {
            style: { colors: '#6c757d', fontSize: '11px' }
          }
        },
        tooltip: {
          theme: 'light'
        },
        fill: {
          opacity: 0.8
        }
      };
    },
    // Opciones para gráfica de clientes
    clientsChartOptions() {
      return {
        chart: {
          type: 'area',
          height: 280,
          toolbar: { show: false },
          zoom: { enabled: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        colors: ['#3b82f6'],
        stroke: {
          curve: 'smooth',
          width: 3
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.5,
            gradientToColors: ['#60a5fa'],
            inverseColors: false,
            opacityFrom: 0.6,
            opacityTo: 0.2,
            stops: [0, 100]
          }
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          borderColor: '#e9ecef',
          strokeDashArray: 3,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } }
        },
        xaxis: {
          categories: this.monthLabels,
          labels: {
            style: { colors: '#6c757d', fontSize: '10px' },
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            maxHeight: 60
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
          tickAmount: 10
        },
        yaxis: {
          labels: {
            style: { colors: '#6c757d', fontSize: '11px' }
          }
        },
        tooltip: {
          theme: 'light'
        },
        markers: {
          size: 4,
          hover: { size: 6 }
        }
      };
    },
    // Opciones para gráfica de categorías
    categoriesChartOptions() {
      const totalSales = this.currentData.sales.total;
      return {
        chart: {
          type: 'donut',
          height: 350,
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b'],
        labels: this.currentData.categories.labels,
        legend: {
          position: 'bottom',
          fontSize: '14px',
          labels: {
            colors: '#495057'
          },
          itemMargin: {
            horizontal: 10,
            vertical: 5
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => {
            return val.toFixed(1) + '%';
          },
          style: {
            fontSize: '12px',
            fontWeight: 600,
            colors: ['#ffffff']
          },
          dropShadow: {
            enabled: false
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#212529'
                },
                value: {
                  show: true,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#212529',
                  formatter: (val) => {
                    return new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(val);
                  }
                },
                total: {
                  show: true,
                  label: 'Total',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#6c757d',
                  formatter: () => {
                    return new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(totalSales);
                  }
                }
              }
            }
          }
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (val, { seriesIndex }) => {
              const labels = this.currentData.categories.labels;
              const total = this.currentData.categories.series.reduce((a, b) => a + b, 0);
              const percentage = ((val / total) * 100).toFixed(1);
              return `${labels[seriesIndex]}: ${new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(val)} (${percentage}%)`;
            }
          }
        },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };
    }
  },
  methods: {
    onTimeChange() {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 400);
    },
    formatCurrency
  }
};
</script>

<style scoped>
.statistics-view {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-out;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.03em;
}

.page-header p {
  color: #6c757d;
  font-size: 1.125rem;
  margin: 0;
}

/* Time Selector */
.time-selector-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #ffffff;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.time-selector-container label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #212529;
}

.time-selector-container label i {
  color: #6366f1;
  font-size: 1.125rem;
}

.time-select {
  flex: 1;
  max-width: 300px;
  padding: 0.75rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  font-size: 0.9375rem;
  background: #ffffff;
  color: #212529;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236366f1' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.time-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.time-select:hover {
  border-color: #6366f1;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  transition: opacity 0.3s ease;
}

.charts-grid.animating {
  opacity: 0.5;
}

.chart-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.chart-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.chart-card-wide {
  grid-column: span 3;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f3f5;
}

.chart-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-header h3 i {
  color: #6366f1;
  font-size: 1.125rem;
}

.chart-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #212529;
}

.chart-container {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container-pie {
  height: 400px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Charts */
@media (max-width: 1400px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-card-wide {
    grid-column: span 2;
  }
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card-wide {
    grid-column: span 1;
  }
  
  .time-selector-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .time-select {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .statistics-view {
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .chart-container {
    height: 280px;
  }

  .chart-container-pie {
    height: 320px;
  }
}
</style>
