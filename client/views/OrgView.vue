<script setup lang="ts">
import OrgListComponent from "@/components/Organization/OrgListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Organization Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <OrgListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
