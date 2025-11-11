-- ============================================
-- TRIGGER PARA ELIMINAR USUARIO DE auth.users
-- cuando se elimina de la tabla public.users
-- ============================================
-- 
-- IMPORTANTE: Este trigger requiere permisos especiales
-- y debe ejecutarse con permisos de administrador en Supabase
--
-- NOTA: En Supabase, no es posible eliminar directamente de auth.users
-- desde un trigger de PostgreSQL debido a las restricciones de seguridad.
-- 
-- SOLUCIÓN ALTERNATIVA: Crear una Edge Function en Supabase
-- que use el Admin API para eliminar usuarios de auth.users
--
-- ============================================

-- Opción 1: Crear una función que intente eliminar de auth.users
-- (Nota: Esto puede no funcionar debido a restricciones de seguridad)
CREATE OR REPLACE FUNCTION delete_user_from_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Intentar eliminar de auth.users usando el Admin API
  -- NOTA: Esto requiere permisos especiales y puede no funcionar
  -- desde un trigger de PostgreSQL en Supabase
  
  -- Por seguridad, solo permitir eliminación si el usuario que ejecuta
  -- tiene permisos de administrador
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND rol = 'admin'
  ) THEN
    RAISE EXCEPTION 'Solo los administradores pueden eliminar usuarios';
  END IF;
  
  -- NOTA: No podemos eliminar directamente de auth.users desde aquí
  -- porque requiere el Admin API de Supabase
  
  RETURN OLD;
END;
$$;

-- ============================================
-- SOLUCIÓN RECOMENDADA: Edge Function
-- ============================================
-- 
-- Para eliminar usuarios de auth.users, crea una Edge Function en Supabase:
--
-- 1. Ve a Supabase Dashboard > Edge Functions
-- 2. Crea una nueva función llamada "delete-user"
-- 3. Usa el siguiente código:
--
-- ```
-- import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
-- import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
--
-- const corsHeaders = {
--   'Access-Control-Allow-Origin': '*',
--   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
-- }
--
-- serve(async (req) => {
--   // Handle CORS
--   if (req.method === 'OPTIONS') {
--     return new Response('ok', { headers: corsHeaders })
--   }
//
//   try {
//     // Crear cliente de Supabase con service_role key
//     const supabaseAdmin = createClient(
//       Deno.env.get('SUPABASE_URL') ?? '',
//       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
//       {
//         auth: {
//           autoRefreshToken: false,
//           persistSession: false
//         }
//       }
//     )
//
//     // Obtener el token de autorización del request
//     const authHeader = req.headers.get('Authorization')
//     if (!authHeader) {
//       throw new Error('No authorization header')
//     }
//
//     // Verificar que el usuario autenticado es administrador
//     const token = authHeader.replace('Bearer ', '')
//     const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
//
//     if (userError || !user) {
//       throw new Error('Invalid token')
//     }
//
//     // Verificar que el usuario es administrador
//     const { data: userData, error: checkError } = await supabaseAdmin
//       .from('users')
//       .select('rol')
//       .eq('id', user.id)
//       .single()
//
//     if (checkError || !userData || userData.rol !== 'admin') {
//       throw new Error('Unauthorized: Only administrators can delete users')
//     }
//
//     // Obtener el userId del body
//     const { userId } = await req.json()
//
//     if (!userId) {
//       throw new Error('userId is required')
//     }
//
//     // Eliminar de auth.users usando Admin API
//     const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
//
//     if (deleteError) {
//       throw deleteError
//     }
//
//     return new Response(
//       JSON.stringify({ success: true, message: 'User deleted from auth.users' }),
//       {
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         status: 200,
//       }
//     )
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ error: error.message }),
//       {
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         status: 400,
//       }
//     )
//   }
// })
-- ```
--
-- 4. Despliega la función
-- 5. Llama a la función desde el cliente con:
--    fetch('https://[tu-proyecto].supabase.co/functions/v1/delete-user', {
--      method: 'POST',
--      headers: {
--        'Authorization': `Bearer ${session.access_token}`,
--        'Content-Type': 'application/json'
--      },
--      body: JSON.stringify({ userId: userId })
--    })
--
-- ============================================

-- ============================================
-- ALTERNATIVA SIMPLE: Solo eliminar de public.users
-- ============================================
-- 
-- Por ahora, podemos eliminar solo de public.users.
-- El usuario no podrá iniciar sesión porque:
-- 1. Las políticas RLS verifican que el usuario exista en public.users
-- 2. Si no existe en public.users, no podrá autenticarse
--
-- Para eliminar completamente de auth.users, el administrador
-- debe hacerlo manualmente desde el Dashboard de Supabase o
-- usar la Edge Function mencionada arriba.
--
-- ============================================

