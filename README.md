# 🎮 GamerHub Pro - Dashboard Administrativo

![Vue.js](https://img.shields.io/badge/Vue.js-3.4.21-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=flat-square&logo=vite&logoColor=white)

## 📋 Descripción

**GamerHub Pro** es una aplicación web modular para la gestión administrativa de una tienda especializada en PC Gaming y Periféricos. Implementa un dashboard minimalista y funcional con autenticación, gestión CRUD de productos mediante consumo de API externa, y arquitectura basada en componentes reutilizables.

**Tipo de Negocio**: Tienda de Hardware Gaming (PC Gamer, Periféricos, Componentes)

### 🎯 Objetivo

Demostrar competencias en:
- Modularización y componentización con Vue.js 3
- Consumo de APIs REST externas
- Diseño responsivo con Bootstrap 5.3
- Enrutamiento SPA con Vue Router
- Arquitectura limpia y buenas prácticas

---

## 🏗️ Estructura del Proyecto

```
Parcial_II_Desarrollo_web/
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── NavbarComponent.vue
│   │   ├── SidebarComponent.vue
│   │   ├── FooterComponent.vue
│   │   └── ProductCardComponent.vue
│   │
│   ├── views/                   # Vistas principales
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   ├── HomeView.vue
│   │   ├── ProductView.vue
│   │   ├── CategoryView.vue
│   │   └── ClientView.vue
│   │
│   ├── services/                # Lógica de negocio
│   │   ├── api.js              # Servicio API (DummyJSON)
│   │   └── authService.js      # Autenticación
│   │
│   ├── data/
│   │   └── usuarios.json       # Usuarios de prueba
│   │
│   ├── router/
│   │   └── index.js            # Vue Router + Guards
│   │
│   ├── App.vue                 # Componente raíz
│   └── main.js                 # Entry point
│
├── package.json                # Dependencias
├── vite.config.js              # Configuración Vite
└── README.md
```

---

## 🔧 Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Vue.js** | 3.4.21 | Framework frontend |
| **Vue Router** | 4.3.0 | Enrutamiento SPA |
| **Bootstrap** | 5.3.3 | Framework CSS |
| **Bootstrap Icons** | 1.11.3 | Iconografía |
| **Axios** | 1.6.8 | Cliente HTTP |
| **Vite** | 5.2.0 | Build tool |
| **DummyJSON** | - | API REST externa |

---

## 🎨 Características Principales

### 1. Sistema de Autenticación
- Login funcional con validación desde JSON local
- Protección de rutas con guards de navegación
- Mensajes de error visuales con Bootstrap
- Redirección automática post-login

**Usuarios de prueba**:
- `admin` / `admin123`
- `vendedor` / `vendedor123`
- `demo` / `demo123`

> **Nota**: Sistema educativo. No usar en producción sin implementar seguridad adecuada (bcrypt, JWT, HTTPS).

### 2. Dashboard Minimalista
- Navbar superior con perfil de usuario
- Sidebar lateral con navegación persistente
- Vista home con estadísticas y métricas
- Diseño limpio y funcional
- Footer informativo

### 3. Gestión de Productos (CRUD)
Operaciones completas mediante API externa DummyJSON:

| Operación | Método | Endpoint |
|-----------|--------|----------|
| Listar productos | GET | `/products` |
| Obtener por ID | GET | `/products/{id}` |
| Crear producto | POST | `/products/add` |
| Actualizar | PUT | `/products/{id}` |
| Eliminar | DELETE | `/products/{id}` |
| Categorías | GET | `/products/categories` |

**Funcionalidades**:
- Grid responsivo de productos
- Búsqueda en tiempo real
- Filtro por categorías
- Modal para crear/editar
- Confirmación antes de eliminar
- Vista detallada de productos

### 4. Gestión de Categorías
- Vista dedicada para explorar categorías
- Navegación a productos filtrados
- Diseño con tarjetas visuales

### 5. Gestión de Clientes
- Tabla responsiva de clientes
- Búsqueda y filtros
- Estadísticas de clientes
- Interfaz preparada para CRUD

---

## 🧩 Componentes Reutilizables

### NavbarComponent
Barra de navegación superior

**Props**: `currentUser` (Object)  
**Eventos**: `@logout`

### SidebarComponent
Menú lateral de navegación

**Props**: `currentUser` (Object)

### FooterComponent
Pie de página con información y links

### ProductCardComponent
Tarjeta individual de producto

**Props**: `product` (Object)  
**Eventos**: `@view`, `@edit`, `@delete`

---

## 📡 Consumo de API Externa

### DummyJSON API

**Base URL**: `https://dummyjson.com`

Ejemplo de implementación en `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

class ProductService {
  async getAllProducts() {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data.products;
  }
  
  async createProduct(product) {
    const response = await axios.post(
      `${API_BASE_URL}/products/add`, 
      product
    );
    return response.data;
  }
  // ... más métodos
}
```

---

## 🔄 Comunicación entre Componentes

### Props (Padre → Hijo)
```vue
<NavbarComponent :currentUser="usuario" />
<ProductCardComponent :product="producto" />
```

### Eventos (Hijo → Padre)
```vue
<!-- Componente hijo emite -->
this.$emit('logout');
this.$emit('delete', producto);

<!-- Componente padre escucha -->
<NavbarComponent @logout="handleLogout" />
<ProductCardComponent @delete="eliminar" />
```

### Servicios Compartidos
```javascript
// Singleton accesible globalmente
import authService from '@/services/authService';
import productService from '@/services/api';
```

---

## 🛣️ Sistema de Rutas

```javascript
/                          → Redirect a /login
/login                     → LoginView
/dashboard                 → DashboardView (requiere auth)
  ├─ /                     → HomeView
  ├─ /productos            → ProductView
  ├─ /categorias           → CategoryView
  └─ /clientes             → ClientView
```

**Guards de navegación**: Protección de rutas con verificación de autenticación en `router/index.js`.

---

## 🎨 Diseño y Estilos

### Paleta de Colores Gaming
- **Primario**: Negro (#000000)
- **Secundario**: Rojo (#dc3545)
- **Acento**: Verde Neón (#00ff88)
- **Fondo**: Gris oscuro (#1a1d20)

### Principios de Diseño
- Minimalismo y funcionalidad
- Espaciado generoso
- Tipografía clara y legible
- Animaciones sutiles
- Responsive design (mobile-first)

---

## 📂 Modularización

### Componentes
Cada componente es autocontenido con:
- Template HTML
- Lógica JavaScript (script)
- Estilos scoped CSS

### Servicios
Lógica de negocio separada en clases:
- `api.js`: Consumo de API REST
- `authService.js`: Gestión de autenticación

### Vistas
Componentes de página que combinan componentes reutilizables

### Router
Sistema centralizado de enrutamiento con guards

---

## ✅ Buenas Prácticas Implementadas

- ✅ Separación de responsabilidades (SoC)
- ✅ Componentes reutilizables y modulares
- ✅ Props con validación de tipos
- ✅ Eventos personalizados documentados
- ✅ Manejo de errores con try-catch
- ✅ Async/await para operaciones asíncronas
- ✅ Comentarios JSDoc en funciones
- ✅ Código limpio y legible
- ✅ Arquitectura escalable
- ✅ Diseño responsivo

---

## 🤝 Trabajo Colaborativo

### Repositorio GitHub
- URL: `https://github.com/[usuario]/Parcial_II_Desarrollo_web`
- Visibilidad: Público
- Commits organizados por feature
- Evidencia de colaboración entre integrantes

### Historial de Commits
```
✅ Configuración base del proyecto
✅ Implementación de servicios API
✅ Creación de componentes reutilizables
✅ Implementación de vistas principales
✅ Configuración de Vue Router
✅ Documentación completa
```

---

## 👥 Equipo de Desarrollo

**Integrantes**:
- [Nombre Estudiante 1]
- [Nombre Estudiante 2]

**Institución**: [Universidad]  
**Asignatura**: Desarrollo de Aplicaciones Web  
**Período**: 2025  

---

## 📄 Licencia

Proyecto desarrollado con fines educativos - Segundo Parcial

---

**GamerHub Pro** © 2025 - Dashboard Administrativo para Tienda Gaming
