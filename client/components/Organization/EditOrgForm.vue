<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["org"]);
const name = ref(props.org.name);
const description = ref(props.org.description);
const privacy = ref(props.org.privacy);
const addmember = ref(props.org.addmember);
const deletemember = ref(props.org.deletemember);

const emit = defineEmits(["editOrg", "refreshOrgs"]);

const editOrg = async (name: string, description: string, privacy: string, 
  addmember: string, deletemember: string) => {
  try {
    await fetchy(`/api/organizations/${props.org._id}`, "PATCH", 
    { body: { name: name, description: description, privacy: privacy } });
    
    await fetchy(`/api/organizations/addmember/${props.org._id}`, "PATCH", 
    { body: { member: addmember } });
    await fetchy(`/api/organizations/deletemember/${props.org._id}`, "PATCH", 
    { body: { member: deletemember } });
  } catch (e) {
    return;
  }
  emit("editOrg");
  emit("refreshOrgs");
};
</script>

<template>
  <form @submit.prevent="editOrg(name, description, privacy, addmember, deletemember)">
    <p class="author">{{ props.org.author }}</p>
    <p>{{ "Name:" }}</p>
    <textarea id="name" v-model="name" placeholder="Insert organization name" required> </textarea>
    <p>{{ "Description:" }}</p>
    <textarea id="description" v-model="description" placeholder="Insert organization description" required> </textarea>
    <p>{{ "Privacy:" }}</p>
    <textarea id="privacy" v-model="privacy" placeholder="Insert organization privacy setting (private or public)" required> </textarea>
    <p>{{ "Add Member:" }}</p>
    <textarea id="addmember" v-model="addmember" placeholder="Add organization member" required> </textarea>
    <p>{{ "Delete Member:" }}</p>
    <textarea id="deletemember" v-model="deletemember" placeholder="Delete organization member" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editOrg')">Cancel</button></li>
      </menu>
      <p v-if="props.org.dateCreated !== props.org.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.org.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.org.dateCreated) }}</p>
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
