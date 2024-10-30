<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["event"]);
const to = ref(props.event.to);

const emit = defineEmits(["sendInvite", "refreshEvents", "refreshInvites"]);

const sendInvite = async (to: string) => {
  try {
    await fetchy(`/api/invite/${props.event.name}/${to}`, "POST", 
    { body: { to: to, event: props.event.name } });
  } catch (e) {
    return;
  }
  emit("sendInvite");
  emit("refreshEvents");
  emit("refreshInvites");
};
</script>

<template>
  <form @submit.prevent="sendInvite(to)">
    <p class="author">{{ props.event.name }}</p>
    <p>{{ "Send Invite To:" }}</p>
    <textarea id="to" v-model="to" placeholder="Insert event invitee" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('sendInvite')">Cancel</button></li>
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
