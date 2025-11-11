/**
 * Servicio de autenticación con Supabase
 * 
 * Maneja todas las operaciones de autenticación usando Supabase Auth
 */

import { supabase } from './client.js';
import { isSupabaseConfigured } from './config.js';

class SupabaseAuthService {
  /**
   * Iniciar sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object|null>} Usuario autenticado o null
   */
  async login(email, password) {
    try {
      // Verificar que Supabase esté configurado
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
      }

      // Validar email
      if (!email || !email.includes('@')) {
        throw new Error('Por favor, ingresa un correo electrónico válido');
      }

      // Validar contraseña
      if (!password || password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (authError) {
        console.error('Error al autenticar:', authError);
        
        // Manejar errores específicos de Supabase
        let errorMessage = 'Error al iniciar sesión';
        
        if (authError.message) {
          if (authError.message.includes('Invalid login credentials') || 
              authError.message.includes('invalid_credentials')) {
            errorMessage = 'Correo o contraseña incorrectos';
          } else if (authError.message.includes('Email not confirmed')) {
            errorMessage = 'Por favor, confirma tu correo electrónico antes de iniciar sesión';
          } else if (authError.message.includes('Too many requests')) {
            errorMessage = 'Demasiados intentos. Por favor, espera unos minutos';
          } else if (authError.message.includes('User not found')) {
            errorMessage = 'No existe una cuenta con este correo electrónico';
          } else {
            errorMessage = authError.message;
          }
        }
        
        const error = new Error(errorMessage);
        error.code = authError.status || 'AUTH_ERROR';
        throw error;
      }

      if (!authData || !authData.user) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      // Obtener información adicional del usuario desde la tabla 'users'
      // Intentar primero por ID (más eficiente y evita problemas de RLS)
      let userData = null;
      let userError = null;
      
      // Primero intentar por ID
      const { data: userDataById, error: errorById } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (!errorById && userDataById) {
        userData = userDataById;
        console.log('✅ Usuario obtenido por ID durante login');
      } else {
        // Si falla por ID, intentar por email
        console.warn('⚠️ No se pudo obtener usuario por ID durante login, intentando por email...');
        const { data: userDataByEmail, error: errorByEmail } = await supabase
          .from('users')
          .select('*')
          .eq('email', authData.user.email)
          .maybeSingle();
        
        if (!errorByEmail && userDataByEmail) {
          userData = userDataByEmail;
          console.log('✅ Usuario obtenido por email durante login');
        } else {
          userError = errorByEmail || errorById;
          console.error('❌ Error al obtener datos del usuario desde tabla users:', userError);
          
          // Si hay un error 500 o de permisos, esperar un poco y reintentar
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Reintentar por ID
          const { data: retryUserData, error: retryError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();
          
          if (!retryError && retryUserData) {
            userData = retryUserData;
            console.log('✅ Usuario obtenido en segundo intento');
          } else if (retryError || !retryUserData) {
            console.warn('⚠️ Usuario aún no existe en la tabla users después de esperar');
            // Si no existe en la tabla users, crear un usuario básico con los datos de auth
            const basicUser = {
              id: authData.user.id,
              email: authData.user.email,
              username: authData.user.email?.split('@')[0] || 'Usuario',
              nombre: authData.user.user_metadata?.nombre || 
                      authData.user.user_metadata?.full_name || 
                      authData.user.email?.split('@')[0] || 'Usuario',
              rol: authData.user.user_metadata?.rol || 'usuario'
            };

            console.log('⚠️ Usuario básico creado desde auth (sin tabla users):', basicUser);

            // Guardar sesión en localStorage
            localStorage.setItem('currentUser', JSON.stringify(basicUser));
            if (authData.session) {
              localStorage.setItem('supabaseSession', JSON.stringify(authData.session));
            }

            return basicUser;
          }
        }
      }

      // Verificar que el rol existe
      if (!userData || !userData.rol || userData.rol === '') {
        console.warn('Usuario encontrado pero sin rol asignado. Email:', userData?.email);
        console.warn('Datos del usuario:', userData);
        // Si no tiene rol, esto es un problema que debe solucionarse en Supabase
        // Pero por ahora, usar 'usuario' como fallback para evitar errores
        if (!userData.rol) {
          userData.rol = 'usuario';
        }
      }

      // Construir objeto de usuario
      const user = {
        id: userData.id,
        username: userData.username || userData.email?.split('@')[0],
        email: userData.email,
        nombre: userData.nombre || userData.email?.split('@')[0] || 'Usuario',
        rol: userData.rol || 'usuario' // Solo usar 'usuario' si realmente no hay rol
      };

      console.log('Usuario obtenido desde tabla users:', user);

      // Guardar sesión en localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      if (authData.session) {
        localStorage.setItem('supabaseSession', JSON.stringify(authData.session));
      }

      return user;
    } catch (error) {
      console.error('Error al iniciar sesión con Supabase:', error);
      // Si el error ya tiene un mensaje personalizado, lanzarlo tal cual
      if (error.message && error instanceof Error) {
        throw error;
      }
      // Si es un error de Supabase sin mensaje claro, crear uno genérico
      throw new Error(error.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
    }
  }

  /**
   * Iniciar sesión con username (busca el email asociado)
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object|null>} Usuario autenticado o null
   */
  async loginWithUsername(username, password) {
    try {
      if (!username || username.trim().length === 0) {
        throw new Error('Por favor, ingresa tu nombre de usuario');
      }

      // Buscar usuario por username en la tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', username.trim())
        .single();

      if (userError || !userData) {
        throw new Error('No se encontró una cuenta con este nombre de usuario');
      }

      if (!userData.email) {
        throw new Error('El usuario no tiene un correo electrónico asociado');
      }

      // Usar el email para autenticar
      return await this.login(userData.email, password);
    } catch (error) {
      console.error('Error al iniciar sesión con username:', error);
      // Mantener el mensaje de error original si existe
      if (error.message) {
        throw error;
      }
      throw new Error('Error al iniciar sesión con nombre de usuario');
    }
  }

  /**
   * Cerrar sesión
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Limpiar localStorage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('supabaseSession');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Obtener el usuario actual
   * @returns {Promise<Object|null>} Usuario actual o null
   */
  async getCurrentUser() {
    try {
      // Obtener sesión de Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session || !session.user) {
        console.warn('No hay sesión activa en Supabase:', sessionError);
        // Intentar obtener del localStorage como fallback
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            console.log('Usuario obtenido desde localStorage:', user);
            return user;
          } catch (parseError) {
            console.error('Error al parsear usuario desde localStorage:', parseError);
          }
        }
        return null;
      }

      console.log('Sesión activa encontrada, email:', session.user.email);

      // Obtener información del usuario desde la tabla users
      // Intentar primero por ID (más eficiente y evita problemas de RLS)
      let userData = null;
      let userError = null;
      
      // Primero intentar por ID (más directo y evita problemas de RLS)
      const { data: userDataById, error: errorById } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (!errorById && userDataById) {
        userData = userDataById;
        console.log('✅ Usuario obtenido por ID desde Supabase');
      } else {
        // Si falla por ID, intentar por email
        console.warn('⚠️ No se pudo obtener usuario por ID, intentando por email...');
        const { data: userDataByEmail, error: errorByEmail } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();
        
        if (!errorByEmail && userDataByEmail) {
          userData = userDataByEmail;
          console.log('✅ Usuario obtenido por email desde Supabase');
        } else {
          userError = errorByEmail || errorById;
          console.error('❌ Error al consultar tabla users:', userError);
          console.error('   Error por ID:', errorById);
          console.error('   Error por email:', errorByEmail);
        }
      }

      if (userError) {
        // Si hay un error 500 o de permisos, intentar obtener del localStorage
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          try {
            const cachedUser = JSON.parse(userStr);
            console.warn('⚠️ Usando usuario del cache debido a error en Supabase');
            console.warn('   Error:', userError.message || userError);
            return cachedUser;
          } catch (parseError) {
            console.error('Error al parsear usuario desde localStorage:', parseError);
          }
        }
        // Si no hay usuario en la tabla y no hay en localStorage, devolver null
        return null;
      }

      if (!userData) {
        console.warn('Usuario no encontrado en la tabla users para email:', session.user.email);
        // Usuario no existe en la tabla users, pero tiene sesión activa
        // Esto puede pasar si el trigger no se ejecutó correctamente
        // Intentar obtener del localStorage
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
          try {
            return JSON.parse(userStr);
          } catch (parseError) {
            console.error('Error al parsear usuario desde localStorage:', parseError);
          }
        }
        // Devolver datos básicos
        return {
          id: session.user.id,
          email: session.user.email,
          nombre: session.user.user_metadata?.nombre || session.user.email?.split('@')[0] || 'Usuario',
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0],
          rol: session.user.user_metadata?.rol || 'usuario'
        };
      }

      // Verificar que el rol existe y no es null/undefined
      if (!userData.rol || userData.rol === '') {
        console.warn('Usuario encontrado pero sin rol asignado. Email:', userData.email);
        // Si no tiene rol, usar 'usuario' como predeterminado, pero loguear el problema
        userData.rol = 'usuario';
      }

      const user = {
        id: userData.id,
        username: userData.username || userData.email?.split('@')[0],
        email: userData.email,
        nombre: userData.nombre || userData.email?.split('@')[0] || 'Usuario',
        rol: userData.rol // Ya verificamos que existe
      };

      console.log('Usuario obtenido desde Supabase:', user);

      // Actualizar localStorage con los datos más recientes
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      // En caso de error, intentar obtener del localStorage
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (parseError) {
          console.error('Error al parsear usuario desde localStorage:', parseError);
        }
      }
      return null;
    }
  }

  /**
   * Verificar si hay una sesión activa
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session !== null;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  }

  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña
   * @param {string} userData.username - Nombre de usuario (opcional)
   * @param {string} userData.nombre - Nombre completo (opcional)
   * @param {string} userData.rol - Rol del usuario (opcional, default: 'usuario')
   * @returns {Promise<Object>} Usuario registrado
   */
  async register(userData) {
    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (authError) throw authError;

      // Crear registro en la tabla 'users'
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            username: userData.username || userData.email?.split('@')[0],
            email: userData.email,
            nombre: userData.nombre || userData.username || userData.email?.split('@')[0],
            rol: userData.rol || 'usuario'
          }
        ])
        .select()
        .single();

      if (userError) {
        console.error('Error al crear usuario en tabla users:', userError);
        // Si falla, al menos el usuario está creado en Auth
        return {
          id: authData.user.id,
          email: authData.user.email,
          nombre: userData.nombre || userData.username || 'Usuario',
          rol: userData.rol || 'usuario'
        };
      }

      return userRecord;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  /**
   * Escuchar cambios en el estado de autenticación
   * @param {Function} callback - Función a ejecutar cuando cambie el estado
   * @returns {Function} Función para desuscribirse
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  /**
   * Restablecer contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      // Validar email
      if (!email || !email.includes('@')) {
        throw new Error('Por favor, ingresa un correo electrónico válido');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        console.error('Error al restablecer contraseña:', error);
        
        let errorMessage = 'Error al enviar el correo de restablecimiento';
        
        if (error.message) {
          if (error.message.includes('User not found')) {
            errorMessage = 'No existe una cuenta con este correo electrónico';
          } else if (error.message.includes('rate limit') || error.message.includes('Too many requests')) {
            errorMessage = 'Demasiados intentos. Por favor, espera unos minutos antes de intentar de nuevo';
          } else {
            errorMessage = error.message;
          }
        }
        
        const customError = new Error(errorMessage);
        customError.code = error.status || 'RESET_PASSWORD_ERROR';
        throw customError;
      }
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      // Si el error ya tiene un mensaje personalizado, lanzarlo tal cual
      if (error.message && error instanceof Error) {
        throw error;
      }
      throw new Error(error.message || 'Error al restablecer contraseña. Por favor, intenta de nuevo.');
    }
  }

  /**
   * Actualizar contraseña
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<void>}
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      throw error;
    }
  }

  /**
   * Forzar actualización del usuario desde Supabase
   * Útil cuando se cambia el rol en la base de datos
   * @returns {Promise<Object|null>} Usuario actualizado o null
   */
  async refreshUser() {
    try {
      // Limpiar localStorage para forzar actualización
      localStorage.removeItem('currentUser');
      
      // Obtener usuario actualizado desde Supabase
      const user = await this.getCurrentUser();
      
      if (user) {
        console.log('Usuario refrescado desde Supabase:', user);
        // Actualizar localStorage con los datos actualizados
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      return null;
    }
  }
}

// Exportar instancia única
export default new SupabaseAuthService();

