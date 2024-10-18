<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const url = ref("");
const description = ref("");
const emit = defineEmits(["refreshVideos"]);

const createVideo = async (url: string, description: string) => {
  try {
    await fetchy("/api/videos", "POST", {
      body: { url, description },
    });
  } catch (_) {
    return;
  }
  emit("refreshVideos");
  emptyForm();
};

const emptyForm = () => {
  url.value = "";
  description.value = "";
};
</script>

<template>
  <form @submit.prevent="createVideo(url, description)">
    <label for="url">Video URL:</label>
    <textarea id="url" v-model="url" placeholder="Insert video URL" required> </textarea>
    <label for="description">Video Description:</label>
    <textarea id="description" v-model="description" placeholder="Insert video description" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Video</button>
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
