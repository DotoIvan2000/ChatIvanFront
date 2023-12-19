<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="src/assets/img/withoutuser.png" />
          </q-avatar>
          Chat App
        </q-toolbar-title>
        <q-btn round color="primary" icon="notifications" to="/notifications" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :width="200" :breakpoint="400">
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section> Home </q-item-section>
          </q-item>
          <div v-if="isAdmin == 6">
            <q-item active clickable v-ripple to="/users">
              <q-item-section avatar>
                <q-icon name="account_circle" />
              </q-item-section>

              <q-item-section> Lista de usuarios </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/teams">
              <q-item-section avatar>
                <q-icon name="groups" />
              </q-item-section>

              <q-item-section> Lista de teams </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/aprooves">
              <q-item-section avatar>
                <q-icon name="verified" />
              </q-item-section>

              <q-item-section>
                Lista de aprovaciones pendientes
              </q-item-section>
            </q-item>
          </div>

          <q-item clickable v-ripple to="/followers">
            <q-item-section avatar>
              <q-icon name="face" />
            </q-item-section>

            <q-item-section> Lista de seguidores </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/followees">
            <q-item-section avatar>
              <q-icon name="supervised_user_circle" />
            </q-item-section>

            <q-item-section> Lista de seguidos </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/searchpeople">
            <q-item-section avatar>
              <q-icon name="person_search" />
            </q-item-section>

            <q-item-section> Buscar personas </q-item-section>
          </q-item>
          <div v-if="isAdmin != 6">
            <q-item clickable v-ripple to="/joinpro">
              <q-item-section avatar>
                <q-icon name="price_check" />
              </q-item-section>

              <q-item-section> Volverte pro </q-item-section>
            </q-item>
          </div>
          <div v-if="isAdmin == 6">
            <q-item clickable v-ripple to="/myteams">
              <q-item-section avatar>
                <q-icon name="groups_3" />
              </q-item-section>

              <q-item-section> Ver mis teams </q-item-section>
            </q-item>
          </div>
          <q-item clickable v-ripple @click="closeSession()">
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>

            <q-item-section> Logout </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.js";
import { api } from "boot/axios";
export default {
  setup() {
    const drawer = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();
    const isAdmin = authStore.user[5];
    const closeSession = async () => {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const body = {
        user_id: authStore.user[0],
      };
      try {
        const response = await api.post("/auth/logout", body, { headers });
        const data = response.data;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      } catch (error) {
        console.log("Error al cerrar sesión:", error);
      }
    };
    return {
      toggleLeftDrawer() {
        drawer.value = !drawer.value;
      },
      drawer,
      closeSession,
      isAdmin,
    };
  },
};
</script>
