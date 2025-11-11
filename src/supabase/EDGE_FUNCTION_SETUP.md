# Configuración de Edge Function para Eliminar Usuarios

## Problema

Cuando se elimina un usuario desde la aplicación, el usuario se elimina de la tabla `public.users`, pero **NO se elimina de `auth.users`** (la tabla de autenticación de Supabase).

## Solución

Crear una Edge Function en Supabase que use el Admin API para eliminar usuarios de `auth.users`.

## Pasos para Configurar la Edge Function

### 1. Instalar Supabase CLI (si no lo tienes)

```bash
npm install -g supabase
```

### 2. Inicializar el proyecto (si no está inicializado)

```bash
supabase init
```

### 3. Crear la Edge Function

```bash
supabase functions new delete-user
```

### 4. Copiar el código

**IMPORTANTE**: Copia SOLO el código limpio, sin comentarios.

Abre el archivo `EDGE_FUNCTION_CODIGO_LIMPIO.txt` y copia SOLO el código entre las líneas `===`.

**NO copies:**
- Los comentarios de documentación
- Las líneas con `===`
- Cualquier texto fuera del bloque de código

El código debe empezar con:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
```

Y terminar con:
```typescript
})
```

Pega el código en el editor de Supabase Edge Functions.

### 5. Configurar variables de entorno

En Supabase Dashboard > Edge Functions > delete-user > Settings, agrega:
- `SUPABASE_URL`: Tu URL de Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Tu service_role key (NO la anon key)

### 6. Desplegar la función

```bash
supabase functions deploy delete-user
```

O desde el Dashboard de Supabase:
1. Ve a Edge Functions
2. Selecciona "delete-user"
3. Click en "Deploy"

### 7. Verificar que funciona

La función estará disponible en:
```
https://[tu-proyecto].supabase.co/functions/v1/delete-user
```

## Notas Importantes

1. **Service Role Key**: La service_role key tiene permisos de administrador. **NUNCA** la expongas en el código del cliente. Solo úsala en Edge Functions.

2. **Seguridad**: La función verifica que el usuario que llama sea administrador antes de eliminar.

3. **Eliminación Completa**: Una vez configurada, la función eliminará tanto de `public.users` como de `auth.users`.

## Alternativa: Eliminación Manual

Si no quieres crear la Edge Function, puedes eliminar usuarios de `auth.users` manualmente desde:
- Supabase Dashboard > Authentication > Users
- Selecciona el usuario y click en "Delete"

## Verificación

Después de configurar la función, cuando elimines un usuario desde la aplicación:
1. Se eliminará de `public.users` (ya funciona)
2. Se eliminará de `auth.users` (si la función está configurada)

Si la función no está configurada, el usuario quedará en `auth.users` pero **no podrá iniciar sesión** porque las políticas RLS verifican que exista en `public.users`.

