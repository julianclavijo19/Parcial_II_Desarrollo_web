<template>
  <div class="category-view p-4">
    <div class="page-header mb-4">
      <h2 class="fw-bold">
        <i class="bi bi-tags me-2"></i>
        Categorías de Productos
      </h2>
      <p class="text-muted">Explora productos por categoría</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando categorías...</p>
    </div>

    <!-- Categorías -->
    <div v-else class="row g-4">
      <div class="col-md-6 col-lg-4" v-for="(category, index) in categories" :key="category">
        <div class="category-card" :class="`category-${index}`" @click="goToProducts(category)">
          <div class="category-icon">
            <i class="bi" :class="getCategoryIcon(category)"></i>
          </div>
          <h4 class="category-name">{{ formatCategoryName(category) }}</h4>
          <p class="text-muted mb-0">Ver productos</p>
          <i class="bi bi-arrow-right-circle category-arrow"></i>
        </div>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="info-section mt-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">
            <i class="bi bi-info-circle me-2"></i>
            Sobre las Categorías
          </h5>
          <p class="card-text">
            Las categorías están obtenidas desde la API externa FakeStore API.
            Cada categoría contiene múltiples productos relacionados que puedes explorar
            haciendo clic en la tarjeta correspondiente.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productService from '../services/api';

export default {
  name: 'CategoryView',
  data() {
    return {
      categories: [],
      loading: false
    };
  },
  async mounted() {
    await this.loadCategories();
  },
  methods: {
    async loadCategories() {
      this.loading = true;
      try {
        this.categories = await productService.getCategories();
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      } finally {
        this.loading = false;
      }
    },

    formatCategoryName(category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    },

    getCategoryIcon(category) {
      const icons = {
        'electronics': 'bi-cpu',
        'jewelery': 'bi-gem',
        "men's clothing": 'bi-person',
        "women's clothing": 'bi-bag-heart'
      };
      return icons[category] || 'bi-tag';
    },

    goToProducts(category) {
      this.$router.push(`/dashboard/productos?category=${category}`);
    }
  }
}
</script>

<style scoped>
.category-view {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.page-header {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.category-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.category-card:hover::before {
  left: 100%;
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.category-card.category-0 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.category-card.category-1 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.category-card.category-2 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.category-card.category-3 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.category-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.category-name {
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: capitalize;
}

.category-arrow {
  font-size: 2rem;
  margin-top: 15px;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.category-card:hover .category-arrow {
  opacity: 1;
  transform: translateX(10px);
}

.info-section .card {
  border: none;
  border-radius: 10px;
}
</style>

