<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["event"]);
const name = ref(props.event.name);
const time = ref(props.event.time);
const location = ref(props.event.location);
const price = ref(props.event.price);
const description = ref(props.event.description);
const addchoreog = ref(props.event.addchoreog);
const deletechoreog = ref(props.event.deletechoreog);
const addgenre = ref(props.event.addgenre);
const deletegenre = ref(props.event.deletegenre);
const addprop = ref(props.event.addprop);
const deleteprop = ref(props.event.deleteprop);

const emit = defineEmits(["editEvent", "refreshEvents"]);

const editEvent = async (name: string, time: string, location: string, price: string, description: string,
  addchoreog: string, deletechoreog: string, addgenre: string, deletegenre: string, addprop: string,
  deleteprop: string) => {
  try {
    await fetchy(`/api/events/${props.event._id}`, "PATCH", 
    { body: { name: name, time: time, location: location, price: price, description: description } });
    
    await fetchy(`/api/events/addchoreog/${props.event._id}`, "PATCH", 
    { body: { choreog: addchoreog } });
    await fetchy(`/api/events/deletechoreog/${props.event._id}`, "PATCH", 
    { body: { choreog: deletechoreog } });

    await fetchy(`/api/events/addgenre/${props.event._id}`, "PATCH", 
    { body: { genre: addgenre } });
    await fetchy(`/api/events/deletegenre/${props.event._id}`, "PATCH", 
    { body: { genre: deletegenre } });

    await fetchy(`/api/events/addprop/${props.event._id}`, "PATCH", 
    { body: { prop: addprop } });
    await fetchy(`/api/events/deleteprop/${props.event._id}`, "PATCH", 
    { body: { prop: deleteprop } });
  } catch (e) {
    return;
  }
  emit("editEvent");
  emit("refreshEvents");
};
</script>

<template>
  <form @submit.prevent="editEvent(name, time, location, price, description, 
  addchoreog, deletechoreog, addgenre, deletegenre, addprop, deleteprop)">
    <p class="author">{{ props.event.author }}</p>
    <p>{{ "Name:" }}</p>
    <textarea id="name" v-model="name" placeholder="Insert event name" required> </textarea>
    <p>{{ "Time:" }}</p>
    <textarea id="time" v-model="time" placeholder="Insert event time" required> </textarea>
    <p>{{ "Location:" }}</p>
    <textarea id="location" v-model="location" placeholder="Insert event location" required> </textarea>
    <p>{{ "Price:" }}</p>
    <textarea id="price" v-model="price" placeholder="Insert event price" required> </textarea>
    <p>{{ "Description:" }}</p>
    <textarea id="description" v-model="description" placeholder="Insert event description" required> </textarea>
    <p>{{ "Add Choreographer:" }}</p>
    <textarea id="addchoreog" v-model="addchoreog" placeholder="Add event choreographer"> </textarea>
    <p>{{ "Delete Choreographer:" }}</p>
    <textarea id="deletechoreog" v-model="deletechoreog" placeholder="Delete event choreographer"> </textarea>
    <p>{{ "Add Genre:" }}</p>
    <textarea id="addgenre" v-model="addgenre" placeholder="Add event genre"> </textarea>
    <p>{{ "Delete Genre:" }}</p>
    <textarea id="deletegenre" v-model="deletegenre" placeholder="Delete event genre"> </textarea>
    <p>{{ "Add Prop:" }}</p>
    <textarea id="addprop" v-model="addprop" placeholder="Add event prop"> </textarea>
    <p>{{ "Delete Prop:" }}</p>
    <textarea id="deleteprop" v-model="deleteprop" placeholder="Delete event prop"> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editEvent')">Cancel</button></li>
      </menu>
      <p v-if="props.event.dateCreated !== props.event.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.event.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.event.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

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

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
