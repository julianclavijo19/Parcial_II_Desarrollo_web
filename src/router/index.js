import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService';

// Importar vistas
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import CategoryView from '../views/CategoryView.vue';
import ClientView from '../views/ClientView.vue';

/**
 * Configuración de rutas de la aplicación
 * Se utiliza vue-router para gestionar la navegación entre vistas
 */
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false,
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true,
      title: 'Dashboard'
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: HomeView,
        meta: {
          requiresAuth: true,
          title: 'Inicio'
        }
      },
      {
        path: 'productos',
        name: 'Products',
        component: ProductView,
        meta: {
          requiresAuth: true,
          title: 'Productos'
        }
      },
      {
        path: 'categorias',
        name: 'Categories',
        component: CategoryView,
        meta: {
          requiresAuth: true,
          title: 'Categorías'
        }
      },
      {
        path: 'clientes',
        name: 'Clients',
        component: ClientView,
        meta: {
          requiresAuth: true,
          title: 'Clientes'
        }
      }
    ]
  },
  {
    // Ruta 404 - No encontrada
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

/**
 * Crear instancia del router
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

/**
 * Guard de navegación global
 * Protege las rutas que requieren autenticación
 */
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = authService.isAuthenticated();

  // Actualizar título de la página
  document.title = `GamerHub Pro - ${to.meta.title || 'Dashboard'}`;

  if (requiresAuth && !isAuthenticated) {
    // Redirigir al login si la ruta requiere autenticación y no está autenticado
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirigir al dashboard si ya está autenticado e intenta ir al login
    next('/dashboard');
  } else {
    // Permitir navegación
    next();
  }
});

export default router;

