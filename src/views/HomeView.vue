<template>
  <div class="home-view p-4">
    <div class="welcome-section mb-4">
      <h1 class="display-4 fw-bold text-primary">
        <i class="bi bi-house-door me-3"></i>
        ¡Bienvenido, {{ currentUser?.nombre }}!
      </h1>
      <p class="lead text-muted">Panel de control de TechStore Pro</p>
    </div>

    <!-- Tarjetas de estadísticas -->
    <div class="row g-4 mb-4">
      <div class="col-md-3">
        <div class="stat-card bg-primary text-white">
          <div class="stat-icon">
            <i class="bi bi-box-seam"></i>
          </div>
          <div class="stat-content">
            <h3 class="mb-0">{{ stats.totalProducts }}</h3>
            <p class="mb-0">Productos</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="stat-card bg-success text-white">
          <div class="stat-icon">
            <i class="bi bi-tags"></i>
          </div>
          <div class="stat-content">
            <h3 class="mb-0">{{ stats.categories }}</h3>
            <p class="mb-0">Categorías</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="stat-card bg-warning text-white">
          <div class="stat-icon">
            <i class="bi bi-people"></i>
          </div>
          <div class="stat-content">
            <h3 class="mb-0">{{ stats.clients }}</h3>
            <p class="mb-0">Clientes</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="stat-card bg-info text-white">
          <div class="stat-icon">
            <i class="bi bi-graph-up"></i>
          </div>
          <div class="stat-content">
            <h3 class="mb-0">${{ stats.revenue }}</h3>
            <p class="mb-0">Ventas del Mes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de accesos rápidos -->
    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-lightning me-2"></i>
              Accesos Rápidos
            </h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/dashboard/productos" class="btn btn-outline-primary">
                <i class="bi bi-box-seam me-2"></i>
                Gestionar Productos
              </router-link>
              <button class="btn btn-outline-success">
                <i class="bi bi-plus-circle me-2"></i>
                Nuevo Producto
              </button>
              <button class="btn btn-outline-info">
                <i class="bi bi-file-earmark-text me-2"></i>
                Ver Reportes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="bi bi-activity me-2"></i>
              Actividad Reciente
            </h5>
          </div>
          <div class="card-body">
            <ul class="list-unstyled mb-0">
              <li class="mb-2 pb-2 border-bottom">
                <i class="bi bi-check-circle text-success me-2"></i>
                Producto "Laptop Dell" actualizado
                <small class="text-muted d-block">Hace 5 minutos</small>
              </li>
              <li class="mb-2 pb-2 border-bottom">
                <i class="bi bi-plus-circle text-primary me-2"></i>
                Nuevo producto "iPhone 14" agregado
                <small class="text-muted d-block">Hace 1 hora</small>
              </li>
              <li class="mb-2">
                <i class="bi bi-trash text-danger me-2"></i>
                Producto "Mouse Viejo" eliminado
                <small class="text-muted d-block">Hace 2 horas</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico de información -->
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-dark text-white">
            <h5 class="mb-0">
              <i class="bi bi-bar-chart me-2"></i>
              Información del Sistema
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6 class="fw-bold">Perfil de Usuario</h6>
                <ul class="list-unstyled">
                  <li><strong>Nombre:</strong> {{ currentUser?.nombre }}</li>
                  <li><strong>Usuario:</strong> {{ currentUser?.username }}</li>
                  <li><strong>Email:</strong> {{ currentUser?.email }}</li>
                  <li><strong>Rol:</strong> 
                    <span class="badge bg-primary">{{ currentUser?.rol }}</span>
                  </li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6 class="fw-bold">Información del Sistema</h6>
                <ul class="list-unstyled">
                  <li><strong>Versión:</strong> 1.0.0</li>
                  <li><strong>Última actualización:</strong> {{ lastUpdate }}</li>
                  <li><strong>Estado:</strong> 
                    <span class="badge bg-success">Operativo</span>
                  </li>
                  <li><strong>API:</strong> FakeStore API</li>
                </ul>
              </div>
            </div>
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
        totalProducts: 20,
        categories: 4,
        clients: 150,
        revenue: '45,320'
      },
      lastUpdate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  },
  mounted() {
    this.currentUser = authService.getCurrentUser();
  }
}
</script>

<style scoped>
.home-view {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.welcome-section h1 {
  color: white !important;
}

.stat-card {
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.stat-icon {
  font-size: 3rem;
  margin-right: 20px;
  opacity: 0.8;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: bold;
}

.card {
  border: none;
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  border-bottom: none;
  padding: 15px 20px;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateX(5px);
}
</style>

