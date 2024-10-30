<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";

const props = defineProps(["invite"]);
const from = props.invite.from;
const to = props.invite.to;
const event = props.invite.event;

const emit = defineEmits(["refreshInvites"]);
const { currentUsername } = storeToRefs(useUserStore());

const removeInvite = async () => {
  try {
    await fetchy(`/api/invite/${event}/${to}`, "DELETE" );
  } catch (e) {
    return;
  }
  emit("refreshInvites");
};

const acceptInvite = async () => {
  try {
    await fetchy(`/api/invite/accept/${event}/${from}`, "PUT" );
  } catch (e) {
    return;
  }
  emit("refreshInvites");
};

const rejectInvite = async () => {
  try {
    await fetchy(`/api/invite/reject/${event}/${from}`, "PUT" );
  } catch (e) {
    return;
  }
  emit("refreshInvites");
};

</script>

<template>
  <p>{{ "From: " + props.invite.from }}</p>
  <p>{{ "To: " + props.invite.to }}</p>
  <p>{{ "Event: " + props.invite.event }}</p>
  <p>{{ "Status: " + props.invite.status }}</p>
  <menu v-if="props.invite.to == currentUsername">
      <li><button class="btn-small pure-button" @click="acceptInvite">Accept Invite</button></li>
      <li><button class="btn-small pure-button" @click="rejectInvite">Reject Invite</button></li>
  </menu>
  <menu v-if="props.invite.from == currentUsername">
      <li><button class="btn-small pure-button" @click='removeInvite'>Remove Invite</button></li>
  </menu>
  <div class="base">
    <article class="timestamp">
      <p v-if="props.invite.dateCreated !== props.invite.dateUpdated">Edited on: {{ formatDate(props.invite.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.invite.dateCreated) }}</p>
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
