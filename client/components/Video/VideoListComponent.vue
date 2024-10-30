<script setup lang="ts">
import CreateVideoForm from "@/components/Video/CreateVideoForm.vue";
import VideoComponent from "@/components/Video/VideoComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchVideoForm from "@/components/Video/SearchVideoForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let videos = ref<Array<Record<string, string>>>([]);
let searchAuthor = ref("");

async function getVideos(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let videoResults;
  try {
    videoResults = await fetchy("/api/videos", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  videos.value = videoResults;
}

onBeforeMount(async () => {
  await getVideos();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a video:</h2>
    <CreateVideoForm @refreshVideos="getVideos" />
  </section>
  <div class="row">
    <h2 v-if="!searchAuthor">Videos:</h2>
    <h2 v-else>Videos by {{ searchAuthor }}:</h2>
    <SearchVideoForm @getVideosByAuthor="getVideos" />
  </div>
  <section class="videos" v-if="loaded && videos.length !== 0">
    <article v-for="video in videos" :key="video._id">
      <VideoComponent :video="video" @refreshVideos="getVideos" />
    </article>
  </section>
  <p v-else-if="loaded">No videos found</p>
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
