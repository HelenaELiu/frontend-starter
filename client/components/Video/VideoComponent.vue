<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["video"]);
const emit = defineEmits(["refreshVideos"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteVideo = async () => {
  try {
    await fetchy(`/api/videos/${props.video._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshVideos");
};
</script>

<template>
  <p class="author">{{ props.video.author }}</p>
  <p>{{ props.video.url }}</p>
  <p>{{ props.video.description }}</p>
  <div class="base">
    <menu v-if="props.video.author == currentUsername">
      <li><button class="button-error btn-small pure-button" @click="deleteVideo">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p>Created on: {{ formatDate(props.video.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
