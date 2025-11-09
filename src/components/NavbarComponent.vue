<template>
  <nav class="navbar-minimal">
    <div class="container-fluid">
      <div class="navbar-brand">
        <i class="bi bi-controller"></i>
        <span>GamerHub Pro</span>
      </div>

      <div class="navbar-actions">
        <div class="user-menu" v-if="currentUser">
          <button class="user-btn" @click="toggleMenu">
            <i class="bi bi-person-circle"></i>
            <span class="user-name">{{ currentUser.nombre }}</span>
            <i class="bi bi-chevron-down"></i>
          </button>
          
          <div class="user-dropdown" v-show="showMenu">
            <div class="dropdown-header">
              <p class="user-email">{{ currentUser.email }}</p>
              <span class="user-role">{{ currentUser.rol }}</span>
            </div>
            <button class="dropdown-item" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent',
  props: {
    currentUser: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showMenu: false
    };
  },
  emits: ['logout'],
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    handleLogout() {
      this.showMenu = false;
      this.$emit('logout');
    }
  }
}
</script>

<style scoped>
.navbar-minimal {
  background: #000000;
  border-bottom: 1px solid #1a1a1a;
  padding: 0.75rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
}

.container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  padding: 0;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.navbar-brand i {
  font-size: 1.5rem;
  color: #00ff88;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu {
  position: relative;
}

.user-btn {
  background: transparent;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.user-btn:hover {
  background: #1a1a1a;
  border-color: #00ff88;
}

.user-btn i.bi-person-circle {
  font-size: 1.25rem;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.user-btn i.bi-chevron-down {
  font-size: 0.75rem;
  opacity: 0.7;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  min-width: 220px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  overflow: hidden;
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #333;
}

.user-email {
  color: #fff;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
}

.user-role {
  background: #00ff88;
  color: #000;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.dropdown-item {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  color: #fff;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background: #00ff88;
  color: #000;
}

.dropdown-item i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .navbar-minimal {
    padding: 0.75rem 1rem;
  }
  
  .user-name {
    display: none;
  }
}
</style>
