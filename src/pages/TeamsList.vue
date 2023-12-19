<template>
  <div>
    <DHeader :titleHeader="titleHeaderText" />
    <div class="col-12 shadow-6 q-mb-md q-ml-md">
      <q-btn
        @click="downloadTeams()"
        color="primary"
        label="Descargar lista de Teams"
        class="q-mb-md q-ml-md q-mt-md"
      />
      <q-btn
        color="primary"
        label="Agregar Team"
        class="q-mb-md q-ml-md q-mt-md"
        @click="isCreate = !isCreate"
      />
      <div v-if="isCreate">
        <q-form @submit.prevent="createTeam" enctype="multipart/form-data">
          <q-input
            outlined
            square
            dense
            v-model="name"
            label="Nombre"
            class="col-12 q-mb-md q-ml-md q-mt-md"
          />
          <q-input
            outlined
            square
            dense
            v-model="description"
            label="Descripción"
            class="col-12 q-mb-md q-ml-md q-mt-md"
          />
          <div>
            {{ logo }}
            <input
              type="file"
              ref="logoInput"
              style="display: none"
              @change="handleFileUpload($event)"
            />
            <q-btn
              color="primary"
              label="Seleccionar archivo"
              class="q-mb-md q-ml-md q-mt-md"
              @click="$refs.logoInput.click()"
            />
          </div>
          <q-btn
            type="submit"
            color="primary"
            label="Agregar Team"
            class="q-mb-md q-ml-md q-mt-md"
          />
        </q-form>
      </div>
      <div v-if="isEdit">
        <p>Equipo: {{ nameAct }}</p>
        <q-form
          @submit.prevent="editTeaFunc(idAct)"
          enctype="multipart/form-data"
        >
          <q-input
            outlined
            square
            dense
            v-model="nameEdit"
            label="Nombre"
            class="col-12 q-mb-md q-ml-md q-mt-md"
          />
          <q-btn
            type="submit"
            color="primary"
            label="Editar Team"
            class="q-mb-md q-ml-md q-mt-md"
          />
        </q-form>
      </div>
    </div>
    <q-table :columns="dataColumns" :rows="teams">
      <template v-slot:body-cell-logo="{ row }">
        <q-td :props="props">
          <img
            :src="row.logo"
            alt="Logo"
            style="max-width: 50px; max-height: 50px"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="{ row }">
        <q-btn @click="editTeam(row.id)" color="primary" icon="edit" />
        <q-btn @click="joinTeam(row.id)" color="amber" icon="group_add" />
        <q-btn @click="deleteTeam(row.id)" color="deep-orange" icon="delete" />
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
    const name = ref("");
    const description = ref("");
    const logo = ref(null);
    const teams = ref([]);
    const isCreate = ref(false);
    const isEdit = ref(false);
    const nameAct = ref("");
    const nameEdit = ref("");
    const idAct = ref(0);
    const dataColumns = [
      {
        name: "id",
        label: "ID",
        field: "id",
        align: "left",
        sortable: true,
      },
      {
        name: "name",
        label: "Nombre",
        field: "name",
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
        name: "logo",
        label: "Logo",
        field: "logo",
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
        field: "actions",
        align: "left",
        sortable: true,
      },
    ];
    onMounted(async () => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/admin/" + authStore.user[0] + "/teams";
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.get(route, { headers });
        teams.value = response.data.data;
        teams.value = response.data.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            decription: item.description,
            logo: "http://localhost/storage/" + item.logo,
            created_at: item.created_at,
            updated_at: item.updated_at,
          };
        });
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      logo.value = file;
    };

    const createTeam = async () => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/team/" + authStore.user[0] + "/create";
      try {
        const headers = {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: token,
        };
        let formData = new FormData();
        formData.append("name", name.value);
        formData.append("description", description.value);
        formData.append("logo", logo.value);
        const response = await api.post(route, formData, { headers });
        teams.value = response.data.data;
        $q.notify({
          message: "Team creado correctamente",
          color: "purple",
        });
        isCreate.value = !isCreate.value;
        const route2 = "/admin/" + authStore.user[0] + "/teams";
        try {
          const response = await api.get(route2, { headers });
          teams.value = response.data.data;
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    const downloadTeams = async () => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/admin/" + authStore.user[0] + "/export/teams";
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

    const editTeam = (id) => {
      const team = teams.value.find((team) => team.id === id);
      nameAct.value = team.name;
      idAct.value = team.id;
      isCreate.value = false;
      isEdit.value = !isEdit.value;
    };

    const deleteTeam = async (teamId) => {
      isEdit.value = false;
      isCreate.value = false;
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/admin/" + authStore.user[0] + "/deleteteam/" + teamId;
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.delete(route, { headers });
        teams.value = response.data.data;
        $q.notify({
          message: "Team eliminado correctamente",
          color: "purple",
        });
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    const editTeaFunc = async (idTeam) => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/team/" + authStore.user[0] + "/update/" + idTeam;
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const body = {
          name: nameEdit.value,
        };
        const response = await api.put(route, body, { headers });
        isEdit.value = !isEdit.value;
        $q.notify({
          message: "Team editado correctamente",
          color: "purple",
        });
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    const joinTeam = async (teamId) => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/team/" + authStore.user[0] + "/join";
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const body = {
          team_id: teamId,
        };
        const response = await api.post(route, body, { headers });
        $q.notify({
          message: "Te has unido al Team correctamente",
          color: "purple",
        });
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    return {
      titleHeaderText: "Lista de Teams",
      teams: teams,
      dataColumns: dataColumns,
      createTeam: createTeam,
      name: name,
      description: description,
      logo: logo,
      nameEdit: nameEdit,
      handleFileUpload: handleFileUpload,
      downloadTeams: downloadTeams,
      isCreate: isCreate,
      isEdit: isEdit,
      editTeam: editTeam,
      deleteTeam: deleteTeam,
      nameAct: nameAct,
      idAct: idAct,
      editTeaFunc: editTeaFunc,
      joinTeam: joinTeam,
    };
  },
};
</script>
<style lang=""></style>
