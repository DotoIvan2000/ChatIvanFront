<template>
  <div>
    <DHeader :titleHeader="titleHeaderText" />
    <q-table :columns="dataColumns" :rows="followerss">
      <template v-slot:body-cell-actions="{ row }">
        <q-btn @click="accionUsuario(row.id)" color="secondary" icon="email" />
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
            <p><strong>Para:</strong> {{ message.receiver_username }}</p>
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
    const authStore = useAuthStore();
    const messageSend = ref("");
    const $q = useQuasar();
    const followerss = ref([]);
    const messagesArray = ref([]);
    const messagesOpen = ref(false);
    const userMine = authStore.user[0];
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
      const token = "Bearer " + authStore.token;
      const route = "/user/" + authStore.user[0] + "/followers";
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.get(route, { headers });
        followerss.value = response.data.data.map((item) => {
          return {
            id: item.follower.id,
            first_name: item.follower.first_name,
            last_name: item.follower.last_name,
            email: item.follower.email,
            username: item.follower.username,
          };
        });
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    });
    const accionUsuario = async (userId) => {
      const token = "Bearer " + authStore.token;
      userReciver.value = userId;
      const route = "/user/" + authStore.user[0] + "/messages/" + userId;
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const response = await api.get(route, { headers });
        messagesArray.value = response.data.data.map((item) => {
          return {
            message: item.message,
            sender_id: item.sender_id,
            receiver_id: item.receiver_id,
            created_at: item.created_at,
            sender_username: item.sender.username,
            receiver_username: item.receiver.username,
          };
        });
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
      messagesOpen.value = true;
    };
    const sendMessage = async () => {
      const token = "Bearer " + authStore.token;
      const route = "/user/" + authStore.user[0] + "/send-message-normal";
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      };
      const body = {
        message: messageSend.value,
        receptor_id: userReciver.value,
      };
      try {
        const response = await api.post(route, body, { headers });
        const data = response.data;
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Mensaje enviado",
        });
        messagesOpen.value = false;
        messageSend.value = "";
      } catch (error) {
        console.log("Error al enviar mensaje:", error);
      }
    };
    return {
      titleHeaderText: "Lista de seguidores",
      followerss: followerss,
      dataColumns: dataColumns,
      accionUsuario: accionUsuario,
      messagesOpen: messagesOpen,
      messagesArray: messagesArray,
      userMine: userMine,
      userReciver: userReciver,
      sendMessage: sendMessage,
      messageSend: messageSend,
    };
  },
};
</script>
<style scoped>
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
