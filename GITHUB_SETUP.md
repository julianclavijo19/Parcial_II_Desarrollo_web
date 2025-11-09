# 📦 Instrucciones para Subir el Proyecto a GitHub

## 1️⃣ Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** o **"+"** → **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `Parcial_II_Desarrollo_web`
   - **Description**: "Dashboard modular TechStore Pro - Vue.js 3 + Bootstrap 5.3"
   - **Visibility**: Público ✅
   - **NO marques**: Initialize with README (ya tenemos uno)
4. Haz clic en **"Create repository"**

## 2️⃣ Conectar Repositorio Local con GitHub

Copia el URL de tu repositorio (debe verse así: `https://github.com/TU_USUARIO/Parcial_II_Desarrollo_web.git`)

Luego ejecuta estos comandos en tu terminal:

```bash
# Agregar el remote (reemplaza TU_USUARIO con tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/Parcial_II_Desarrollo_web.git

# Renombrar la rama a main (si es necesario)
git branch -M main

# Subir todos los commits
git push -u origin main
```

## 3️⃣ Verificar que se Subió Correctamente

1. Recarga la página de tu repositorio en GitHub
2. Deberías ver todos los archivos del proyecto
3. Verifica que el README.md se muestre correctamente
4. Revisa el historial de commits en la pestaña **"Commits"**

## 4️⃣ Trabajo Colaborativo (Para el segundo integrante)

### Opción A: Colaborador Directo

1. El dueño del repo va a **Settings** → **Collaborators** → **Add people**
2. Invita al compañero por su usuario o email de GitHub
3. El compañero acepta la invitación

### Opción B: Fork y Pull Request

1. El compañero hace **Fork** del repositorio
2. Clona su fork: `git clone https://github.com/SU_USUARIO/Parcial_II_Desarrollo_web.git`
3. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
4. Hace cambios, commits y push a su fork
5. Crea un **Pull Request** desde GitHub

## 5️⃣ Flujo de Trabajo Recomendado

### Crear una Nueva Funcionalidad

```bash
# Actualizar el repositorio local
git pull origin main

# Crear una rama para la nueva funcionalidad
git checkout -b feature/nombre-funcionalidad

# Hacer cambios en el código
# ... editar archivos ...

# Agregar cambios
git add .

# Hacer commit descriptivo
git commit -m "feat: Descripcion de los cambios"

# Subir la rama a GitHub
git push origin feature/nombre-funcionalidad

# Ir a GitHub y crear un Pull Request
```

### Tipos de Commits Recomendados

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de estilo/formato
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

## 6️⃣ Comandos Útiles

```bash
# Ver estado de los archivos
git status

# Ver historial de commits
git log --oneline

# Ver ramas
git branch -a

# Cambiar de rama
git checkout nombre-rama

# Ver los remotes configurados
git remote -v

# Actualizar desde GitHub
git pull origin main

# Ver diferencias antes de commit
git diff
```

## 7️⃣ Obtener el Enlace del Repositorio

Una vez subido el proyecto, el enlace de tu repositorio será:

```
https://github.com/TU_USUARIO/Parcial_II_Desarrollo_web
```

**Este es el enlace que debes pegar en la entrega de la actividad en la UVirtual.**

## 🎯 Checklist Final

Antes de entregar, verifica que:

- [ ] El repositorio es público
- [ ] El README.md se ve correctamente
- [ ] Todos los archivos del proyecto están subidos
- [ ] Hay múltiples commits organizados
- [ ] Los dos integrantes aparecen como colaboradores
- [ ] Hay evidencia de trabajo colaborativo (commits de ambos)
- [ ] El enlace del repositorio funciona correctamente

## 🆘 Solución de Problemas

### Error: "Permission denied"
```bash
# Verificar que el remote está bien configurado
git remote -v

# Cambiar a HTTPS si usas SSH y tienes problemas
git remote set-url origin https://github.com/TU_USUARIO/Parcial_II_Desarrollo_web.git
```

### Error: "Updates were rejected"
```bash
# Primero hacer pull
git pull origin main --rebase

# Luego hacer push
git push origin main
```

### Olvidé agregar algo en el último commit
```bash
# Agregar los archivos olvidados
git add archivo-olvidado.txt

# Modificar el último commit
git commit --amend --no-edit

# Forzar push (solo si no has compartido el commit)
git push origin main --force-with-lease
```

---

## 📞 Contacto

Si tienes problemas, consulta:
- [Documentación de Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- Profesor o compañeros de clase

---

**¡Éxito con tu proyecto! 🚀**

