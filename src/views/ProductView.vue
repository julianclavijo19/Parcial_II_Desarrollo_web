<template>
  <div class="products-minimal">
    <div class="page-header">
      <h1>Productos</h1>
      <button class="btn-primary" @click="showCreateModal">
        <i class="bi bi-plus-lg"></i>
        Nuevo Producto
      </button>
    </div>

    <div class="toolbar">
      <input
        type="text"
        class="search-input"
        placeholder="Buscar productos..."
        v-model="searchQuery"
      >
      <select class="select-input" v-model="selectedCategory" @change="filterByCategory">
        <option value="">Todas las categorías</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner-large"></div>
      <p>Cargando productos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="bi bi-exclamation-triangle"></i>
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <div class="products-grid">
        <ProductCardComponent
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @view="viewProduct"
          @edit="editProduct"
          @delete="confirmDelete"
        />
      </div>

      <div v-if="filteredProducts.length === 0" class="empty-state">
        <i class="bi bi-inbox"></i>
        <h3>No se encontraron productos</h3>
        <p>Intenta con otra búsqueda o categoría</p>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
          <button class="btn-close" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-body">
          <div class="form-group">
            <label>Título *</label>
            <input type="text" v-model="currentProduct.title" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Precio *</label>
              <input 
                type="number" 
                v-model="currentProduct.price" 
                step="0.01" 
                min="0" 
                required
              >
            </div>

            <div class="form-group">
              <label>Stock</label>
              <input 
                type="number" 
                v-model="currentProduct.stock" 
                min="0"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="currentProduct.description" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Categoría</label>
            <select v-model="currentProduct.category">
              <option value="">Seleccionar categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>URL de la imagen</label>
            <input type="url" v-model="currentProduct.thumbnail" placeholder="https://...">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ver -->
    <div class="modal-overlay" v-if="showViewModal" @click.self="closeViewModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Detalles del Producto</h2>
          <button class="btn-close" @click="closeViewModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body" v-if="viewingProduct">
          <div class="product-detail">
            <img :src="viewingProduct.thumbnail || viewingProduct.image" :alt="viewingProduct.title">
            <div class="detail-info">
              <h3>{{ viewingProduct.title }}</h3>
              <p class="description">{{ viewingProduct.description }}</p>
              
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Precio:</span>
                  <span class="value">${{ viewingProduct.price }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Categoría:</span>
                  <span class="value">{{ viewingProduct.category }}</span>
                </div>
                <div class="detail-item" v-if="viewingProduct.stock">
                  <span class="label">Stock:</span>
                  <span class="value">{{ viewingProduct.stock }} unidades</span>
                </div>
                <div class="detail-item" v-if="viewingProduct.rating">
                  <span class="label">Rating:</span>
                  <span class="value">
                    <i class="bi bi-star-fill text-warning"></i>
                    {{ viewingProduct.rating }}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue';
import productService from '../services/api';

export default {
  name: 'ProductView',
  components: {
    ProductCardComponent
  },
  data() {
    return {
      products: [],
      categories: [],
      loading: false,
      error: null,
      searchQuery: '',
      selectedCategory: '',
      isEditing: false,
      saving: false,
      showModal: false,
      showViewModal: false,
      currentProduct: this.getEmptyProduct(),
      viewingProduct: null
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
        );
      }

      return filtered;
    }
  },
  async mounted() {
    await this.loadProducts();
    await this.loadCategories();
  },
  methods: {
    getEmptyProduct() {
      return {
        title: '',
        price: 0,
        description: '',
        category: '',
        thumbnail: '',
        stock: 0
      };
    },

    async loadProducts() {
      this.loading = true;
      this.error = null;
      try {
        this.products = await productService.getAllProducts();
      } catch (err) {
        this.error = 'Error al cargar los productos';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async loadCategories() {
      try {
        this.categories = await productService.getCategories();
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    },

    async filterByCategory() {
      if (!this.selectedCategory) {
        await this.loadProducts();
        return;
      }

      this.loading = true;
      try {
        this.products = await productService.getProductsByCategory(this.selectedCategory);
      } catch (err) {
        this.error = 'Error al filtrar productos';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    showCreateModal() {
      this.isEditing = false;
      this.currentProduct = this.getEmptyProduct();
      this.showModal = true;
    },

    editProduct(product) {
      this.isEditing = true;
      this.currentProduct = { ...product };
      this.showModal = true;
    },

    viewProduct(product) {
      this.viewingProduct = product;
      this.showViewModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    closeViewModal() {
      this.showViewModal = false;
    },

    async saveProduct() {
      this.saving = true;
      try {
        if (this.isEditing) {
          await productService.updateProduct(this.currentProduct.id, this.currentProduct);
          const index = this.products.findIndex(p => p.id === this.currentProduct.id);
          if (index !== -1) {
            this.products[index] = { ...this.currentProduct };
          }
        } else {
          const newProduct = await productService.createProduct(this.currentProduct);
          this.products.unshift({ ...this.currentProduct, id: newProduct.id });
        }
        this.closeModal();
      } catch (err) {
        console.error(err);
        alert('Error al guardar el producto');
      } finally {
        this.saving = false;
      }
    },

    async confirmDelete(product) {
      if (confirm(`¿Eliminar "${product.title}"?`)) {
        try {
          await productService.deleteProduct(product.id);
          this.products = this.products.filter(p => p.id !== product.id);
        } catch (err) {
          console.error(err);
          alert('Error al eliminar el producto');
        }
      }
    }
  }
}
</script>

<style scoped>
.products-minimal {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input,
.select-input {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.search-input {
  flex: 1;
}

.select-input {
  min-width: 200px;
}

.search-input:focus,
.select-input:focus {
  outline: none;
  border-color: #00ff88;
}

.btn-primary {
  background: #00ff88;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #00e67a;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: #999;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #666;
  color: #fff;
}

.loading,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid #1a1a1a;
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p,
.error-state p,
.empty-state p {
  color: #666;
  margin: 0.5rem 0 0 0;
}

.error-state i,
.empty-state i {
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #fff;
  font-size: 1.25rem;
  margin: 1rem 0 0.5rem 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #fff;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  color: #999;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  background: #000;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #00ff88;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.product-detail {
  display: grid;
  gap: 1.5rem;
}

.product-detail img {
  width: 100%;
  border-radius: 8px;
}

.detail-info h3 {
  color: #fff;
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
}

.description {
  color: #999;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.detail-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #000;
  border-radius: 8px;
}

.detail-item .label {
  color: #666;
  font-size: 0.875rem;
}

.detail-item .value {
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .products-minimal {
    padding: 1.5rem;
  }
  
  .toolbar {
    flex-direction: column;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
