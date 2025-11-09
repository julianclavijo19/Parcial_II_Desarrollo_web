<template>
  <div class="login-minimal">
    <div class="login-container">
      <div class="login-header">
        <i class="bi bi-controller"></i>
        <h1>GamerHub Pro</h1>
        <p>Dashboard Administrativo</p>
      </div>

      <div v-if="error" class="alert-error">
        <i class="bi bi-exclamation-circle"></i>
        <span>{{ error }}</span>
      </div>

      <div class="info-badge">
        <i class="bi bi-info-circle"></i>
        <div>
          <strong>Demo:</strong> admin / admin123
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Usuario</label>
          <input
            type="text"
            v-model="credentials.username"
            placeholder="Ingresa tu usuario"
            required
            autocomplete="username"
          >
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="credentials.password"
              placeholder="Ingresa tu contraseña"
              required
              autocomplete="current-password"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn-login"
          :disabled="loading"
        >
          <span v-if="loading">
            <span class="spinner"></span>
            Ingresando...
          </span>
          <span v-else>
            Iniciar Sesión
          </span>
        </button>
      </form>

      <div class="login-footer">
        <i class="bi bi-shield-check"></i>
        <span>Sistema educativo - No usar en producción</span>
      </div>
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
    if (authService.isAuthenticated()) {
      this.$router.push('/dashboard');
    }
  },
  methods: {
    async handleLogin() {
      this.error = null;
      this.loading = true;

      await new Promise(resolve => setTimeout(resolve, 600));

      const user = authService.login(
        this.credentials.username,
        this.credentials.password
      );

      if (user) {
        this.$router.push('/dashboard');
      } else {
        this.error = 'Usuario o contraseña incorrectos';
        this.credentials.password = '';
      }

      this.loading = false;
    }
  }
}
</script>

<style scoped>
.login-minimal {
  min-height: 100vh;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header i {
  font-size: 3rem;
  color: #00ff88;
  margin-bottom: 1rem;
}

.login-header h1 {
  color: #fff;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.login-header p {
  color: #666;
  font-size: 0.9375rem;
  margin: 0;
}

.alert-error {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ff6b6b;
  font-size: 0.875rem;
}

.alert-error i {
  font-size: 1.125rem;
}

.info-badge {
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #00ff88;
  font-size: 0.875rem;
}

.info-badge i {
  font-size: 1.125rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #999;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 8px;
  padding: 0.875rem 1rem;
  color: #fff;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #00ff88;
  background: #000;
}

.form-group input::placeholder {
  color: #555;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  flex: 1;
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #00ff88;
}

.btn-login {
  background: #00ff88;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  background: #00e67a;
  transform: translateY(-1px);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #555;
  font-size: 0.8125rem;
}

.login-footer i {
  font-size: 1rem;
}

@media (max-width: 480px) {
  .login-minimal {
    padding: 1.5rem;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
