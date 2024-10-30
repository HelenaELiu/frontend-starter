<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const time = ref("");
const location = ref("");
const price = ref("");
const description = ref("");
const emit = defineEmits(["refreshEvents"]);

const createEvent = async (name: string, time: string, location: string, price: string, description: string) => {
  try {
    await fetchy("/api/events", "POST", {
      body: { name, time, location,  price, description},
    });
  } catch (_) {
    return;
  }
  emit("refreshEvents");
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
  time.value = "";
  location.value = "";
  price.value = "";
  description.value = "";
};
</script>

<template>
  <form @submit.prevent="createEvent(name, time, location, price, description)">
    <label for="name">Event Name:</label>
    <textarea id="name" v-model="name" placeholder="Insert event name" required> </textarea>
    <label for="time">Event Time:</label>
    <textarea id="time" v-model="time" placeholder="Insert event time" required> </textarea>
    <label for="location">Event Location:</label>
    <textarea id="location" v-model="location" placeholder="Insert event location" required> </textarea>
    <label for="price">Event Price:</label>
    <textarea id="price" v-model="price" placeholder="Insert event price" required> </textarea>
    <label for="description">Event Description:</label>
    <textarea id="description" v-model="description" placeholder="Insert event description" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Event</button>
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
