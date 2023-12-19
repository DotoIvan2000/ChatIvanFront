<template>
  <router-view />
</template>

<script>
import { defineComponent, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.js";
export default defineComponent({
  name: "App",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    onBeforeMount(() => {
      const hasToken = authStore.token;
      const hasUser = authStore.user;
      if (!hasToken || !hasUser) {
        router.replace("/login");
      }
      console.log("Usuario:", authStore.user);
    });
    return {};
  },
});
</script>
