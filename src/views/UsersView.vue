<template>
  <div class="users-management">
    <div class="page-header">
      <div>
        <h1>Gestión de Usuarios</h1>
        <p class="page-subtitle">Administra los usuarios del sistema</p>
      </div>
      <button 
        v-if="isAdmin"
        class="btn-primary"
        @click="showCreateModal = true"
      >
        <i class="bi bi-person-plus"></i>
        Nuevo Usuario
      </button>
    </div>

    <!-- Alertas -->
    <transition name="fade">
      <div v-if="error" class="alert alert-error" style="white-space: pre-line;">
        <i class="bi bi-exclamation-circle-fill"></i>
        <div style="flex: 1;">
          <strong>Error:</strong><br>
          <span>{{ error }}</span>
        </div>
        <button class="alert-close" @click="error = null">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="successMessage" class="alert alert-success">
        <i class="bi bi-check-circle-fill"></i>
        <span>{{ successMessage }}</span>
      </div>
    </transition>

    <!-- Tabla de usuarios -->
    <div class="table-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
        <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
          Si se queda cargando, ejecuta el script fix-rls-policies-complete.sql en Supabase
        </p>
      </div>

      <div v-else-if="users.length === 0 && !error" class="empty-state">
        <i class="bi bi-people"></i>
        <p>No hay usuarios registrados</p>
        <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
          Si esperabas ver usuarios, verifica las políticas RLS en Supabase
        </p>
      </div>

      <table v-else class="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Username</th>
            <th>Rol</th>
            <th>Fecha de Creación</th>
            <th v-if="isAdmin" class="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <span class="user-name">{{ user.nombre }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.username }}</td>
            <td>
              <span class="badge" :class="`badge-${user.rol}`">
                {{ getRolLabel(user.rol) }}
              </span>
            </td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td v-if="isAdmin" class="col-actions">
              <div class="actions-cell">
                <button 
                  class="action-btn edit" 
                  @click="editUser(user)"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="action-btn delete" 
                  @click="confirmDelete(user)"
                  title="Eliminar"
                  :disabled="user.id === currentUser?.id"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar usuario -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
          <button class="modal-close" @click="closeModal">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <form @submit.prevent="showEditModal ? updateUser() : createUser()" class="modal-form">
          <div class="form-group">
            <label>
              Nombre completo
              <span class="required">*</span>
            </label>
            <input
              type="text"
              v-model="formData.nombre"
              placeholder="Juan Pérez"
              required
              :disabled="loading"
            >
          </div>

          <div class="form-group">
            <label>
              Username
              <span class="required">*</span>
            </label>
            <input
              type="text"
              v-model="formData.username"
              placeholder="juanperez"
              required
              :disabled="loading || showEditModal"
            >
          </div>

          <div class="form-group">
            <label>
              Correo electrónico
              <span class="required">*</span>
            </label>
            <input
              type="email"
              v-model="formData.email"
              placeholder="juan@example.com"
              required
              :disabled="loading || showEditModal"
            >
          </div>

          <div class="form-group" v-if="!showEditModal">
            <label>
              Contraseña
              <span class="required">*</span>
            </label>
            <div class="password-input">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                placeholder="••••••••"
                required
                minlength="6"
                :disabled="loading"
              >
              <button 
                type="button" 
                class="toggle-password"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <small class="form-hint">Mínimo 6 caracteres</small>
          </div>

          <div class="form-group">
            <label>
              Rol
              <span class="required">*</span>
            </label>
            <select 
              v-model="formData.rol" 
              required
              :disabled="loading"
            >
              <option value="usuario">Usuario</option>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
            <small class="form-hint">
              <strong>Usuario:</strong> Solo lectura
              <br>
              <strong>Vendedor:</strong> Puede gestionar productos
              <br>
              <strong>Administrador:</strong> Acceso completo
            </small>
          </div>

          <div class="modal-actions">
            <button 
              type="button" 
              class="btn-secondary"
              @click="closeModal"
              :disabled="loading"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="button-content">
                <span class="spinner-small"></span>
                {{ showEditModal ? 'Guardando...' : 'Creando...' }}
              </span>
              <span v-else class="button-content">
                <i class="bi bi-check-lg"></i>
                {{ showEditModal ? 'Guardar Cambios' : 'Crear Usuario' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content modal-confirm" @click.stop>
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar al usuario <strong>{{ userToDelete?.nombre }}</strong>?</p>
          <p class="text-warning">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-actions">
          <button 
            type="button" 
            class="btn-secondary"
            @click="showDeleteModal = false"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn-danger"
            @click="deleteUser"
            :disabled="loading"
          >
            <span v-if="loading" class="button-content">
              <span class="spinner-small"></span>
              Eliminando...
            </span>
            <span v-else class="button-content">
              <i class="bi bi-trash"></i>
              Eliminar
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '../services/userService';
import authService from '../services/authService';
import { isValidEmail } from '../utils/validators';

export default {
  name: 'UsersView',
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      successMessage: null,
      currentUser: null,
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showPassword: false,
      userToDelete: null,
      formData: {
        nombre: '',
        username: '',
        email: '',
        password: '',
        rol: 'usuario'
      }
    };
  },
  computed: {
    isAdmin() {
      return this.currentUser && this.currentUser.rol === 'admin';
    },
    isFormValid() {
      if (this.showEditModal) {
        return this.formData.nombre && 
               this.formData.username && 
               this.formData.email && 
               isValidEmail(this.formData.email) &&
               this.formData.rol;
      } else {
        return this.formData.nombre && 
               this.formData.username && 
               this.formData.email && 
               isValidEmail(this.formData.email) &&
               this.formData.password && 
               this.formData.password.length >= 6 &&
               this.formData.rol;
      }
    }
  },
  async mounted() {
    // Verificar que el usuario sea administrador
    try {
      console.log('🔍 Verificando permisos de administrador...');
      this.currentUser = await authService.getCurrentUserAsync() || authService.getCurrentUser();
      
      if (!this.currentUser) {
        console.error('❌ No se pudo obtener el usuario actual');
        this.$router.push('/login');
        return;
      }
      
      console.log('✅ Usuario actual:', this.currentUser);
      console.log('📋 Rol del usuario:', this.currentUser.rol);
      
      if (!this.isAdmin) {
        console.warn('⚠️ El usuario no es administrador, redirigiendo al dashboard');
        this.error = 'No tienes permisos para acceder a esta sección. Se requiere rol de administrador.';
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 2000);
        return;
      }

      console.log('✅ Permisos de administrador verificados');
      await this.loadUsers();
    } catch (error) {
      console.error('❌ Error al verificar permisos:', error);
      this.error = 'Error al verificar permisos de administrador. Por favor, inicia sesión nuevamente.';
      setTimeout(() => {
        this.$router.push('/dashboard');
      }, 2000);
    }
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        console.log('🔍 Cargando usuarios...');
        this.users = await userService.getAllUsers();
        console.log(`✅ ${this.users.length} usuarios cargados`);
        
        if (this.users.length === 0) {
          console.log('⚠️ No hay usuarios en la base de datos o no se pudieron cargar');
          this.error = 'No se encontraron usuarios. Verifica que las políticas RLS estén configuradas correctamente en Supabase.';
        }
      } catch (error) {
        console.error('❌ Error al cargar usuarios:', error);
        this.error = error.message || 'Error al cargar usuarios';
        
        // Proporcionar mensajes más específicos y útiles
        if (error.message && error.message.includes('permisos')) {
          this.error += '\n\nSolución: Ejecuta el script fix-rls-policies-complete.sql en el SQL Editor de Supabase.';
        } else if (error.message && error.message.includes('Timeout')) {
          this.error += '\n\nPosibles causas:\n1. Problemas de conexión a Supabase\n2. Políticas RLS mal configuradas\n3. La función is_admin() no funciona correctamente\n\nSolución: Ejecuta el script fix-rls-policies-complete.sql en el SQL Editor de Supabase.';
        } else if (error.message && error.message.includes('RLS')) {
          this.error += '\n\nSolución: Ejecuta el script fix-rls-policies-complete.sql en el SQL Editor de Supabase para corregir las políticas RLS.';
        }
        
        // Establecer lista vacía para evitar errores en el template
        this.users = [];
      } finally {
        // Asegurar que el loading se detenga siempre
        this.loading = false;
        console.log('✅ Loading detenido');
      }
    },

    async createUser() {
      // Validar formulario antes de enviar
      if (!this.isFormValid) {
        this.error = 'Por favor, completa todos los campos requeridos correctamente';
        return;
      }

      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        console.log('🔄 Creando usuario:', this.formData.email);
        
        // Agregar timeout para evitar que se quede cargando indefinidamente
        const createPromise = userService.createUser(this.formData);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: La creación del usuario tardó demasiado tiempo')), 15000);
        });
        
        const newUser = await Promise.race([createPromise, timeoutPromise]);
        console.log('✅ Usuario creado:', newUser);
        
        this.successMessage = `Usuario "${newUser.nombre || newUser.email}" creado exitosamente`;
        
        // Cerrar el modal antes de recargar
        this.closeModal();
        
        // Recargar la lista de usuarios después de un breve delay
        console.log('🔄 Recargando lista de usuarios...');
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.loadUsers();
        
        // Verificar que el nuevo usuario está en la lista
        const newUserInList = this.users.find(u => 
          u.id === newUser.id || 
          (u.email && newUser.email && u.email.toLowerCase() === newUser.email.toLowerCase())
        );
        
        if (!newUserInList) {
          console.warn('⚠️ El nuevo usuario no apareció en la lista inmediatamente, recargando nuevamente...');
          // Esperar un poco más y recargar nuevamente
          await new Promise(resolve => setTimeout(resolve, 1000));
          await this.loadUsers();
        } else {
          console.log('✅ Nuevo usuario encontrado en la lista');
        }
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        
        // Proporcionar mensajes de error más específicos
        let errorMessage = error.message || 'Error al crear usuario';
        
        if (error.message && error.message.includes('Timeout')) {
          errorMessage = 'La creación del usuario tardó demasiado tiempo. El usuario puede haber sido creado. Por favor, recarga la página para verificar.';
          // Cerrar el modal y recargar la lista
          this.closeModal();
          await this.loadUsers();
        } else if (error.message && error.message.includes('Ya existe')) {
          errorMessage = error.message;
        } else if (error.message && error.message.includes('permisos')) {
          errorMessage = error.message + '\n\nVerifica que tengas el rol de administrador y que las políticas RLS estén configuradas correctamente.';
        } else if (error.message && error.message.includes('RLS')) {
          errorMessage = error.message + '\n\nEjecuta el script fix-rls-definitive.sql en el SQL Editor de Supabase para corregir las políticas RLS.';
        }
        
        this.error = errorMessage;
        
        // Mantener el modal abierto solo si no es un error de timeout
        if (!error.message || !error.message.includes('Timeout')) {
          // Mantener el modal abierto para que el usuario pueda corregir los errores
        } else {
          // Cerrar el modal si es timeout (puede que el usuario haya sido creado)
          this.closeModal();
        }
      } finally {
        // Asegurar que el loading se detenga siempre
        this.loading = false;
        console.log('✅ Loading detenido en createUser');
      }
    },

    editUser(user) {
      this.formData = {
        nombre: user.nombre,
        username: user.username,
        email: user.email,
        password: '',
        rol: user.rol
      };
      this.userToDelete = user;
      this.showEditModal = true;
    },

    async updateUser() {
      // Validar formulario antes de enviar
      if (!this.isFormValid) {
        this.error = 'Por favor, completa todos los campos requeridos correctamente';
        return;
      }

      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        console.log('🔄 Actualizando usuario:', this.userToDelete.id);
        const updatedUser = await userService.updateUser(this.userToDelete.id, {
          nombre: this.formData.nombre,
          username: this.formData.username,
          email: this.formData.email,
          rol: this.formData.rol
        });
        console.log('✅ Usuario actualizado:', updatedUser);
        
        this.successMessage = `Usuario "${updatedUser.nombre || updatedUser.email}" actualizado exitosamente`;
        this.closeModal();
        
        // Recargar la lista de usuarios
        await this.loadUsers();
        
        // Si el usuario actualizado es el usuario actual, refrescar su sesión
        if (this.currentUser && this.currentUser.id === updatedUser.id) {
          console.log('⚠️ El usuario actualizado es el usuario actual, refrescando sesión...');
          try {
            await authService.refreshUser();
            // Recargar la página para actualizar el estado
            window.location.reload();
          } catch (refreshError) {
            console.error('Error al refrescar sesión:', refreshError);
          }
        }
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        this.error = error.message || 'Error al actualizar usuario';
        
        // Mantener el modal abierto para que el usuario pueda corregir los errores
        // No cerrar el modal en caso de error
      } finally {
        this.loading = false;
      }
    },

    confirmDelete(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },

    async deleteUser() {
      if (!this.userToDelete) {
        console.error('❌ No hay usuario seleccionado para eliminar');
        this.error = 'No hay usuario seleccionado para eliminar';
        return;
      }

      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const userToDeleteId = this.userToDelete.id;
        const userToDeleteName = this.userToDelete.nombre || this.userToDelete.email;
        
        console.log('🗑️ Iniciando eliminación de usuario:', userToDeleteId, userToDeleteName);
        
        // Agregar timeout para evitar que se quede cargando indefinidamente
        const deletePromise = userService.deleteUser(userToDeleteId);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: La eliminación tardó demasiado tiempo')), 10000);
        });
        
        await Promise.race([deletePromise, timeoutPromise]);
        
        console.log('✅ Usuario eliminado exitosamente:', userToDeleteId);
        
        this.successMessage = `Usuario "${userToDeleteName}" eliminado exitosamente`;
        
        // Cerrar el modal antes de recargar
        this.showDeleteModal = false;
        const deletedUser = this.userToDelete;
        this.userToDelete = null;
        
        // Recargar la lista de usuarios después de un breve delay
        console.log('🔄 Recargando lista de usuarios...');
        await new Promise(resolve => setTimeout(resolve, 300));
        await this.loadUsers();
        
        // Verificar que el usuario fue eliminado de la lista
        const userStillExists = this.users.find(u => u.id === deletedUser.id);
        if (userStillExists) {
          console.warn('⚠️ El usuario aún aparece en la lista, recargando nuevamente...');
          await new Promise(resolve => setTimeout(resolve, 500));
          await this.loadUsers();
        }
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        
        // Proporcionar mensajes de error más específicos
        let errorMessage = error.message || 'Error al eliminar usuario';
        
        if (error.message && error.message.includes('Timeout')) {
          errorMessage = 'La eliminación tardó demasiado tiempo. El usuario puede haber sido eliminado. Por favor, recarga la página.';
          // Cerrar el modal y recargar la lista
          this.showDeleteModal = false;
          this.userToDelete = null;
          await this.loadUsers();
        } else if (error.message && error.message.includes('permisos')) {
          errorMessage = error.message + '\n\nVerifica que tengas el rol de administrador y que las políticas RLS estén configuradas correctamente.';
        } else if (error.message && error.message.includes('RLS')) {
          errorMessage = error.message + '\n\nEjecuta el script fix-rls-definitive.sql en el SQL Editor de Supabase para corregir las políticas RLS.';
        }
        
        this.error = errorMessage;
        
        // Mantener el modal abierto solo si no es un error de timeout
        if (!error.message || !error.message.includes('Timeout')) {
          // Mantener el modal abierto para que el usuario vea el error
        } else {
          // Cerrar el modal si es timeout (puede que el usuario haya sido eliminado)
          this.showDeleteModal = false;
          this.userToDelete = null;
        }
      } finally {
        // Asegurar que el loading se detenga siempre
        this.loading = false;
        console.log('✅ Loading detenido en deleteUser');
      }
    },

    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.formData = {
        nombre: '',
        username: '',
        email: '',
        password: '',
        rol: 'usuario'
      };
      this.userToDelete = null;
      this.error = null;
      this.showPassword = false;
    },

    getRolLabel(rol) {
      const labels = {
        admin: 'Administrador',
        vendedor: 'Vendedor',
        usuario: 'Usuario'
      };
      return labels[rol] || rol;
    },

    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.users-management {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.page-header h1 {
  color: #212529;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #6c757d;
  font-size: 0.9375rem;
  margin: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Alertas */
.alert {
  padding: 1rem 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  animation: slideDown 0.3s ease-out;
}

.alert-error {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
}

.alert-success {
  background: #d1fae5;
  border: 1px solid #86efac;
  color: #065f46;
}

.alert-close {
  margin-left: auto;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tabla */
.table-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading-state,
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6c757d;
}

.loading-state .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state i {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 1rem;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.users-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: #212529;
}

.users-table tbody tr:hover {
  background: #f8f9fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1.5rem;
}

.user-name {
  font-weight: 500;
  color: #212529;
}

.badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-admin {
  background: #fef3c7;
  color: #92400e;
}

.badge-vendedor {
  background: #dbeafe;
  color: #1e40af;
}

.badge-usuario {
  background: #e9ecef;
  color: #495057;
}

.col-actions {
  width: 120px;
  text-align: center;
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.action-btn.edit {
  background: #eef2ff;
  color: #667eea;
}

.action-btn.edit:hover:not(:disabled) {
  background: #667eea;
  color: #ffffff;
}

.action-btn.delete {
  background: #fee2e2;
  color: #ef4444;
}

.action-btn.delete:hover:not(:disabled) {
  background: #ef4444;
  color: #ffffff;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #212529;
}

.modal-form {
  padding: 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
}

.toggle-password:hover {
  color: #667eea;
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: #6c757d;
  line-height: 1.5;
}

.text-warning {
  color: #f59e0b;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #dee2e6;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.modal-confirm {
  max-width: 400px;
}

/* Responsive */
@media (max-width: 768px) {
  .users-management {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .users-table {
    font-size: 0.875rem;
  }

  .users-table th,
  .users-table td {
    padding: 0.75rem 0.5rem;
  }

  .modal-content {
    max-width: 100%;
  }
}
</style>

