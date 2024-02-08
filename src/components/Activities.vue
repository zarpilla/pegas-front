<script setup lang="ts">
import { useActivityStore } from '../stores/activity'
import { ref } from 'vue'

const activityStore = useActivityStore()

const activities = ref<any[]>([])

activityStore.load().then((a:any) => {
    activities.value = a
})

</script>

<template>
    <div v-for="(a, i) in activities" :key="i" class="mb-5">
        <h2>{{ a.attributes.name }}</h2>
        <p>{{ a.attributes.description }}</p>
        <div v-for="(s, j) in a.attributes.sessions.data" :key="s.id" class="mb-5">
            <h4>{{ s.attributes.name }}</h4>
            <p>{{ s.attributes.date }}</p>
            <p v-if="s.attributes.description" v-html="s.attributes.description"></p>
            <RouterLink class="it-link" :to="`/session/${s.attributes.uuid}`">
                View
            </RouterLink>
        </div>
    </div>
</template>
