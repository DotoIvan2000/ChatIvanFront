<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="first_name">Nombre(s):</label>
        <input type="text" v-model="first_name" id="name" required />
      </div>
      <div class="form-group">
        <label for="last_name">Apellido(s):</label>
        <input type="text" v-model="last_name" id="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div class="form-group">
        <label for="password_confirmation">Repetir Password</label>
        <input
          type="password"
          v-model="password_confirmation"
          id="password_confirmation"
          required
        />
      </div>
      <div class="form-group">
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
  <div class="login-link">
    <p>
      ¿Ya tienes una cuenta? <button @click="goToLogin">Iniciar sesión</button>
    </p>
  </div>
</template>

<script>
import { api } from "boot/axios";
import { useAuthStore } from "src/stores/auth.js";
export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    };
  },
  methods: {
    async register() {
      // Aquí puedes implementar la lógica para registrar al usuario
      // Por ejemplo, puedes enviar los datos al backend para crear una nueva cuenta
      console.log("Name:", this.first_name);
      console.log("Name:", this.last_name);
      console.log("Email:", this.email);
      console.log("Password:", this.password);
      console.log("Password:", this.password_confirmation);
      const authStore = useAuthStore();
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const body = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        username: this.username,
        password: this.password,
        password_confirmation: this.password_confirmation,
        type_id: 5,
      };
      try {
        const response = await api.post("/auth/register", body, { headers });
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
        console.log("Error al cerrar sesión:", error);
      }
    },
    goToLogin() {
      this.$router.push("/login"); // Redirige a la ruta raíz '/'
    },
  },
};
</script>

<style scoped>
.register-container {
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

input[type="text"],
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
.login-link {
  text-align: center;
  margin-top: 10px;
}

.login-link button {
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>
