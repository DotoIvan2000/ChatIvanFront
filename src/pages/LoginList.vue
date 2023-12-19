<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div class="form-group">
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
  <div class="register-link">
    <p>
      ¿No tienes una cuenta? <button @click="goToRegister">Registrarse</button>
    </p>
  </div>
</template>

<script>
import { api } from "boot/axios";
import { useAuthStore } from "src/stores/auth.js";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      const authStore = useAuthStore();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const body = {
        email: this.email,
        password: this.password,
      };
      try {
        const response = await api.post("/auth/login", body, { headers });
        const data = response.data;
        if (data.message) {
          alert(data.message);
          return;
        } else {
          authStore.setToken(data.data.access_token);
          const arrayUser = [
            data.data.user.id,
            data.data.user.first_name,
            data.data.user.last_name,
            data.data.user.email,
            data.data.user.username,
            data.data.user.type_id,
            data.data.user.created_at,
            data.data.user.updated_at,
          ];
          authStore.setUser(arrayUser);
          this.$router.replace("/");
        }
      } catch (error) {
        alert(error.response.data.message);
      }
      // this.email = "";
      // this.password = "";
    },
    goToRegister() {
      this.$router.push("/register"); // Redirige a la ruta '/register'
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="email"],
input[type="password"],
button {
  width: 100%;
  padding: 8px;
  border-radius: 3px;
  border: 1px solid #ccc;
}

button {
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
.register-link {
  text-align: center;
  margin-top: 10px;
}

.register-link button {
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>
