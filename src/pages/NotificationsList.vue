<template>
  <div>
    <DHeader :titleHeader="titleHeaderText" />
    <q-table :columns="dataColumns" :rows="notifications">
      <template v-slot:body-cell-path="{ row }">
        <div class="col-sm-4">
          <p
            class="q-mt-md q-ml-md q-pa-lg-md bg-blue-grey-14 text-white rounded-borders text-center"
            @click="goToPath(row.path)"
          >
            Ir a la ruta
          </p>
        </div>
      </template>
    </q-table>
  </div>
</template>
<script>
import DHeader from "src/components/DHeader.vue";
import { useAuthStore } from "src/stores/auth.js";
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
export default {
  components: {
    DHeader,
  },
  setup() {
    const $q = useQuasar();
    const notifications = ref([]);
    const showPathButton = ref(false);
    const dataColumns = [
      {
        name: "id",
        label: "ID",
        field: "id",
        align: "left",
        sortable: true,
      },
      {
        name: "title",
        label: "Titulo",
        field: "title",
        align: "left",
        sortable: true,
      },
      {
        name: "description",
        label: "Descripción",
        field: "description",
        align: "left",
        sortable: true,
      },
      {
        name: "created_at",
        label: "Fecha de creación",
        field: "created_at",
        align: "left",
        sortable: true,
      },
      {
        name: "path",
        label: "Path",
        field: "path",
        align: "left",
        sortable: true,
      },
    ];
    onMounted(async () => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/user/" + authStore.user[0] + "/notifications";
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.get(route, { headers });
        notifications.value = response.data.data;
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    });

    const goToPath = (path) => {
      // Redirige a la URL proporcionada por el 'path'
      window.location.href = path;
    };

    return {
      titleHeaderText: "Lista de Notificaciones",
      notifications: notifications,
      dataColumns: dataColumns,
      goToPath: goToPath,
    };
  },
};
</script>
<style lang=""></style>
