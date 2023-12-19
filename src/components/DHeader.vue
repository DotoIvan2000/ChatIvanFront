<template lang="">
  <div class="q-mb-md">
    <h4 class="q-ma-md shadow-6">{{ titleHeader }}</h4>
  </div>
</template>
<script>
export default {
  props: {
    titleHeader: {
      type: String,
      required: true,
    },
  },
};
</script>
<style scoped>
h4 {
  text-align: center;
}
</style>
