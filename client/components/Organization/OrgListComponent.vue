<script setup lang="ts">
import CreateOrgForm from "@/components/Organization/CreateOrgForm.vue";
import EditOrgForm from "@/components/Organization/EditOrgForm.vue";
import OrgComponent from "@/components/Organization/OrgComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchOrgForm from "@/components/Organization/SearchOrgForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let orgs = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getOrgs(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let orgResults;
  try {
    orgResults = await fetchy("/api/organizations", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  orgs.value = orgResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getOrgs();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create an organization:</h2>
    <CreateOrgForm @refreshOrgs="getOrgs" />
  </section>
  <div class="row">
    <h2 v-if="!searchAuthor">Organizations:</h2>
    <h2 v-else>Organizations by {{ searchAuthor }}:</h2>
    <SearchOrgForm @getOrganizationsByAuthor="getOrgs" />
  </div>
  <section class="orgs" v-if="loaded && orgs.length !== 0">
    <article v-for="org in orgs" :key="org._id">
      <OrgComponent v-if="editing !== org._id" :org="org" @refreshOrgs="getOrgs" @editOrg="updateEditing" />
      <EditOrgForm v-else :org="org" @refreshOrgs="getOrgs" @editOrg="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No organizations found</p>
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
