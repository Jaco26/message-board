<template>
  <div class="home">

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import { createSocket } from '@/client/client-socket'

import HelloWorld from '@/client/components/HelloWorld.vue'

export default defineComponent({
  name: "Home",
  setup(props, ctx) {

  },
  components: {
    HelloWorld,
  },
});
</script>
