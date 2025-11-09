<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header text-center mb-4">
        <i class="bi bi-cpu display-1 text-primary mb-3"></i>
        <h2 class="fw-bold">TechStore Pro</h2>
        <p class="text-muted">Panel de Administración</p>
      </div>

      <!-- Alerta de error -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ error }}
        <button type="button" class="btn-close" @click="error = null"></button>
      </div>

      <!-- Alerta informativa -->
      <div class="alert alert-info" role="alert">
        <i class="bi bi-info-circle me-2"></i>
        <strong>Usuarios de prueba:</strong><br>
        <small>admin / admin123 | vendedor / vendedor123 | demo / demo123</small>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">
            <i class="bi bi-person me-2"></i>Usuario
          </label>
          <input
            type="text"
            class="form-control form-control-lg"
            id="username"
            v-model="credentials.username"
            placeholder="Ingrese su usuario"
            required
          >
        </div>

        <div class="mb-4">
          <label for="password" class="form-label">
            <i class="bi bi-lock me-2"></i>Contraseña
          </label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control form-control-lg"
              id="password"
              v-model="credentials.password"
              placeholder="Ingrese su contraseña"
              required
            >
            <button 
              class="btn btn-outline-secondary" 
              type="button"
              @click="showPassword = !showPassword"
            >
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn btn-primary btn-lg w-100 mb-3"
          :disabled="loading"
        >
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Iniciando sesión...
          </span>
          <span v-else>
            <i class="bi bi-box-arrow-in-right me-2"></i>
            Iniciar Sesión
          </span>
        </button>

        <div class="text-center">
          <a href="#" class="text-decoration-none">¿Olvidaste tu contraseña?</a>
        </div>
      </form>

      <div class="login-footer mt-4 pt-3 border-top">
        <p class="text-center text-muted small mb-0">
          <i class="bi bi-shield-check me-1"></i>
          Sistema de autenticación educativo
        </p>
      </div>
    </div>

    <div class="login-info mt-4 text-center text-white">
      <p class="mb-0">
        <i class="bi bi-info-circle me-2"></i>
        <strong>Nota:</strong> Esta es una implementación educativa de un sistema de login.
        En producción se debe usar autenticación segura con backend y tokens JWT.
      </p>
    </div>
  </div>
</template>

<script>
import authService from '../services/authService';

export default {
  name: 'LoginView',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      error: null,
      loading: false,
      showPassword: false
    };
  },
  mounted() {
    // Si ya está autenticado, redirigir al dashboard
    if (authService.isAuthenticated()) {
      this.$router.push('/dashboard');
    }
  },
  methods: {
    async handleLogin() {
      this.error = null;
      this.loading = true;

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));

      const user = authService.login(
        this.credentials.username,
        this.credentials.password
      );

      if (user) {
        this.$router.push('/dashboard');
      } else {
        this.error = 'Usuario o contraseña incorrectos. Por favor, intente nuevamente.';
        this.credentials.password = '';
      }

      this.loading = false;
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 450px;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header i {
  color: #0d6efd;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-info {
  max-width: 600px;
  background: rgba(255,255,255,0.1);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

@media (max-width: 576px) {
  .login-card {
    padding: 30px 20px;
  }
}
</style>

