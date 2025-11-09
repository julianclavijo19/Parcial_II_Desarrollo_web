import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importar Bootstrap JavaScript (para componentes interactivos)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

/**
 * Crear y montar la aplicación Vue
 */
const app = createApp(App);

// Usar el router
app.use(router);

// Montar la aplicación en el elemento con id="app"
app.mount('#app');

// Log de inicio
console.log('✅ Aplicación TechStore Pro iniciada correctamente');

