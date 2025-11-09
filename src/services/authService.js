/**
 * Servicio de autenticación
 * NOTA EDUCATIVA: Este es un sistema de autenticación simplificado
 * para propósitos educativos. En producción, la autenticación debe
 * manejarse desde el backend con tokens seguros (JWT), hash de contraseñas
 * y conexión HTTPS.
 */
class AuthService {
  constructor() {
    // Usuarios hardcodeados (sin archivo JSON)
    this.usuarios = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123',
        nombre: 'Administrador',
        rol: 'admin',
        email: 'admin@techstore.com'
      },
      {
        id: 2,
        username: 'vendedor',
        password: 'vendedor123',
        nombre: 'Juan Pérez',
        rol: 'vendedor',
        email: 'vendedor@techstore.com'
      },
      {
        id: 3,
        username: 'demo',
        password: 'demo123',
        nombre: 'Usuario Demo',
        rol: 'usuario',
        email: 'demo@techstore.com'
      }
    ];
  }

  /**
   * Validar credenciales de usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Object|null} Usuario si las credenciales son correctas, null en caso contrario
   */
  login(username, password) {
    const usuario = this.usuarios.find(
      user => user.username === username && user.password === password
    );

    if (usuario) {
      // Guardar sesión en localStorage (solo para demo)
      const { password, ...userWithoutPassword } = usuario;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }

    return null;
  }

  /**
   * Cerrar sesión del usuario actual
   */
  logout() {
    localStorage.removeItem('currentUser');
  }

  /**
   * Obtener el usuario actual de la sesión
   * @returns {Object|null} Usuario actual o null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /**
   * Verificar si hay un usuario autenticado
   * @returns {boolean} true si hay sesión activa
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}

// Exportar instancia única
export default new AuthService();

