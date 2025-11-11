import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService';

// Importar vistas
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import CategoryView from '../views/CategoryView.vue';
import ClientView from '../views/ClientView.vue';
import StatisticsView from '../views/StatisticsView.vue';

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
      },
      {
        path: 'estadisticas',
        name: 'Statistics',
        component: StatisticsView,
        meta: {
          requiresAuth: true,
          title: 'Estadísticas'
        }
      },
      {
        path: 'usuarios',
        name: 'Users',
        component: () => import('../views/UsersView.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
          title: 'Gestión de Usuarios'
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
router.beforeEach(async (to, from, next) => {
  try {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    // Actualizar título de la página de forma segura
    try {
      if (typeof document !== 'undefined' && document.title !== undefined) {
        document.title = `GamerHub Pro - ${to.meta.title || 'Dashboard'}`;
      }
    } catch (titleError) {
      console.warn('Error al actualizar título:', titleError);
    }

    // Si la ruta requiere autenticación o admin
    if (requiresAuth || requiresAdmin) {
      try {
        // Verificar autenticación con timeout
        let isAuthenticated = false;
        try {
          isAuthenticated = await Promise.race([
            authService.isAuthenticatedAsync().catch(() => false),
            new Promise(resolve => setTimeout(() => resolve(false), 3000))
          ]);
        } catch (authError) {
          console.warn('Error al verificar autenticación:', authError);
          isAuthenticated = false;
        }
        
        if (!isAuthenticated && requiresAuth) {
          console.log('Usuario no autenticado, redirigiendo a login');
          next('/login');
          return;
        }

        // Si la ruta requiere admin, verificar el rol
        if (requiresAdmin && isAuthenticated) {
          try {
            const currentUser = await Promise.race([
              authService.getCurrentUserAsync().catch(() => null),
              new Promise(resolve => setTimeout(() => resolve(null), 3000))
            ]) || authService.getCurrentUser();
            
            if (!currentUser || currentUser.rol !== 'admin') {
              console.warn('Acceso denegado: Se requiere rol de administrador');
              next('/dashboard');
              return;
            }
          } catch (adminError) {
            console.error('Error al verificar rol de administrador:', adminError);
            // En caso de error, redirigir al dashboard
            next('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Error en el guard de navegación:', error);
        // En caso de error, redirigir al login si requiere auth
        if (requiresAuth) {
          next('/login');
          return;
        }
      }
    }

    // Si intenta ir al login y ya está autenticado, redirigir al dashboard
    if (to.path === '/login') {
      try {
        const isAuthenticated = await Promise.race([
          authService.isAuthenticatedAsync().catch(() => false),
          new Promise(resolve => setTimeout(() => resolve(false), 2000))
        ]);
        if (isAuthenticated) {
          next('/dashboard');
          return;
        }
      } catch (error) {
        // Si hay error, permitir acceso al login
        console.warn('Error al verificar autenticación en login:', error);
      }
    }

    // Permitir navegación
    next();
  } catch (error) {
    console.error('Error crítico en el router:', error);
    // En caso de error crítico, redirigir al login
    if (to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
  }
});

export default router;
