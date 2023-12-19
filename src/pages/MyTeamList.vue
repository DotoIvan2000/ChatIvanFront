<template>
  <div>
    <DHeader :titleHeader="titleHeaderText" />
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
        <q-btn
          @click="joinTeam(row.id)"
          color="primary"
          icon="question_answer"
        />
        <q-btn @click="deleteTeam(row.id)" color="deep-orange" icon="delete" />
      </template>
    </q-table>
    <div v-if="messagesOpen">
      <div>
        <h3 class="text-center">Mensajes</h3>
      </div>
      <div
        v-for="message in messagesArray"
        :key="message.created_at"
        class="message-container"
      >
        <div
          :class="[
            'message',
            message.sender_id === userMine ? 'sender' : 'receiver',
          ]"
        >
          <div class="message-details">
            <p><strong>De:</strong> {{ message.sender_username }}</p>
            <p><strong>Mensaje:</strong> {{ message.message }}</p>
            <!-- Añade otros detalles del mensaje según tus necesidades -->
            <p><strong>Fecha:</strong> {{ message.created_at }}</p>
            <!-- Otros campos del mensaje -->
          </div>
        </div>
      </div>
      <br />
      <q-form @submit.prevent="sendMessage()">
        <q-input
          v-model="messageSend"
          label="Mensaje"
          type="textarea"
          lazy-rules
          :rules="[(val) => val.length > 0 || 'El mensaje es requerido']"
        />
        <q-btn type="submit" label="Enviar" color="primary" />
      </q-form>
    </div>
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
    const logo = ref(null);
    const teams = ref([]);
    const isEdit = ref(false);
    const authStore = useAuthStore();
    const messagesArray = ref([]);
    const messagesOpen = ref(false);
    const userMine = authStore.user[0];
    const messageSend = ref("");
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
      const token = "Bearer " + authStore.token;
      const route = "/team/" + authStore.user[0] + "/teams-mine";
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.get(route, { headers });
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

    const joinTeam = async (teamId) => {
      console.log(teamId);
      messagesArray.value = [];
      const token = "Bearer " + authStore.token;
      const route = "/team/" + authStore.user[0] + "/messages-team/" + teamId;
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.get(route, { headers });
        console.log(response.data.data);
        messagesArray.value = response.data.data.map((item) => {
          return {
            message: item.message,
            sender_id: item.user_id,
            created_at: item.created_at,
            sender_username: item.username,
          };
        });
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
      messagesOpen.value = true;
    };

    const deleteTeam = async (teamId) => {
      const authStore = useAuthStore();
      const token = "Bearer " + authStore.token;
      const route = "/team/" + authStore.user[0] + "/leave";
      const body = {
        team_id: teamId,
      };
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.post(route, body, { headers });
        console.log(response.data);
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Se ha eliminado el equipo correctamente",
        });
        const rout2 = "/team/" + authStore.user[0] + "/teams-mine";
        try {
          const response = await api.get(rout2, { headers });
          teams.value = response.data.data;
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    return {
      titleHeaderText: "Lista de mis Teams",
      teams: teams,
      dataColumns: dataColumns,
      isEdit: isEdit,
      joinTeam: joinTeam,
      messagesArray: messagesArray,
      userMine: userMine,
      messagesOpen: messagesOpen,
      messageSend: messageSend,
      deleteTeam: deleteTeam,
    };
  },
};
</script>
<style>
.message-container {
  margin-bottom: 10px;
}

.message {
  padding: 10px;
  border-radius: 5px;
}

.sender {
  background-color: #c9f7f5;
  text-align: right;
}

.receiver {
  background-color: #f0f0f0;
  text-align: left;
}
</style>
