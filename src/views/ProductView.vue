<template>
  <div class="product-view p-4">
    <!-- Encabezado -->
    <div class="page-header mb-4">
      <h2 class="fw-bold">
        <i class="bi bi-box-seam me-2"></i>
        Gestión de Productos
      </h2>
      <p class="text-muted">Administra el inventario de tu tienda</p>
    </div>

    <!-- Barra de herramientas -->
    <div class="toolbar mb-4">
      <div class="row align-items-center">
        <div class="col-md-6 mb-3 mb-md-0">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Buscar productos..."
              v-model="searchQuery"
            >
          </div>
        </div>
        <div class="col-md-3 mb-3 mb-md-0">
          <select class="form-select" v-model="selectedCategory" @change="filterByCategory">
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="col-md-3 text-end">
          <button class="btn btn-primary" @click="showCreateModal">
            <i class="bi bi-plus-circle me-2"></i>
            Nuevo Producto
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando productos...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- Grid de productos -->
    <div v-else>
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-lg-4 col-xl-3" v-for="product in filteredProducts" :key="product.id">
          <ProductCardComponent
            :product="product"
            @view="viewProduct"
            @edit="editProduct"
            @delete="confirmDelete"
          />
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-if="filteredProducts.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <h4 class="mt-3 text-muted">No se encontraron productos</h4>
        <p class="text-muted">Intenta con otra búsqueda o categoría</p>
      </div>
    </div>

    <!-- Modal de Crear/Editar Producto -->
    <div class="modal fade" id="productModal" tabindex="-1" ref="productModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi" :class="isEditing ? 'bi-pencil' : 'bi-plus-circle'" ></i>
              {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label class="form-label">Título *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="currentProduct.title"
                  required
                >
              </div>

              <div class="mb-3">
                <label class="form-label">Precio *</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="currentProduct.price"
                    step="0.01"
                    min="0"
                    required
                  >
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea
                  class="form-control"
                  rows="4"
                  v-model="currentProduct.description"
                ></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Categoría</label>
                <select class="form-select" v-model="currentProduct.category">
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">URL de la imagen</label>
                <input
                  type="url"
                  class="form-control"
                  v-model="currentProduct.image"
                  placeholder="https://ejemplo.com/imagen.jpg"
                >
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  <span v-if="saving">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Guardando...
                  </span>
                  <span v-else>
                    <i class="bi bi-save me-2"></i>
                    Guardar
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Ver Detalles -->
    <div class="modal fade" id="viewModal" tabindex="-1" ref="viewModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-eye me-2"></i>
              Detalles del Producto
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="viewingProduct">
            <div class="row">
              <div class="col-md-6 text-center mb-3">
                <img
                  :src="viewingProduct.image"
                  :alt="viewingProduct.title"
                  class="img-fluid rounded"
                  style="max-height: 300px;"
                >
              </div>
              <div class="col-md-6">
                <h4>{{ viewingProduct.title }}</h4>
                <p class="text-muted">{{ viewingProduct.description }}</p>
                <hr>
                <p><strong>Precio:</strong> ${{ viewingProduct.price }}</p>
                <p><strong>Categoría:</strong> 
                  <span class="badge bg-primary">{{ viewingProduct.category }}</span>
                </p>
                <p><strong>ID:</strong> #{{ viewingProduct.id }}</p>
                <div v-if="viewingProduct.rating">
                  <strong>Rating:</strong>
                  <div class="d-flex align-items-center">
                    <span class="me-2">{{ viewingProduct.rating.rate }}/5</span>
                    <i
                      v-for="star in 5"
                      :key="star"
                      class="bi"
                      :class="star <= Math.round(viewingProduct.rating.rate) ? 'bi-star-fill text-warning' : 'bi-star'"
                    ></i>
                    <span class="ms-2 text-muted">({{ viewingProduct.rating.count }} reseñas)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue';
import productService from '../services/api';
import { Modal } from 'bootstrap';

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
      currentProduct: {
        title: '',
        price: 0,
        description: '',
        category: '',
        image: ''
      },
      viewingProduct: null,
      productModal: null,
      viewModal: null
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;

      // Filtrar por búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
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
    async loadProducts() {
      this.loading = true;
      this.error = null;
      try {
        this.products = await productService.getAllProducts();
      } catch (err) {
        this.error = 'Error al cargar los productos. Por favor, intente nuevamente.';
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
        this.error = 'Error al filtrar productos.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    showCreateModal() {
      this.isEditing = false;
      this.currentProduct = {
        title: '',
        price: 0,
        description: '',
        category: '',
        image: 'https://via.placeholder.com/300'
      };
      this.getModal('productModal').show();
    },

    editProduct(product) {
      this.isEditing = true;
      this.currentProduct = { ...product };
      this.getModal('productModal').show();
    },

    viewProduct(product) {
      this.viewingProduct = product;
      this.getModal('viewModal').show();
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
          alert('Producto actualizado exitosamente (simulado)');
        } else {
          const newProduct = await productService.createProduct(this.currentProduct);
          this.products.unshift({ ...this.currentProduct, id: newProduct.id });
          alert('Producto creado exitosamente (simulado)');
        }
        this.getModal('productModal').hide();
      } catch (err) {
        alert('Error al guardar el producto');
        console.error(err);
      } finally {
        this.saving = false;
      }
    },

    async confirmDelete(product) {
      if (confirm(`¿Está seguro de eliminar "${product.title}"?`)) {
        try {
          await productService.deleteProduct(product.id);
          this.products = this.products.filter(p => p.id !== product.id);
          alert('Producto eliminado exitosamente (simulado)');
        } catch (err) {
          alert('Error al eliminar el producto');
          console.error(err);
        }
      }
    },

    getModal(ref) {
      if (!this[ref]) {
        const element = this.$refs[ref];
        this[ref] = new Modal(element);
      }
      return this[ref];
    }
  }
}
</script>

<style scoped>
.product-view {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.toolbar {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.modal-content {
  border: none;
  border-radius: 15px;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: none;
}

.modal-header .btn-close {
  filter: brightness(0) invert(1);
}
</style>

