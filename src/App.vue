<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    console.log('%c🚀 TechStore Pro Dashboard', 'color: #0d6efd; font-size: 20px; font-weight: bold;');
    console.log('%c📦 Aplicación modular con Vue.js y Bootstrap 5.3', 'color: #6c757d; font-size: 14px;');
    console.log('%c⚡ Desarrollado para propósitos educativos', 'color: #28a745; font-size: 12px;');
  }
}
</script>

<style>
/* Importar Bootstrap y sus iconos */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

/* Variables personalizadas de Bootstrap */
:root {
  --bs-primary: #0d6efd;
  --bs-primary-rgb: 13, 110, 253;
  --bs-secondary: #6c757d;
  --bs-success: #28a745;
  --bs-info: #17a2b8;
  --bs-warning: #ffc107;
  --bs-danger: #dc3545;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;
  
  /* Colores personalizados para TechStore */
  --tech-gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --tech-gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --tech-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* Reset y estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #212529;
  background-color: #f8f9fa;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

/* Estilos para scrollbar personalizado */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Animaciones globales */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Utilidades personalizadas */
.fade-in {
  animation: fadeIn 0.5s ease;
}

.slide-in {
  animation: slideIn 0.5s ease;
}

.text-gradient {
  background: var(--tech-gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shadow-custom {
  box-shadow: var(--tech-shadow) !important;
}

/* Mejoras en componentes de Bootstrap */
.btn {
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.btn:active {
  transform: scale(0.98);
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}

/* Responsive */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  html {
    font-size: 13px;
  }
}

/* Modo oscuro (opcional) */
@media (prefers-color-scheme: dark) {
  /* Puedes descomentar esto para agregar modo oscuro automático */
  /*
  body {
    background-color: #1a1d20;
    color: #f8f9fa;
  }
  */
}
</style>

