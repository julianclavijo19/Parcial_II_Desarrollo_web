<template>
  <div class="dashboard-container">
    <NavbarComponent :currentUser="currentUser" @logout="handleLogout" />
    
    <div class="main-container">
      <SidebarComponent :currentUser="currentUser" />
      
      <main class="content-area">
        <router-view></router-view>
        <FooterComponent />
      </main>
    </div>
  </div>
</template>

<script>
import NavbarComponent from '../components/NavbarComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';
import authService from '../services/authService';

export default {
  name: 'DashboardView',
  components: {
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  },
  data() {
    return {
      currentUser: null
    };
  },
  mounted() {
    this.currentUser = authService.getCurrentUser();
    
    // Si no está autenticado, redirigir al login
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },
  methods: {
    handleLogout() {
      authService.logout();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  display: flex;
  flex: 1;
  padding-top: 56px; /* Altura del navbar */
}

.content-area {
  flex: 1;
  margin-left: 250px; /* Ancho del sidebar */
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 56px);
}

@media (max-width: 768px) {
  .content-area {
    margin-left: 0;
  }
}
</style>

