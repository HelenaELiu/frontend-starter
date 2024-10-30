<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["org"]);
const emit = defineEmits(["editOrg", "refreshOrgs"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteOrg = async () => {
  try {
    await fetchy(`/api/organizations/${props.org._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshOrgs");
};
</script>

<template>
  <p class="author">{{ props.org.author }}</p>
  <p>{{ "Name: " + props.org.name }}</p>
  <p>{{ "Description: " + props.org.description }}</p>
  <p>{{ "Privacy Setting: " + props.org.privacy }}</p>
  <p>{{ "Members: " + props.org.members }}</p>
  <div class="base">
    <menu v-if="props.org.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editOrg', props.org._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteOrg">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.org.dateCreated !== props.org.dateUpdated">Edited on: {{ formatDate(props.org.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.org.dateCreated) }}</p>
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
