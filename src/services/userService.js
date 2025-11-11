/**
 * Servicio para gestionar usuarios
 * Solo accesible para administradores
 */

import { supabase } from '../supabase/index.js';
import { SUPABASE_CONFIG } from '../supabase/config.js';

const USE_SUPABASE = !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && SUPABASE_CONFIG.url !== '');

class UserService {
  /**
   * Crear un nuevo usuario (solo administradores)
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña
   * @param {string} userData.username - Nombre de usuario
   * @param {string} userData.nombre - Nombre completo
   * @param {string} userData.rol - Rol del usuario ('admin', 'vendedor', 'usuario')
   * @returns {Promise<Object>} Usuario creado
   */
  async createUser(userData) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      // Validar datos
      if (!userData.email || !userData.email.includes('@')) {
        throw new Error('El correo electrónico es requerido y debe ser válido');
      }

      if (!userData.password || userData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (!userData.rol || !['admin', 'vendedor', 'usuario'].includes(userData.rol)) {
        throw new Error('El rol debe ser: admin, vendedor o usuario');
      }

      // IMPORTANTE: Verificar si el email o username ya existen antes de crear
      // Esto requiere que el administrador tenga permisos para leer todos los usuarios
      console.log('🔍 Verificando si el email o username ya existen...');
      const emailToCheck = userData.email.trim().toLowerCase();
      const usernameToCheck = userData.username?.trim().toLowerCase();
      
      try {
        // Verificar email existente en auth.users (vía la tabla users)
        // Las políticas RLS deberían permitir a los administradores ver todos los usuarios
        const { data: existingEmail, error: emailCheckError } = await supabase
          .from('users')
          .select('id, email')
          .eq('email', emailToCheck)
          .maybeSingle();
        
        if (emailCheckError && !emailCheckError.message.includes('JWT')) {
          console.warn('⚠️ Error al verificar email existente:', emailCheckError);
          // Continuar de todas formas - la validación se hará en signUp
        } else if (existingEmail) {
          throw new Error('Ya existe un usuario con este correo electrónico');
        }
        
        // Verificar username existente (si se proporciona)
        if (usernameToCheck) {
          const { data: existingUsername, error: usernameCheckError } = await supabase
            .from('users')
            .select('id, username')
            .eq('username', usernameToCheck)
            .maybeSingle();
          
          if (usernameCheckError && !usernameCheckError.message.includes('JWT')) {
            console.warn('⚠️ Error al verificar username existente:', usernameCheckError);
            // Continuar de todas formas - la validación se hará en signUp
          } else if (existingUsername) {
            throw new Error('Ya existe un usuario con este nombre de usuario');
          }
        }
      } catch (validationError) {
        // Si es un error de validación (usuario existente), lanzarlo
        if (validationError.message.includes('Ya existe')) {
          throw validationError;
        }
        // Si es otro error, loguearlo pero continuar
        console.warn('⚠️ Error en validación previa, continuando con creación:', validationError);
      }

      // IMPORTANTE: Guardar la sesión actual del administrador antes de crear el usuario
      // signUp() puede cambiar la sesión activa, así que necesitamos restaurarla después
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
      }

      const currentUserId = currentSession.user.id;
      const currentUserAccessToken = currentSession.access_token;
      const currentUserRefreshToken = currentSession.refresh_token;

      console.log('🔐 Sesión actual guardada. Usuario ID:', currentUserId);

      // Crear usuario en Supabase Auth usando signUp
      // NOTA: signUp() automáticamente inicia sesión con el nuevo usuario
      // Por eso necesitamos restaurar la sesión del administrador después
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: emailToCheck,
        password: userData.password,
        options: {
          data: {
            nombre: userData.nombre || userData.username || userData.email.split('@')[0],
            username: userData.username || userData.email.split('@')[0],
            rol: userData.rol
          },
          email_redirect_to: undefined
        }
      });

      if (signUpError) {
        console.error('❌ Error al crear usuario en Supabase Auth:', signUpError);
        
        // Restaurar la sesión del administrador inmediatamente en caso de error
        try {
          await supabase.auth.setSession({
            access_token: currentUserAccessToken,
            refresh_token: currentUserRefreshToken
          });
        } catch (restoreError) {
          console.error('Error al restaurar sesión después de error:', restoreError);
        }
        
        // Manejar errores específicos
        if (signUpError.message.includes('User already registered') || 
            signUpError.message.includes('already registered') ||
            signUpError.message.includes('duplicate') ||
            signUpError.code === '23505') {
          throw new Error('Ya existe un usuario con este correo electrónico');
        } else if (signUpError.message.includes('password')) {
          throw new Error('La contraseña no cumple con los requisitos de seguridad');
        } else if (signUpError.message.includes('email')) {
          throw new Error('El correo electrónico no es válido');
        } else if (signUpError.message.includes('permission') || signUpError.message.includes('RLS')) {
          throw new Error('No tienes permisos para crear usuarios. Verifica que tengas el rol de administrador.');
        }
        
        throw new Error(`Error al crear usuario: ${signUpError.message}`);
      }

      if (!signUpData.user) {
        throw new Error('No se pudo crear el usuario. Verifica la configuración de Supabase.');
      }

      const userId = signUpData.user.id;
      console.log('✅ Usuario creado en Supabase Auth:', userId);

      // Restaurar la sesión del administrador ANTES de crear el registro en users
      // Esto es crítico para que las políticas RLS funcionen correctamente
      console.log('🔄 Restaurando sesión del administrador antes de crear registro en users...');
      const { error: restoreErrorBefore } = await supabase.auth.setSession({
        access_token: currentUserAccessToken,
        refresh_token: currentUserRefreshToken
      });

      if (restoreErrorBefore) {
        console.warn('⚠️ Error al restaurar sesión antes de crear registro:', restoreErrorBefore);
        // Intentar método alternativo
        try {
          await supabase.auth.signOut();
          await new Promise(resolve => setTimeout(resolve, 200));
          await supabase.auth.setSession({
            access_token: currentUserAccessToken,
            refresh_token: currentUserRefreshToken
          });
        } catch (altError) {
          console.error('❌ Error en método alternativo de restauración:', altError);
        }
      } else {
        console.log('✅ Sesión restaurada correctamente');
      }

      // Esperar un momento para que el trigger cree el registro en la tabla users
      // Los triggers pueden tomar tiempo, especialmente en Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verificar si el usuario fue creado en la tabla users por el trigger
      // Usar timeout para evitar que se quede colgado
      let userRecord = null;
      const maxWaitTime = 5000; // 5 segundos máximo de espera
      const checkInterval = 500; // Verificar cada 500ms
      const startTime = Date.now();

      console.log('🔍 Buscando usuario en la tabla users...');
      
      while (!userRecord && (Date.now() - startTime) < maxWaitTime) {
        try {
          const fetchPromise = supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 3000);
          });
          
          const { data: existingUser, error: fetchError } = await Promise.race([
            fetchPromise,
            timeoutPromise
          ]);

          if (existingUser && !fetchError) {
            userRecord = existingUser;
            console.log('✅ Usuario encontrado en la tabla users');
            break;
          }

          if (fetchError && fetchError.code !== 'PGRST116') {
            // Si hay un error que no sea "no encontrado", loguearlo
            console.warn('⚠️ Error al buscar usuario:', fetchError);
          }

          // Esperar antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, checkInterval));
        } catch (checkError) {
          if (checkError.message === 'Timeout') {
            console.warn('⚠️ Timeout al buscar usuario, continuando con creación manual...');
            break;
          }
          console.warn('⚠️ Error en bucle de búsqueda:', checkError);
        }
      }

      // Si el trigger no creó el usuario, crearlo manualmente
      if (!userRecord) {
        console.warn('⚠️ El trigger no creó el usuario. Creando manualmente...');
        
        const userToInsert = {
          id: userId,
          username: userData.username || userData.email.split('@')[0],
          email: userData.email.trim().toLowerCase(),
          nombre: userData.nombre || userData.username || userData.email.split('@')[0],
          rol: userData.rol
        };
        
        console.log('🔄 Insertando usuario manualmente:', userToInsert);
        
        // Agregar timeout a la inserción
        const insertPromise = supabase
          .from('users')
          .insert([userToInsert])
          .select()
          .single();
        
        const insertTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout: La inserción tardó demasiado')), 5000);
        });
        
        try {
          const { data: newUserRecord, error: insertError } = await Promise.race([
            insertPromise,
            insertTimeout
          ]);

          if (insertError) {
            // Si ya existe (el trigger lo creó justo ahora), obtenerlo
            if (insertError.code === '23505' || insertError.message.includes('duplicate')) {
              console.log('✅ El usuario ya existe (creado por el trigger), obteniéndolo...');
              const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .maybeSingle();
              
              if (existingUser && !fetchError) {
                userRecord = existingUser;
                console.log('✅ Usuario obtenido después de error de duplicado');
              } else {
                console.error('❌ Error al obtener usuario después de error de duplicado:', fetchError);
                throw new Error(`Error al crear usuario en la tabla: ${insertError.message}`);
              }
            } else {
              console.error('❌ Error al insertar usuario manualmente:', insertError);
              
              // Proporcionar mensajes de error más específicos
              if (insertError.code === 'PGRST301' || insertError.message.includes('permission denied')) {
                throw new Error('No tienes permisos para crear usuarios. Verifica que tengas el rol de administrador.');
              } else if (insertError.message.includes('RLS')) {
                throw new Error('Error de permisos. Verifica que las políticas RLS estén configuradas correctamente.');
              }
              
              throw new Error(`Error al crear usuario en la tabla: ${insertError.message}`);
            }
          } else {
            userRecord = newUserRecord;
            console.log('✅ Usuario creado manualmente en la tabla users');
          }
        } catch (insertRaceError) {
          if (insertRaceError.message && insertRaceError.message.includes('Timeout')) {
            console.error('❌ Timeout al insertar usuario:', insertRaceError);
            throw new Error('La creación del usuario tardó demasiado tiempo. Por favor, verifica tu conexión y las políticas RLS en Supabase.');
          }
          throw insertRaceError;
        }
      }

      // Actualizar el rol del usuario (el trigger puede haberlo creado con rol por defecto)
      if (userRecord.rol !== userData.rol) {
        console.log('🔄 Actualizando rol del usuario de', userRecord.rol, 'a', userData.rol);
        
        const updatePromise = supabase
          .from('users')
          .update({ rol: userData.rol })
          .eq('id', userId)
          .select()
          .single();
        
        const updateTimeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 5000);
        });
        
        try {
          const { data: updatedUser, error: updateError } = await Promise.race([
            updatePromise,
            updateTimeout
          ]);

          if (updateError) {
            console.warn('⚠️ No se pudo actualizar el rol del usuario:', updateError);
            // Continuar de todas formas, el usuario está creado
            // Pero lanzar una advertencia al usuario
            console.warn('El usuario fue creado pero el rol no se pudo actualizar. Rol actual:', userRecord.rol);
          } else {
            userRecord = updatedUser;
            console.log('✅ Rol del usuario actualizado correctamente');
          }
        } catch (updateRaceError) {
          if (updateRaceError.message && updateRaceError.message.includes('Timeout')) {
            console.warn('⚠️ Timeout al actualizar rol, continuando con rol actual:', userRecord.rol);
          } else {
            console.warn('⚠️ Error al actualizar rol:', updateRaceError);
          }
        }
      }

      console.log('✅ Usuario creado exitosamente:', userRecord);

      // Verificar que la sesión del administrador sigue activa
      // Esto es importante porque signUp() puede haber cambiado la sesión
      const { data: { session: finalSession } } = await supabase.auth.getSession();
      
      if (!finalSession || finalSession.user.id !== currentUserId) {
        console.warn('⚠️ La sesión cambió después de crear el usuario, restaurando...');
        try {
          const { error: finalRestoreError } = await supabase.auth.setSession({
            access_token: currentUserAccessToken,
            refresh_token: currentUserRefreshToken
          });
          
          if (finalRestoreError) {
            console.error('❌ Error al restaurar sesión final:', finalRestoreError);
            // Intentar método alternativo
            try {
              await supabase.auth.signOut();
              await new Promise(resolve => setTimeout(resolve, 200));
              await supabase.auth.setSession({
                access_token: currentUserAccessToken,
                refresh_token: currentUserRefreshToken
              });
            } catch (altFinalError) {
              console.error('❌ Error en método alternativo final:', altFinalError);
            }
          } else {
            console.log('✅ Sesión del administrador restaurada correctamente (verificación final)');
          }
        } catch (restoreFinalError) {
          console.error('❌ Error al verificar/restaurar sesión final:', restoreFinalError);
        }
      } else {
        console.log('✅ Verificación: Sesión del administrador sigue activa');
      }

      // Nota: El email del usuario se confirmará automáticamente si está configurado
      // en Supabase (auto-confirm habilitado). Si no, el usuario necesitará confirmar
      // su email manualmente mediante el enlace enviado por Supabase.

      return userRecord;
    } catch (error) {
      console.error('Error en createUser:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios (solo administradores)
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsers() {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      console.log('🔍 Obteniendo todos los usuarios...');
      
      // Verificar que hay una sesión activa
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('❌ No hay sesión activa:', sessionError);
        throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
      }
      
      console.log('🔐 Sesión activa encontrada. Usuario ID:', session.user.id);
      console.log('📧 Email del usuario:', session.user.email);
      
      // Obtener el rol del usuario actual para verificar
      try {
        const { data: currentUserData, error: currentUserError } = await supabase
          .from('users')
          .select('rol, email')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (currentUserData) {
          console.log('👤 Usuario actual - Rol:', currentUserData.rol, 'Email:', currentUserData.email);
        } else {
          console.warn('⚠️ No se encontró el usuario actual en la tabla users');
        }
      } catch (checkError) {
        console.warn('⚠️ Error al verificar usuario actual:', checkError);
      }
      
      // Obtener todos los usuarios
      // Las políticas RLS deberían permitir a los administradores ver todos los usuarios
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error al obtener usuarios:', error);
        console.error('   Código de error:', error.code);
        console.error('   Mensaje:', error.message);
        console.error('   Detalles:', error.details);
        console.error('   Hint:', error.hint);
        
        // Proporcionar mensajes de error más específicos
        if (error.code === 'PGRST301' || error.message.includes('permission denied') || error.message.includes('new row violates row-level security')) {
          throw new Error('No tienes permisos para ver usuarios. Verifica que tengas el rol de administrador en Supabase. Ejecuta el script fix-rls-policies-complete.sql en el SQL Editor de Supabase.');
        } else if (error.code === 'PGRST116' || error.message.includes('JWT') || error.message.includes('invalid JWT')) {
          throw new Error('Error de autenticación. Por favor, inicia sesión nuevamente.');
        } else if (error.message.includes('RLS') || error.message.includes('row-level security')) {
          throw new Error('Error de permisos RLS. Ejecuta el script fix-rls-policies-complete.sql en el SQL Editor de Supabase para corregir las políticas.');
        } else if (error.message.includes('Timeout')) {
          throw new Error('La consulta tardó demasiado. Verifica tu conexión a internet y las políticas RLS en Supabase.');
        }
        
        throw new Error(`Error al obtener usuarios: ${error.message}`);
      }

      console.log(`✅ Usuarios obtenidos: ${data?.length || 0}`);
      
      if (data && data.length > 0) {
        console.log('📋 Lista de usuarios:');
        data.forEach((u, index) => {
          console.log(`   ${index + 1}. ${u.email} (${u.rol}) - ID: ${u.id}`);
        });
      } else {
        console.warn('⚠️ No se obtuvieron usuarios. Verifica las políticas RLS.');
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Error en getAllUsers:', error);
      
      // Si es un error de timeout, proporcionar mensaje específico
      if (error.message && error.message.includes('Timeout')) {
        throw new Error('La consulta tardó demasiado tiempo. Por favor, verifica tu conexión y las políticas RLS en Supabase.');
      }
      
      // Si el error ya tiene un mensaje personalizado, lanzarlo tal cual
      if (error.message && error instanceof Error) {
        throw error;
      }
      throw new Error(error.message || 'Error al obtener usuarios. Por favor, intenta de nuevo.');
    }
  }

  /**
   * Obtener un usuario por ID
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Usuario
   */
  async getUserById(userId) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(`Error al obtener usuario: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error en getUserById:', error);
      throw error;
    }
  }

  /**
   * Actualizar un usuario (solo administradores)
   * @param {string} userId - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(userId, userData) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      // Validar rol si se está actualizando
      if (userData.rol && !['admin', 'vendedor', 'usuario'].includes(userData.rol)) {
        throw new Error('El rol debe ser: admin, vendedor o usuario');
      }

      const updateData = {};
      
      if (userData.username) updateData.username = userData.username;
      if (userData.nombre) updateData.nombre = userData.nombre;
      if (userData.rol) updateData.rol = userData.rol;
      if (userData.email) updateData.email = userData.email.trim().toLowerCase();

      console.log('🔄 Actualizando usuario:', userId, updateData);
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error al actualizar usuario:', error);
        
        // Proporcionar mensajes de error más específicos
        if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
          throw new Error('No tienes permisos para actualizar usuarios. Verifica que tengas el rol de administrador.');
        } else if (error.code === 'PGRST116') {
          throw new Error('Usuario no encontrado');
        } else if (error.message.includes('RLS')) {
          throw new Error('Error de permisos. Verifica que las políticas RLS estén configuradas correctamente.');
        }
        
        throw new Error(`Error al actualizar usuario: ${error.message}`);
      }

      console.log('✅ Usuario actualizado:', data);
      return data;
    } catch (error) {
      console.error('Error en updateUser:', error);
      throw error;
    }
  }

  /**
   * Eliminar un usuario (solo administradores)
   * @param {string} userId - ID del usuario
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      console.log('🗑️ Eliminando usuario:', userId);
      
      // Verificar que hay una sesión activa
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
      }

      // Verificar que el usuario no se esté eliminando a sí mismo
      if (session.user.id === userId) {
        throw new Error('No puedes eliminarte a ti mismo. Por favor, usa otra cuenta de administrador.');
      }

      // Primero, obtener el email del usuario antes de eliminarlo (para logging)
      let userEmail = null;
      try {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('email, nombre')
          .eq('id', userId)
          .maybeSingle();
        
        if (userData) {
          userEmail = userData.email;
          console.log('📧 Eliminando usuario:', userEmail || userId);
        } else if (fetchError) {
          console.warn('⚠️ No se pudo obtener información del usuario antes de eliminarlo:', fetchError);
        }
      } catch (fetchError) {
        console.warn('⚠️ Error al obtener información del usuario:', fetchError);
        // Continuar con la eliminación de todas formas
      }

      // Eliminar de la tabla users
      // IMPORTANTE: Necesitamos que haya un trigger en Supabase que elimine de auth.users
      // cuando se elimine de la tabla users, o usar una función Edge Function
      console.log('🔄 Eliminando usuario de la tabla users...');
      console.log('🔍 Usuario ID a eliminar:', userId);
      console.log('🔍 Sesión activa del administrador:', session.user.id);
      
      // Agregar timeout a la consulta DELETE
      const deletePromise = supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      // Crear una promesa con timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La consulta DELETE tardó más de 8 segundos')), 8000);
      });
      
      let deleteResult;
      try {
        deleteResult = await Promise.race([deletePromise, timeoutPromise]);
      } catch (raceError) {
        if (raceError.message && raceError.message.includes('Timeout')) {
          console.error('❌ Timeout al eliminar usuario:', raceError);
          throw new Error('La eliminación tardó demasiado tiempo. Esto puede deberse a problemas de conexión o permisos. Por favor, verifica tu conexión a internet y las políticas RLS en Supabase.');
        }
        throw raceError;
      }
      
      const { data: deleteData, error: deleteError } = deleteResult;

      if (deleteError) {
        console.error('❌ Error al eliminar usuario de la tabla users:', deleteError);
        console.error('   Código de error:', deleteError.code);
        console.error('   Mensaje:', deleteError.message);
        console.error('   Detalles:', deleteError.details);
        console.error('   Hint:', deleteError.hint);
        
        // Proporcionar mensajes de error más específicos
        if (deleteError.code === 'PGRST301' || deleteError.message.includes('permission denied')) {
          throw new Error('No tienes permisos para eliminar usuarios. Verifica que tengas el rol de administrador en Supabase.');
        } else if (deleteError.code === 'PGRST116') {
          throw new Error('Usuario no encontrado en la base de datos. Puede que ya haya sido eliminado.');
        } else if (deleteError.message.includes('RLS') || deleteError.message.includes('row-level security')) {
          throw new Error('Error de permisos RLS. Ejecuta el script fix-rls-definitive.sql en el SQL Editor de Supabase para corregir las políticas RLS.');
        } else if (deleteError.message.includes('foreign key') || deleteError.message.includes('constraint')) {
          throw new Error('No se puede eliminar el usuario porque tiene datos relacionados en otras tablas.');
        } else if (deleteError.message.includes('violates row-level security')) {
          throw new Error('Error de permisos. Verifica que tengas el rol de administrador y que las políticas RLS permitan la eliminación. Ejecuta fix-rls-definitive.sql en Supabase.');
        } else if (deleteError.code === 'PGRST204' || deleteError.message.includes('No rows')) {
          // Esto significa que el usuario ya no existe (puede que ya haya sido eliminado)
          console.warn('⚠️ El usuario no existe (puede que ya haya sido eliminado)');
          // No lanzar error, considerar que la eliminación fue exitosa
          console.log('✅ Usuario ya no existe en la base de datos (considerado como eliminado)');
          return;
        }
        
        throw new Error(`Error al eliminar usuario: ${deleteError.message}`);
      }

      console.log('✅ Usuario eliminado de la tabla users:', userId);
      console.log('📊 Resultado de eliminación:', deleteData);
      
      // CRÍTICO: Eliminar de auth.users usando la Edge Function
      // Esto es necesario para eliminar completamente el usuario
      try {
        const supabaseUrl = SUPABASE_CONFIG.url;
        if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
          const functionUrl = `${supabaseUrl}/functions/v1/delete-user`;
          
          // Obtener el token de acceso del administrador
          const { data: { session: adminSession }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('❌ Error al obtener sesión para Edge Function:', sessionError);
            throw new Error('No se pudo obtener la sesión del administrador para eliminar de auth.users');
          }
          
          if (!adminSession || !adminSession.access_token) {
            console.error('❌ No hay sesión activa para llamar a la Edge Function');
            throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
          }
          
          console.log('🔄 Llamando a Edge Function para eliminar de auth.users...');
          console.log('   URL:', functionUrl);
          console.log('   UserId:', userId);
          
          // Llamar a la Edge Function con timeout
          const deleteAuthPromise = fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${adminSession.access_token}`,
              'Content-Type': 'application/json',
              'apikey': SUPABASE_CONFIG.anonKey
            },
            body: JSON.stringify({ userId: userId })
          });
          
          const deleteAuthTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout: La Edge Function tardó demasiado')), 10000);
          });
          
          try {
            const deleteAuthResponse = await Promise.race([deleteAuthPromise, deleteAuthTimeout]);
            
            if (!deleteAuthResponse.ok) {
              const errorData = await deleteAuthResponse.json().catch(() => ({ error: 'Error desconocido' }));
              console.error('❌ Error en Edge Function:', errorData);
              throw new Error(`Error al eliminar de auth.users: ${errorData.error || deleteAuthResponse.statusText}`);
            }
            
            const result = await deleteAuthResponse.json();
            console.log('✅ Usuario eliminado de auth.users exitosamente:', result);
          } catch (functionError) {
            console.error('❌ Error al llamar a la Edge Function:', functionError);
            
            if (functionError.message && functionError.message.includes('Timeout')) {
              throw new Error('La eliminación de auth.users tardó demasiado tiempo. El usuario fue eliminado de public.users pero puede quedar en auth.users. Verifica manualmente en Supabase Dashboard.');
            } else if (functionError.message && functionError.message.includes('Failed to fetch')) {
              throw new Error('No se pudo conectar con la Edge Function. Verifica que la función esté desplegada en Supabase.');
            } else {
              throw new Error(`Error al eliminar de auth.users: ${functionError.message || 'Error desconocido'}`);
            }
          }
        } else {
          console.warn('⚠️ URL de Supabase no válida, no se puede llamar a la Edge Function');
          throw new Error('URL de Supabase no configurada correctamente');
        }
      } catch (authDeleteError) {
        console.error('❌ Error crítico al eliminar de auth.users:', authDeleteError);
        // Lanzar el error para que el usuario sepa que algo falló
        throw new Error(`Error al eliminar usuario completamente: ${authDeleteError.message}. El usuario fue eliminado de public.users pero puede quedar en auth.users.`);
      }

      return;
    } catch (error) {
      console.error('❌ Error en deleteUser:', error);
      
      // Si el error ya tiene un mensaje personalizado, lanzarlo tal cual
      if (error.message && error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Error al eliminar usuario. Por favor, intenta de nuevo.');
    }
  }

  /**
   * Actualizar contraseña de un usuario (solo administradores)
   * Nota: Esta funcionalidad requiere permisos de administrador en Supabase
   * Para producción, se recomienda crear una Edge Function
   * @param {string} userId - ID del usuario
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<void>}
   */
  async updateUserPassword(userId, newPassword) {
    if (!USE_SUPABASE) {
      throw new Error('El servicio de usuarios requiere Supabase');
    }

    try {
      if (!newPassword || newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Nota: Actualizar contraseña requiere permisos de administrador
      // Esto normalmente se hace a través de una Edge Function o usando el servicio de administración
      // Por ahora, lanzamos un error informativo
      throw new Error('La actualización de contraseña requiere permisos de administrador. Por favor, use el panel de Supabase o cree una Edge Function para esta funcionalidad.');
    } catch (error) {
      console.error('Error en updateUserPassword:', error);
      throw error;
    }
  }
}

export default new UserService();

