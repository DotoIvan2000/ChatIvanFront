<template>
  <div>
    <DHeader :titleHeader="titleHeaderText" />
    <q-btn
      @click="downloadUsers()"
      color="primary"
      label="Descargar lista de Usuarios"
      class="q-mb-md q-ml-md q-mt-md"
    />
    <q-table :columns="dataColumns" :rows="users">
      <template v-slot:body-cell-actions="{ row }">
        <q-btn
          @click="borrarUsuario(row.id)"
          color="deep-orange"
          icon="delete"
        />
      </template>
    </q-table>
  </div>
</template>
<script>
import DHeader from "src/components/DHeader.vue";
import { useAuthStore } from "src/stores/auth.js";
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import { api } from "boot/axios";
export default {
  components: {
    DHeader,
  },
  setup() {
    const users = ref([]);
    const $q = useQuasar();
    const userReciver = ref(0);
    const dataColumns = [
      {
        name: "id",
        label: "ID",
        field: "id",
        align: "left",
        sortable: true,
      },
      {
        name: "first_name",
        label: "Nombre(s)",
        field: "first_name",
        align: "left",
        sortable: true,
      },
      {
        name: "last_name",
        label: "Apellido(s)",
        field: "last_name",
        align: "left",
        sortable: true,
      },
      {
        name: "email",
        label: "Email",
        field: "email",
        align: "left",
        sortable: true,
      },
      {
        name: "username",
        label: "Nombre de usuario",
        field: "username",
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
        name: "updated_at",
        label: "Fecha de actualización",
        field: "updated_at",
        align: "left",
        sortable: true,
      },
      {
        name: "actions",
        label: "Acciones",
        align: "center",
        sortable: false,
      },
    ];
    onMounted(async () => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/admin/" + authStore.user[0] + "/users";
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.get(route, { headers });
        users.value = response.data.data;
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    });
    const downloadUsers = async () => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/admin/" + authStore.user[0] + "/export/users";
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.get(route, { headers });
        $q.notify({
          message: response.data.message,
          color: "purple",
        });
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    const borrarUsuario = async (userId) => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      userReciver.value = userId;
      const route = "/admin/" + authStore.user[0] + "/deleteuser/" + userId;
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.delete(route, { headers });
        $q.notify({
          message: "Se ha borrado correctamente el usuario",
          color: "purple",
        });
        const route2 = "/admin/" + authStore.user[0] + "/users";
        try {
          const response2 = await api.get(route2, { headers });
          users.value = response2.data.data;
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    return {
      titleHeaderText: "Lista de usuarios",
      users: users,
      dataColumns: dataColumns,
      downloadUsers: downloadUsers,
      userReciver: userReciver,
      borrarUsuario: borrarUsuario,
    };
  },
};
</script>
<style lang=""></style>
