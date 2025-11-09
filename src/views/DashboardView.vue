<template>
  <div class="dashboard-minimal">
    <NavbarComponent :currentUser="currentUser" @logout="handleLogout" />
    <SidebarComponent :currentUser="currentUser" />
    
    <main class="main-content">
      <router-view></router-view>
      <FooterComponent />
    </main>
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
.dashboard-minimal {
  min-height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
}

.main-content {
  margin-left: 240px;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>
