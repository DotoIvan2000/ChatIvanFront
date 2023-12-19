<template lang="">
  <div>
    <DHeader :titleHeader="titleHeaderText" />
    <q-input v-model="textSearch" :readonly="readonly">
      <template v-slot:append>
        <q-icon name="search" @click="searchpeople" />
      </template>
    </q-input>
  </div>
  <div v-if="isVisible">
    <q-table :columns="dataColumns" :rows="listSearch.data">
      <template v-slot:body-cell-actions="{ row }">
        <q-btn
          @click="seguirUsuario(row.id)"
          color="secondary"
          icon="person_add_alt"
        />
      </template>
    </q-table>
  </div>
</template>
<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useAuthStore } from "src/stores/auth.js";
import DHeader from "src/components/DHeader.vue";
export default {
  components: {
    DHeader,
  },
  setup() {
    const authStore = useAuthStore();
    const listSearch = ref([]);
    const isVisible = ref(false);
    const textSearch = ref("");
    const userReciver = ref("");
    const $q = useQuasar();
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
        field: "actions",
        align: "left",
        sortable: true,
      },
    ];
    const searchpeople = async () => {
      isVisible.value = false;
      const token = "Bearer " + authStore.token;
      const route = "/user/" + authStore.user[0] + "/search-users";
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      };
      const body = {
        filter: textSearch.value,
      };
      const response = await api.post(route, body, { headers });
      listSearch.value = response.data;
      isVisible.value = true;
    };

    const seguirUsuario = async (userId) => {
      const token = "Bearer " + authStore.token;
      const route = "/user/" + authStore.user[0] + "/follow";
      userReciver.value = userId;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      };
      const body = {
        followee_id: userReciver.value,
      };

      try {
        const response = await api.post(route, body, { headers });
        const data = response.data;
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Se ha seguido al usuario",
        });
      } catch (error) {
        console.log("Error al dejar de seguir al usuario:", error);
      }
    };
    return {
      listSearch: listSearch,
      isVisible: isVisible,
      searchpeople: searchpeople,
      textSearch: textSearch,
      dataColumns: dataColumns,
      seguirUsuario: seguirUsuario,
      titleHeaderText: "Buscar personas",
      userReciver: userReciver,
    };
  },
};
</script>
<style></style>
