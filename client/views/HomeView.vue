<script setup lang="ts">
import VideoListComponent from "@/components/Video/VideoListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <VideoListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
