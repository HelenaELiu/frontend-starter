<script setup lang="ts">
import InviteComponent from "@/components/Invite/InviteComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let invites = ref<Array<Record<string, string>>>([]);
let accepting = ref("");
let rejecting = ref("");
let removing = ref("");

async function getInvites() {
  let inviteResults;
  try {
    inviteResults = await fetchy("/api/invite", "GET", { });
  } catch (_) {
    return;
  }
  invites.value = inviteResults;
}

function updateAccepting(id: string) {
  accepting.value = id;
}

function updateRejecting(id: string) {
  rejecting.value = id;
}

function updateRemoving(id: string) {
  removing.value = id;
}

onBeforeMount(async () => {
  await getInvites();
  loaded.value = true;
});
</script>

<template>
  <section class="invites" v-if="loaded && invites.length !== 0">
    <article v-for="invite in invites" :key="invite._id">
      <InviteComponent v-if="accepting !== invite._id && rejecting !== invite._id && removing !== invite._id" 
      :invite="invite" @refreshInvites="getInvites" @acceptInvite="updateAccepting" @rejectInvite="updateRejecting" 
      @removeInvite="updateRemoving" />
      <InviteComponent v-else-if="accepting === invite._id" :invite="invite" 
      @refreshInvites="getInvites" @acceptInvite="updateAccepting"/>
      <InviteComponent v-else-if="rejecting === invite._id" :invite="invite" 
      @refreshInvites="getInvites" @rejectInvite="updateRejecting"/>
      <InviteComponent v-else-if="removing === invite._id" :invite="invite" 
      @refreshInvites="getInvites" @removeInvite="updateRemoving"/>
    </article>
  </section>
  <p v-else-if="loaded">No invites found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
