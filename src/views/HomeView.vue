<template>
  <div class="home-minimal">
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Bienvenido, {{ currentUser?.nombre }}</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon products">
          <i class="bi bi-box-seam"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.totalProducts }}</h3>
          <p>Productos</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon categories">
          <i class="bi bi-tags"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.categories }}</h3>
          <p>Categorías</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon clients">
          <i class="bi bi-people"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.clients }}</h3>
          <p>Clientes</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue">
          <i class="bi bi-graph-up"></i>
        </div>
        <div class="stat-info">
          <h3>${{ stats.revenue }}</h3>
          <p>Ventas del Mes</p>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="card">
        <div class="card-header">
          <h2>Accesos Rápidos</h2>
        </div>
        <div class="card-body">
          <router-link to="/dashboard/productos" class="quick-action">
            <i class="bi bi-box-seam"></i>
            <span>Gestionar Productos</span>
            <i class="bi bi-arrow-right"></i>
          </router-link>
          <router-link to="/dashboard/categorias" class="quick-action">
            <i class="bi bi-tags"></i>
            <span>Ver Categorías</span>
            <i class="bi bi-arrow-right"></i>
          </router-link>
          <router-link to="/dashboard/clientes" class="quick-action">
            <i class="bi bi-people"></i>
            <span>Administrar Clientes</span>
            <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Información del Sistema</h2>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="info-label">Usuario:</span>
            <span class="info-value">{{ currentUser?.username }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ currentUser?.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Rol:</span>
            <span class="info-badge">{{ currentUser?.rol }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">API:</span>
            <span class="info-value">DummyJSON</span>
          </div>
          <div class="info-row">
            <span class="info-label">Estado:</span>
            <span class="status-badge active">Operativo</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'HomeView',
  data() {
    return {
      currentUser: null,
      stats: {
        totalProducts: 100,
        categories: 5,
        clients: 250,
        revenue: '128,450'
      }
    };
  },
  mounted() {
    this.currentUser = authService.getCurrentUser();
  }
}
</script>

<style scoped>
.home-minimal {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-header p {
  color: #666;
  font-size: 0.9375rem;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
}

.stat-card:hover {
  border-color: #00ff88;
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.products {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
}

.stat-icon.categories {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.stat-icon.clients {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.stat-icon.revenue {
  background: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.stat-info h3 {
  color: #fff;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.stat-info p {
  color: #666;
  font-size: 0.875rem;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.card {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #1a1a1a;
}

.card-header h2 {
  color: #fff;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 1rem;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  color: #999;
  text-decoration: none;
  transition: all 0.2s;
}

.quick-action:hover {
  background: #1a1a1a;
  color: #fff;
}

.quick-action i:first-child {
  font-size: 1.25rem;
}

.quick-action span {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
}

.quick-action i:last-child {
  font-size: 1rem;
  opacity: 0.5;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.info-row:hover {
  background: rgba(255,255,255,0.02);
}

.info-label {
  color: #666;
  font-size: 0.875rem;
}

.info-value {
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
}

.info-badge {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
}

@media (max-width: 768px) {
  .home-minimal {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
