<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    console.log('%c🎮 GamerHub Pro Dashboard', 'color: #00ff88; font-size: 20px; font-weight: bold;');
    console.log('%c⚡ Dashboard Minimalista para PC Gaming', 'color: #666; font-size: 14px;');
  }
}
</script>

<style>
/* Importar Bootstrap y Bootstrap Icons */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

/* Variables globales - Tema Gaming */
:root {
  --color-black: #000000;
  --color-dark: #0a0a0a;
  --color-darker: #1a1a1a;
  --color-gray: #333;
  --color-light-gray: #666;
  --color-text: #999;
  --color-white: #fff;
  --color-primary: #00ff88;
  --color-primary-hover: #00e67a;
  --color-warning: #ffc107;
  --color-danger: #dc3545;
  --color-info: #2196f3;
}

/* Reset global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  background: var(--color-black);
  color: var(--color-white);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-black);
}

::-webkit-scrollbar-thumb {
  background: var(--color-darker);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray);
}

/* Selección de texto */
::selection {
  background: var(--color-primary);
  color: var(--color-black);
}

/* Tipografía */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

/* Links */
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--color-primary-hover);
}

/* Inputs y formularios */
input,
textarea,
select {
  font-family: inherit;
}

input::placeholder,
textarea::placeholder {
  color: var(--color-text);
}

/* Buttons reset */
button {
  font-family: inherit;
  cursor: pointer;
}

/* Utilidades de color */
.text-primary {
  color: var(--color-primary) !important;
}

.text-warning {
  color: var(--color-warning) !important;
}

.bg-primary {
  background-color: var(--color-primary) !important;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 13px;
  }
}

/* Modo impresión */
@media print {
  body {
    background: white;
    color: black;
  }
}
</style>
