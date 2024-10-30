<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["event"]);
const emit = defineEmits(["editEvent", "sendInvite", "refreshEvents"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteEvent = async () => {
  try {
    await fetchy(`/api/events/${props.event._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshEvents");
};
</script>

<template>
  <p class="author">{{ props.event.name }}</p>
  <p>{{ "Author: " + props.event.author }}</p>
  <p>{{ "Time: " + props.event.time }}</p>
  <p>{{ "Location: " + props.event.location }}</p>
  <p>{{ "Price: " + props.event.price }}</p>
  <p>{{ "Description: " + props.event.description }}</p>
  <p>{{ "Choreographers: " + props.event.choreographers }}</p>
  <p>{{ "Genres: " + props.event.genres }}</p>
  <p>{{ "Props: " + props.event.props }}</p>
  <p>{{ "Attendees: " + props.event.attendees }}</p>
  <div class="base">
    <button class="btn-small pure-button" @click="emit('sendInvite', props.event._id)">Send Invite</button>
    <menu v-if="props.event.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editEvent', props.event._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteEvent">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.event.dateCreated !== props.event.dateUpdated">Edited on: {{ formatDate(props.event.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.event.dateCreated) }}</p>
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
