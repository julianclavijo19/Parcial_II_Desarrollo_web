<template>
  <div class="client-view p-4">
    <div class="page-header mb-4">
      <h2 class="fw-bold">
        <i class="bi bi-people me-2"></i>
        Gestión de Clientes
      </h2>
      <p class="text-muted">Administra la base de datos de clientes</p>
    </div>

    <!-- Toolbar -->
    <div class="toolbar mb-4">
      <div class="row align-items-center">
        <div class="col-md-8 mb-3 mb-md-0">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Buscar clientes..."
              v-model="searchQuery"
            >
          </div>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-primary">
            <i class="bi bi-person-plus me-2"></i>
            Nuevo Cliente
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de clientes -->
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-primary">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in filteredClients" :key="client.id">
                <td><strong>#{{ client.id }}</strong></td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar me-3">
                      {{ client.name.charAt(0) }}
                    </div>
                    <div>
                      <strong>{{ client.name }}</strong>
                      <small class="d-block text-muted">{{ client.username }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ client.email }}</td>
                <td>{{ client.phone }}</td>
                <td>{{ client.address.city }}</td>
                <td>{{ client.registrationDate }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="Ver">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-success" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" title="Eliminar">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="row mt-4 g-4">
      <div class="col-md-3">
        <div class="stat-card bg-primary text-white">
          <i class="bi bi-people"></i>
          <h3>{{ clients.length }}</h3>
          <p>Total Clientes</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-success text-white">
          <i class="bi bi-check-circle"></i>
          <h3>{{ activeClients }}</h3>
          <p>Clientes Activos</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-warning text-white">
          <i class="bi bi-star"></i>
          <h3>{{ vipClients }}</h3>
          <p>Clientes VIP</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-info text-white">
          <i class="bi bi-calendar-plus"></i>
          <h3>{{ newClients }}</h3>
          <p>Nuevos este mes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientView',
  data() {
    return {
      searchQuery: '',
      clients: [
        {
          id: 1,
          name: 'Carlos Rodríguez',
          username: 'crodriguez',
          email: 'carlos@example.com',
          phone: '+57 300 123 4567',
          address: { city: 'Bogotá' },
          registrationDate: '2024-01-15'
        },
        {
          id: 2,
          name: 'María García',
          username: 'mgarcia',
          email: 'maria@example.com',
          phone: '+57 310 234 5678',
          address: { city: 'Medellín' },
          registrationDate: '2024-02-20'
        },
        {
          id: 3,
          name: 'Juan Pérez',
          username: 'jperez',
          email: 'juan@example.com',
          phone: '+57 320 345 6789',
          address: { city: 'Cali' },
          registrationDate: '2024-03-10'
        },
        {
          id: 4,
          name: 'Ana Martínez',
          username: 'amartinez',
          email: 'ana@example.com',
          phone: '+57 315 456 7890',
          address: { city: 'Barranquilla' },
          registrationDate: '2024-04-05'
        },
        {
          id: 5,
          name: 'Luis Hernández',
          username: 'lhernandez',
          email: 'luis@example.com',
          phone: '+57 305 567 8901',
          address: { city: 'Cartagena' },
          registrationDate: '2024-05-12'
        }
      ],
      activeClients: 5,
      vipClients: 2,
      newClients: 3
    };
  },
  computed: {
    filteredClients() {
      if (!this.searchQuery) return this.clients;
      
      const query = this.searchQuery.toLowerCase();
      return this.clients.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.address.city.toLowerCase().includes(query)
      );
    }
  }
}
</script>

<style scoped>
.client-view {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.page-header {
  background: linear-gradient(135deg, #ffc107 0%, #ff6f00 100%);
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

.card {
  border: none;
  border-radius: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.table {
  margin-bottom: 0;
}

.table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.stat-card {
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.stat-card i {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.stat-card h3 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-card p {
  margin-bottom: 0;
}
</style>

