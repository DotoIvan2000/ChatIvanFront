<template>
  <div>
    <DHeader :titleHeader="titleHeaderText" />
    <q-form @submit.prevent="buscarUsuario">
      <img src="/src/assets/img/payment.png" alt="" />
      <q-select
        color="purple-12"
        v-model="type_id"
        :options="options"
        label="Label"
      >
        <template v-slot:prepend>
          <q-icon name="credit_card" />
        </template>
      </q-select>
      <q-input v-model="username" label="No de tarjeta" />
      <q-input v-model="cvv" label="CVV" type="number" maxlength="3" />
      <q-btn
        @click="isVisibleFunction"
        color="primary"
        label="Fecha de expiracion"
        class="q-mb-md q-ml-md q-mt-md"
      />
      <div v-if="isVisible">
        <q-date v-model="date" landscape />
      </div>
      <br />
      <q-btn
        type="submit"
        color="primary"
        label="Mandar informacion"
        class="q-mb-md q-ml-md q-mt-md"
      />
    </q-form>
  </div>
</template>
<script>
import DHeader from "src/components/DHeader.vue";
import { ref } from "vue";
import { useAuthStore } from "src/stores/auth.js";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

export default {
  components: {
    DHeader,
  },
  setup() {
    const type_id = ref(0);
    const username = ref("");
    const cvv = ref("");
    const date = ref("");
    const isVisible = ref(false);
    const authStore = useAuthStore();
    const $q = useQuasar();
    const options = [
      {
        label: "Tarjeta de credito",
        value: 3,
      },
      {
        label: "Tarjeta de Debito",
        value: 4,
      },
    ];
    const buscarUsuario = async () => {
      const token = "Bearer " + authStore.token;
      const route = "/user/" + authStore.user[0] + "/register-card";
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        };
        const body = {
          type_id: type_id.value.value,
          card_number: username.value,
          cvv: cvv.value,
          date: date.value,
        };
        const response = await api.post(route, body, { headers });
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Se ha enviado la informacion correctamente",
        });
        type_id.value = 0;
        username.value = "";
        cvv.value = "";
        date.value = "";
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    const isVisibleFunction = () => {
      isVisible.value = !isVisible.value;
    };
    return {
      titleHeaderText: "Lista de usuarios",
      buscarUsuario: buscarUsuario,
      options: options,
      type_id: type_id,
      username: username,
      cvv: cvv,
      date: date,
      isVisible: isVisible,
      isVisibleFunction: isVisibleFunction,
    };
  },
};
</script>
<style></style>
