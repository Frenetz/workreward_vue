<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="#">
          <router-link class="nav-link" to="/index">Work-Reward</router-link>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li v-if="isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/tasks-list">Список задач</router-link>
            </li>
            <li v-if="isAuthenticated && !isManager" class="nav-item">
              <router-link class="nav-link" to="/my-tasks">Мои задачи</router-link>
            </li>  
            <li v-if="isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/reports">Отчеты</router-link>
            </li>                
            <li v-if="isAuthenticated && !isManager" class="nav-item">
              <router-link class="nav-link" to="/my-rewards">Мои премии</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <li v-if="isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/profile">Профиль</router-link>
            </li>
            <li v-if="isAuthenticated" class="nav-item">
              <button class="nav-link btn btn-link" @click="logout">Выйти</button>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/auth">Войти</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/register">Регистрация</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container my-4">
      <router-view @authenticated="handleAuthenticated" />
    </main>

    <footer class="bg-dark text-white text-center py-3">
      <div class="container">
        <p>&copy; 2024 «Work-Reward Team»</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false,
      isManager: false,
    };
  },
  created() {
    this.checkAuthentication();
  },
  watch: {
    isAuthenticated(newValue) {
      if (newValue) {
        this.checkIfManager();
      }
    }
  },
  methods: {
    checkAuthentication() {
      const accessToken = localStorage.getItem('access_token');
      this.isAuthenticated = !!accessToken;
    },
    checkIfManager() {
      this.isManager = localStorage.getItem('is_manager') === 'true';
    },
    handleAuthenticated(status) {
      this.isAuthenticated = status;
      this.isManager = localStorage.getItem('is_manager') === 'true';
    },
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('id');
      localStorage.removeItem('is_manager');
      this.isAuthenticated = false;
      this.isManager = false;
      this.$router.push({ name: 'auth' });
    },
  },
};
</script>

<style scoped>

</style>
