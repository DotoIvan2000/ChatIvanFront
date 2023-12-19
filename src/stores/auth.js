import { defineStore } from "pinia";
export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: localStorage.getItem("user") || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", user);
    },
    clearAuth() {
      this.token = null;
      this.user = null;
    },
  },
});
