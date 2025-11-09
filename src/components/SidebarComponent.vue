<template>
  <aside class="sidebar-minimal">
    <nav class="sidebar-nav">
      <router-link 
        to="/dashboard" 
        class="nav-item"
        exact-active-class="active"
      >
        <i class="bi bi-grid-1x2"></i>
        <span>Dashboard</span>
      </router-link>
      
      <router-link 
        to="/dashboard/productos" 
        class="nav-item"
        active-class="active"
      >
        <i class="bi bi-box-seam"></i>
        <span>Productos</span>
      </router-link>

      <router-link 
        to="/dashboard/categorias" 
        class="nav-item"
        active-class="active"
      >
        <i class="bi bi-tags"></i>
        <span>Categorías</span>
      </router-link>

      <router-link 
        to="/dashboard/clientes" 
        class="nav-item"
        active-class="active"
      >
        <i class="bi bi-people"></i>
        <span>Clientes</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'SidebarComponent',
  props: {
    currentUser: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
.sidebar-minimal {
  position: fixed;
  left: 0;
  top: 60px;
  width: 240px;
  height: calc(100vh - 60px);
  background: #000000;
  border-right: 1px solid #1a1a1a;
  padding: 1.5rem 0;
  z-index: 900;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #999;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 0.9375rem;
  font-weight: 500;
}

.nav-item i {
  font-size: 1.125rem;
  width: 20px;
  text-align: center;
}

.nav-item:hover {
  background: #1a1a1a;
  color: #fff;
}

.nav-item.active {
  background: #00ff88;
  color: #000;
}

.nav-item.active i {
  color: #000;
}

@media (max-width: 768px) {
  .sidebar-minimal {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  
  .sidebar-minimal.show {
    transform: translateX(0);
  }
}
</style>
