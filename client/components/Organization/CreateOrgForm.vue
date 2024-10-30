<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const description = ref("");
const privacy = ref("");
const emit = defineEmits(["refreshOrgs"]);

const createOrg = async (name: string, description: string, privacy: string) => {
  try {
    await fetchy("/api/organizations", "POST", {
      body: { name, description, privacy },
    });
  } catch (_) {
    return;
  }
  emit("refreshOrgs");
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
  description.value = "";
  privacy.value = "";
};
</script>

<template>
  <form @submit.prevent="createOrg(name, description, privacy)">
    <label for="name">Organization Name:</label>
    <textarea id="name" v-model="name" placeholder="Insert organization name" required> </textarea>
    <label for="description">Organization Description:</label>
    <textarea id="description" v-model="description" placeholder="Insert organization description" required> </textarea>
    <label for="privacy">Organization Privacy:</label>
    <textarea id="privacy" v-model="privacy" placeholder="Insert organization privacy setting (private or public)" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Organization</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
