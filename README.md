# 🚀 TechStore Pro - Dashboard Administrativo

![Vue.js](https://img.shields.io/badge/Vue.js-3.4.21-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📋 Descripción del Proyecto

**TechStore Pro** es una aplicación web modular y responsiva desarrollada con Vue.js 3 y Bootstrap 5.3, diseñada para la gestión integral de una tienda de tecnología y electrónica. El proyecto implementa un dashboard administrativo completo con funcionalidades de autenticación, gestión de productos mediante API externa, y componentes reutilizables siguiendo las mejores prácticas de desarrollo.

### 🎯 Objetivo

Demostrar el dominio de modularización, componentización y consumo de APIs externas en aplicaciones web modernas, aplicando principios de arquitectura limpia y diseño responsivo.

---

## 🏗️ Estructura del Proyecto

```
Parcial_II_Desarrollo_web/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── NavbarComponent.vue      # Barra de navegación superior
│   │   ├── SidebarComponent.vue     # Menú lateral de navegación
│   │   ├── FooterComponent.vue      # Pie de página
│   │   └── ProductCardComponent.vue # Tarjeta de producto
│   │
│   ├── views/              # Vistas principales de la aplicación
│   │   ├── LoginView.vue           # Vista de inicio de sesión
│   │   ├── DashboardView.vue       # Contenedor del dashboard
│   │   ├── HomeView.vue            # Página principal del dashboard
│   │   ├── ProductView.vue         # Gestión de productos (CRUD)
│   │   ├── CategoryView.vue        # Vista de categorías
│   │   └── ClientView.vue          # Gestión de clientes
│   │
│   ├── services/           # Servicios y lógica de negocio
│   │   ├── api.js                  # Servicio de API (FakeStore API)
│   │   └── authService.js          # Servicio de autenticación
│   │
│   ├── data/               # Datos locales
│   │   └── usuarios.json           # Base de datos de usuarios (local)
│   │
│   ├── router/             # Configuración de rutas
│   │   └── index.js                # Vue Router con guards
│   │
│   ├── App.vue             # Componente raíz
│   └── main.js             # Punto de entrada de la aplicación
│
├── public/                 # Archivos estáticos
├── index.html              # HTML principal
├── package.json            # Dependencias del proyecto
├── vite.config.js          # Configuración de Vite
└── README.md               # Este archivo
```

---

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vue.js** | 3.4.21 | Framework progresivo para interfaces de usuario |
| **Vue Router** | 4.3.0 | Sistema de enrutamiento oficial de Vue |
| **Bootstrap** | 5.3.3 | Framework CSS para diseño responsivo |
| **Bootstrap Icons** | 1.11.3 | Iconografía del proyecto |
| **Axios** | 1.6.8 | Cliente HTTP para consumo de API |
| **Vite** | 5.2.0 | Herramienta de construcción y desarrollo |

---

## 🚦 Instalación y Configuración

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/Parcial_II_Desarrollo_web.git
cd Parcial_II_Desarrollo_web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

4. **Acceder a la aplicación**
```
http://localhost:3000
```

### Compilar para producción

```bash
npm run build
```

El build optimizado estará en la carpeta `dist/`.

---

## 👤 Usuarios de Prueba

La aplicación incluye usuarios predefinidos en `src/data/usuarios.json`:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Administrador |
| `vendedor` | `vendedor123` | Vendedor |
| `demo` | `demo123` | Usuario Demo |

> ⚠️ **IMPORTANTE**: Este sistema de autenticación es únicamente educativo. En producción, se debe implementar autenticación segura con backend, hash de contraseñas (bcrypt), tokens JWT y conexión HTTPS.

---

## 🎨 Características Principales

### 1. Sistema de Autenticación

- ✅ Login funcional con validación de credenciales
- ✅ Validación desde archivo JSON local
- ✅ Mensajes de error con Bootstrap Alerts
- ✅ Redirección automática al dashboard
- ✅ Protección de rutas con guards de navegación

**Archivo:** `src/views/LoginView.vue`  
**Servicio:** `src/services/authService.js`

### 2. Dashboard Principal

- ✅ Diseño responsivo con Navbar y Sidebar persistentes
- ✅ Estadísticas en tiempo real
- ✅ Accesos rápidos a funcionalidades principales
- ✅ Sistema de rutas anidadas (vue-router)
- ✅ Footer informativo

**Archivos:**
- `src/views/DashboardView.vue` (contenedor)
- `src/views/HomeView.vue` (página principal)

### 3. Gestión de Productos (CRUD)

Implementación completa de operaciones CRUD mediante API externa:

#### 📡 API Externa: FakeStore API

Base URL: `https://fakestoreapi.com`

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| **Listar** | GET | `/products` | Obtener todos los productos |
| **Obtener** | GET | `/products/:id` | Obtener producto por ID |
| **Crear** | POST | `/products` | Crear nuevo producto |
| **Actualizar** | PUT | `/products/:id` | Actualizar producto existente |
| **Eliminar** | DELETE | `/products/:id` | Eliminar producto |
| **Categorías** | GET | `/products/categories` | Listar categorías |
| **Por Categoría** | GET | `/products/category/:category` | Filtrar por categoría |

#### Ejemplo de Consumo

```javascript
import productService from '@/services/api';

// Obtener todos los productos
const productos = await productService.getAllProducts();

// Crear nuevo producto
const nuevoProducto = await productService.createProduct({
  title: 'Laptop Gaming',
  price: 1299.99,
  description: 'Potente laptop para gaming',
  category: 'electronics',
  image: 'https://ejemplo.com/laptop.jpg'
});

// Actualizar producto
await productService.updateProduct(1, {
  title: 'Laptop Gaming Pro',
  price: 1499.99
});

// Eliminar producto
await productService.deleteProduct(1);
```

**Características:**
- ✅ Tabla responsiva con Bootstrap
- ✅ Búsqueda en tiempo real
- ✅ Filtrado por categorías
- ✅ Modal para crear/editar productos
- ✅ Confirmación antes de eliminar
- ✅ Feedback visual con alertas

**Archivo:** `src/views/ProductView.vue`  
**Servicio:** `src/services/api.js`

### 4. Componentes Reutilizables

#### NavbarComponent
Barra de navegación superior con:
- Logo y nombre del negocio
- Menú de usuario con dropdown
- Información de sesión
- Botón de cerrar sesión

**Props:**
```javascript
{
  currentUser: Object // Usuario actual
}
```

**Eventos:**
```javascript
@logout // Emitido al cerrar sesión
```

#### SidebarComponent
Menú lateral de navegación con:
- Enlaces a todas las secciones
- Indicador de ruta activa
- Información del usuario
- Diseño responsivo

**Props:**
```javascript
{
  currentUser: Object // Usuario actual
}
```

#### FooterComponent
Pie de página con:
- Información del negocio
- Enlaces rápidos
- Redes sociales
- Copyright dinámico

#### ProductCardComponent
Tarjeta individual de producto con:
- Imagen del producto
- Título y descripción
- Precio destacado
- Rating con estrellas
- Botones de acción (ver, editar, eliminar)

**Props:**
```javascript
{
  product: Object // Objeto del producto
}
```

**Eventos:**
```javascript
@view(product)   // Ver detalles
@edit(product)   // Editar producto
@delete(product) // Eliminar producto
```

**Ejemplo de uso:**
```vue
<ProductCardComponent
  :product="producto"
  @view="verDetalles"
  @edit="editarProducto"
  @delete="eliminarProducto"
/>
```

### 5. Comunicación entre Componentes

#### Props (Padre → Hijo)
```vue
<!-- DashboardView.vue -->
<NavbarComponent :currentUser="currentUser" />
<SidebarComponent :currentUser="currentUser" />
```

#### Eventos (Hijo → Padre)
```vue
<!-- En el componente hijo -->
this.$emit('logout');

<!-- En el componente padre -->
<NavbarComponent @logout="handleLogout" />
```

#### Servicios Compartidos
```javascript
// authService.js - Singleton compartido
import authService from '@/services/authService';

// Usar en cualquier componente
const usuario = authService.getCurrentUser();
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
:root {
  --primary: #0d6efd;      /* Azul tecnológico */
  --secondary: #6c757d;    /* Gris neutro */
  --success: #28a745;      /* Verde éxito */
  --warning: #ffc107;      /* Amarillo advertencia */
  --danger: #dc3545;       /* Rojo peligro */
  --info: #17a2b8;         /* Azul información */
  
  /* Gradientes personalizados */
  --tech-gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --tech-gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

### Tipografía

- **Familia:** System UI fonts (-apple-system, Segoe UI, Roboto)
- **Tamaños:** Sistema responsivo con rem
- **Pesos:** Regular (400), Medium (500), Bold (700)

### Componentes Bootstrap Personalizados

- Cards con hover effects
- Botones con transiciones suaves
- Formularios con validación visual
- Modales con animaciones
- Alertas estilizadas
- Tablas responsivas

---

## 🛣️ Sistema de Rutas

### Configuración de Vue Router

```javascript
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: HomeView
      },
      {
        path: 'productos',
        component: ProductView
      },
      {
        path: 'categorias',
        component: CategoryView
      },
      {
        path: 'clientes',
        component: ClientView
      }
    ]
  }
];
```

### Guards de Navegación

```javascript
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = authService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
```

---

## 📝 Buenas Prácticas Implementadas

### 1. Estructura de Código
- ✅ Separación de responsabilidades (componentes, vistas, servicios)
- ✅ Nomenclatura consistente (PascalCase para componentes)
- ✅ Comentarios JSDoc en funciones complejas
- ✅ Organización lógica de archivos

### 2. Vue.js
- ✅ Composition API y Options API según conveniencia
- ✅ Props tipadas con validación
- ✅ Eventos personalizados documentados
- ✅ Computed properties para datos derivados
- ✅ Ciclo de vida optimizado

### 3. JavaScript
- ✅ Async/await para operaciones asíncronas
- ✅ Manejo de errores con try-catch
- ✅ Arrow functions y destructuring
- ✅ Template literals para strings
- ✅ Promesas correctamente gestionadas

### 4. CSS/Bootstrap
- ✅ Clases utilitarias de Bootstrap
- ✅ Scoped styles en componentes Vue
- ✅ Variables CSS personalizadas
- ✅ Mobile-first approach
- ✅ Animaciones con CSS

### 5. Seguridad
- ✅ Validación de entrada del usuario
- ✅ Sanitización de datos
- ✅ Guards de navegación
- ✅ Manejo seguro de estado

---

## 🤝 Trabajo Colaborativo (GitHub)

### Configuración del Repositorio

```bash
# Inicializar repositorio
git init

# Añadir remote
git remote add origin https://github.com/usuario/Parcial_II_Desarrollo_web.git

# Primer commit
git add .
git commit -m "🎉 Initial commit: Estructura base del proyecto"
git push -u origin main
```

### Flujo de Trabajo con Ramas

```bash
# Crear rama para nueva funcionalidad
git checkout -b feature/gestion-productos

# Hacer cambios y commits
git add src/views/ProductView.vue
git commit -m "✨ Implementar gestión de productos con CRUD"

# Subir rama
git push origin feature/gestion-productos

# Crear Pull Request en GitHub
# Revisar y mergear a main
```

### Convenciones de Commits

- `🎉 :tada:` - Initial commit
- `✨ :sparkles:` - Nueva funcionalidad
- `🐛 :bug:` - Corrección de bugs
- `📝 :memo:` - Documentación
- `💄 :lipstick:` - Estilos/UI
- `♻️ :recycle:` - Refactorización
- `⚡ :zap:` - Mejora de rendimiento

### Evidencias de Colaboración

1. **Commits**: Historial completo en GitHub
2. **Branches**: Ramas de features y fixes
3. **Pull Requests**: Revisiones de código
4. **Issues**: Seguimiento de tareas
5. **Projects**: Tablero Kanban (opcional)

---

## 📊 Funcionalidades por Vista

### LoginView
- ✅ Formulario de inicio de sesión
- ✅ Validación de credenciales
- ✅ Mensajes de error
- ✅ Toggle de contraseña visible
- ✅ Redirección automática

### DashboardView (HomeView)
- ✅ Tarjetas de estadísticas
- ✅ Gráficos y métricas
- ✅ Accesos rápidos
- ✅ Actividad reciente
- ✅ Información del usuario

### ProductView
- ✅ Listado de productos en grid
- ✅ Búsqueda en tiempo real
- ✅ Filtro por categoría
- ✅ Modal crear/editar producto
- ✅ Confirmación de eliminación
- ✅ Vista de detalles

### CategoryView
- ✅ Tarjetas de categorías
- ✅ Gradientes personalizados
- ✅ Navegación a productos filtrados
- ✅ Animaciones smooth

### ClientView
- ✅ Tabla de clientes
- ✅ Búsqueda de clientes
- ✅ Estadísticas de clientes
- ✅ Acciones CRUD (UI preparada)

---

## 🔍 Testing y Debugging

### Logs de Desarrollo

La aplicación incluye logs en consola para debugging:

```javascript
console.log('✅ Aplicación TechStore Pro iniciada correctamente');
```

### Herramientas Recomendadas

- Vue DevTools (extensión de navegador)
- Chrome DevTools / Firefox DevTools
- Network tab para inspeccionar peticiones API
- Console para ver logs y errores

---

## 📱 Responsive Design

### Breakpoints de Bootstrap

- **xs**: < 576px (móviles)
- **sm**: ≥ 576px (móviles landscape)
- **md**: ≥ 768px (tablets)
- **lg**: ≥ 992px (desktops)
- **xl**: ≥ 1200px (desktops grandes)

### Adaptaciones Responsive

- Sidebar se oculta en móvil
- Grid de productos ajusta columnas
- Tablas con scroll horizontal
- Formularios en ancho completo
- Navegación colapsable

---

## 🚀 Despliegue

### Opciones de Hosting

1. **Vercel** (recomendado)
```bash
npm install -g vercel
vercel
```

2. **Netlify**
```bash
npm run build
# Subir carpeta dist/ a Netlify
```

3. **GitHub Pages**
```bash
npm run build
gh-pages -d dist
```

---

## 📚 Recursos y Referencias

- [Vue.js 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Bootstrap 5.3 Documentation](https://getbootstrap.com/)
- [FakeStore API Documentation](https://fakestoreapi.com/docs)
- [Axios Documentation](https://axios-http.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## 👥 Equipo de Desarrollo

**Integrantes del Grupo:**
- Estudiante 1: [Nombre completo]
- Estudiante 2: [Nombre completo]

**Institución:** [Tu universidad]  
**Curso:** Desarrollo de Aplicaciones Web  
**Período:** [Período académico]  
**Profesor:** [Nombre del profesor]

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos para el Segundo Parcial de Desarrollo de Aplicaciones Web.

---

## 🎓 Conclusiones

Este proyecto demuestra la implementación exitosa de:

1. **Modularización**: Código organizado en componentes reutilizables
2. **Componentización**: Componentes Vue independientes y comunicados
3. **Consumo de API**: Integración completa con FakeStore API
4. **Diseño Responsivo**: Interfaz adaptable con Bootstrap 5.3
5. **Buenas Prácticas**: Código limpio, comentado y estructurado
6. **Enrutamiento**: Sistema de navegación con vue-router
7. **Autenticación**: Sistema de login funcional (educativo)

---

## 📞 Contacto y Soporte

Para dudas o sugerencias sobre el proyecto:

- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [https://github.com/tu-usuario](https://github.com/tu-usuario)

---

**¡Gracias por revisar este proyecto! 🚀**

