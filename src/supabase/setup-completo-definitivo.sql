-- ============================================
-- SCRIPT DEFINITIVO COMPLETO PARA SUPABASE
-- Ejecutar este script en el SQL Editor de Supabase
-- Este script configura TODO lo necesario de una vez
-- ============================================

-- ============================================
-- PASO 1: Crear tabla users si no existe
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT,
  username TEXT,
  rol TEXT NOT NULL DEFAULT 'usuario' CHECK (rol IN ('admin', 'vendedor', 'usuario')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PASO 2: Habilitar RLS en la tabla users
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 3: Eliminar TODAS las políticas existentes
-- ============================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON users';
    END LOOP;
END $$;

-- ============================================
-- PASO 4: Crear función is_admin() mejorada
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  user_role TEXT;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  BEGIN
    SELECT rol INTO user_role
    FROM public.users
    WHERE id = current_user_id
    LIMIT 1;
    
    IF user_role IS NULL THEN
      RETURN FALSE;
    END IF;
    
    RETURN LOWER(TRIM(user_role)) = 'admin';
  EXCEPTION
    WHEN OTHERS THEN
      RETURN FALSE;
  END;
END;
$$;

-- ============================================
-- PASO 5: Crear trigger para crear usuario automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, nombre, username, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'usuario')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PASO 6: Crear políticas RLS para usuarios (sus propios datos)
-- ============================================

-- Política 1: Los usuarios pueden leer sus propios datos
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Política 2: Los usuarios pueden actualizar sus propios datos
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política 3: Los usuarios pueden insertar sus propios datos (para el trigger)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- PASO 7: Crear políticas RLS para administradores
-- ============================================

-- Política 4: Los administradores pueden leer TODOS los datos
CREATE POLICY "Admins can read all data"
  ON users
  FOR SELECT
  USING (is_admin() = true);

-- Política 5: Los administradores pueden insertar usuarios
CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  WITH CHECK (is_admin() = true);

-- Política 6: Los administradores pueden actualizar TODOS los datos
CREATE POLICY "Admins can update all data"
  ON users
  FOR UPDATE
  USING (is_admin() = true)
  WITH CHECK (is_admin() = true);

-- Política 7: Los administradores pueden eliminar usuarios
CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  USING (is_admin() = true);

-- ============================================
-- PASO 8: Crear función para actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Crear trigger para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PASO 9: Verificar configuración
-- ============================================

-- Verificar políticas
SELECT 
  'Políticas RLS' as verificacion,
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Verificar función is_admin
SELECT 
  'Función is_admin' as verificacion,
  proname as function_name,
  prosecdef as is_security_definer
FROM pg_proc
WHERE proname = 'is_admin';

-- Verificar usuarios y roles
SELECT 
  'Usuarios' as verificacion,
  id,
  email,
  rol,
  created_at
FROM users
ORDER BY created_at DESC;

-- ============================================
-- PASO 10: Asegurar que el usuario admin tiene rol 'admin'
-- ============================================
-- Si el usuario admin@techstore.com existe pero no tiene rol 'admin', actualizarlo
UPDATE users 
SET rol = 'admin' 
WHERE email = 'admin@techstore.com' 
  AND (rol IS NULL OR rol != 'admin');

-- Verificar usuario admin
SELECT 
  'Usuario Admin' as verificacion,
  id,
  email,
  rol,
  CASE 
    WHEN rol = 'admin' THEN '✅ Es administrador'
    ELSE '❌ NO es administrador'
  END as status
FROM users
WHERE email = 'admin@techstore.com';

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. Este script configura TODO lo necesario de una vez
-- 2. auth.uid() retornará NULL en el SQL Editor (esto es normal)
-- 3. En la aplicación Vue.js, auth.uid() funcionará correctamente
-- 4. El trigger crea automáticamente un registro en users cuando se crea un usuario en auth.users
-- 5. Las políticas RLS permiten a los administradores hacer todas las operaciones
-- 6. Los usuarios normales solo pueden ver/editar sus propios datos
-- ============================================

