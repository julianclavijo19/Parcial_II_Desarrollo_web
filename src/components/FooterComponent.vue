<template>
  <footer class="footer-minimal">
    <div class="footer-content">
      <p>© {{ currentYear }} GamerHub Pro. Proyecto educativo - Desarrollo Web.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style scoped>
.footer-minimal {
  background: #000000;
  border-top: 1px solid #1a1a1a;
  padding: 1.5rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content p {
  color: #666;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
}

@media (max-width: 768px) {
  .footer-minimal {
    padding: 1rem;
  }
  
  .footer-content p {
    font-size: 0.8125rem;
  }
}
</style>
