<template>
  <div class="product-card-minimal">
    <div class="product-image">
      <img 
        :src="product.thumbnail || product.image" 
        :alt="product.title" 
        @error="handleImageError"
      >
      <span class="product-category">{{ product.category }}</span>
    </div>

    <div class="product-info">
      <h3 class="product-title">{{ truncatedTitle }}</h3>
      <p class="product-price">${{ product.price }}</p>
      
      <div class="product-meta">
        <div class="rating" v-if="product.rating">
          <i class="bi bi-star-fill"></i>
          <span>{{ product.rating }}</span>
        </div>
        <span class="stock" :class="stockClass">
          {{ product.stock ? `Stock: ${product.stock}` : 'Disponible' }}
        </span>
      </div>
    </div>

    <div class="product-actions">
      <button class="action-btn" @click="$emit('view', product)" title="Ver">
        <i class="bi bi-eye"></i>
      </button>
      <button class="action-btn" @click="$emit('edit', product)" title="Editar">
        <i class="bi bi-pencil"></i>
      </button>
      <button class="action-btn danger" @click="$emit('delete', product)" title="Eliminar">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCardComponent',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['view', 'edit', 'delete'],
  computed: {
    truncatedTitle() {
      const maxLength = 50;
      if (!this.product.title) return '';
      
      return this.product.title.length > maxLength
        ? this.product.title.substring(0, maxLength) + '...'
        : this.product.title;
    },
    stockClass() {
      if (!this.product.stock) return '';
      return this.product.stock > 10 ? 'in-stock' : 'low-stock';
    }
  },
  methods: {
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/300x300/000000/00ff88?text=Sin+Imagen';
    }
  }
}
</script>

<style scoped>
.product-card-minimal {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.product-card-minimal:hover {
  border-color: #00ff88;
  transform: translateY(-4px);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-category {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 255, 136, 0.9);
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.product-info {
  padding: 1rem;
  flex: 1;
}

.product-title {
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  min-height: 2.5rem;
  line-height: 1.3;
}

.product-price {
  color: #00ff88;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffc107;
  font-size: 0.875rem;
}

.rating i {
  font-size: 1rem;
}

.stock {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.stock.in-stock {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
}

.stock.low-stock {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.product-actions {
  display: flex;
  border-top: 1px solid #1a1a1a;
}

.action-btn {
  flex: 1;
  background: transparent;
  border: none;
  border-right: 1px solid #1a1a1a;
  padding: 0.75rem;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.action-btn:last-child {
  border-right: none;
}

.action-btn:hover {
  background: #1a1a1a;
  color: #00ff88;
}

.action-btn.danger:hover {
  background: #dc3545;
  color: #fff;
}
</style>
