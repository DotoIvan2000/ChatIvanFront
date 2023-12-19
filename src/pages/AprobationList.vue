<template>
  <div>
    <DHeader :titleHeader="titleHeaderText" />
    <q-table :columns="dataColumns" :rows="notifications">
      <template v-slot:body-cell-actions="{ row }">
        <q-btn
          @click="accionUsuario(row.id)"
          color="secondary"
          icon="verified"
        />
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
        label: "Apellidos",
        field: "last_name",
        align: "left",
        sortable: true,
      },
      {
        name: "email",
        label: "Correo",
        field: "email",
        align: "left",
        sortable: true,
      },
      {
        name: "username",
        label: "Username",
        field: "username",
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
      const route = "/admin/" + authStore.user[0] + "/approves";
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.get(route, { headers });
        notifications.value = response.data.data.map((item) => {
          return {
            id: item.user.id,
            first_name: item.user.first_name,
            last_name: item.user.last_name,
            email: item.user.email,
            username: item.user.username,
          };
        });
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    });
    const accionUsuario = (userId) => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/admin/" + authStore.user[0] + "/approve-account";
      const body = {
        user_id: userId,
      };
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      };
      $q.dialog({
        title: "Aprobar cuenta",
        message: "¿Estás seguro de aprobar esta cuenta?",
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          try {
            const response = await api.post(route, body, { headers });
            const data = response.data;
            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "check",
              message: "Cuenta aprobada",
            });
          } catch (error) {
            console.log("Error al aprobar cuenta:", error);
          }
        })
        .onCancel(() => {
          $q.notify({
            color: "red-4",
            textColor: "white",
            icon: "close",
            message: "Cuenta no aprobada",
          });
        });
    };
    return {
      titleHeaderText: "Lista de Pendientes por aprobar",
      notifications: notifications,
      dataColumns: dataColumns,
      accionUsuario: accionUsuario,
    };
  },
};
</script>
<style lang=""></style>
