<script setup lang="ts">
import { useActivityStore } from '../stores/activity'
import { ref, computed } from 'vue'
import { Api } from '../service/api'

const activityStore = useActivityStore()

const activities = ref<any[]>([])
const searchQuery = ref('')

activityStore.load().then((a:any) => {
    activities.value = a
})

const filteredActivities = computed(() => {
    if (!searchQuery.value.trim()) {
        return activities.value
    }
    
    const query = searchQuery.value.toLowerCase()
    
    return activities.value
        .map(activity => {
            // Check if activity name matches
            const activityNameMatch = activity.attributes.name?.toLowerCase().includes(query)
            
            // Filter sessions that match by name or date
            const matchingSessions = activity.attributes.sessions?.data?.filter((session: any) => 
                session.attributes.name?.toLowerCase().includes(query) ||
                session.attributes.date?.toLowerCase().includes(query)
            ) || []
            
            // If activity name matches, show all sessions
            if (activityNameMatch) {
                return activity
            }
            
            // If sessions match, show only matching sessions
            if (matchingSessions.length > 0) {
                return {
                    ...activity,
                    attributes: {
                        ...activity.attributes,
                        sessions: {
                            data: matchingSessions
                        }
                    }
                }
            }
            
            return null
        })
        .filter(activity => activity !== null)
})

const downloadActivityRegistrations = async (activityId: string, activityName: string) => {
    try {
        const response = await Api.registrations.downloadByActivity(activityId)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `registrations-activity-${activityName}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        console.error('Error downloading activity registrations:', error)
        alert('Error descarregant les inscripcions')
    }
}

const downloadSessionRegistrations = async (sessionId: string, sessionName: string) => {
    try {
        const response = await Api.registrations.downloadBySession(sessionId)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `registrations-session-${sessionName}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (error) {
        console.error('Error downloading session registrations:', error)
        alert('Error descarregant les inscripcions')
    }
}

</script>

<template>
    <div class="mb-5">
        <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cerca per nom d'activitat, sessió o data..." 
            class="form-control"
        />
    </div>
    
    <div v-for="(a, i) in filteredActivities" :key="i" class="mb-5">
        <div class="d-flex justify-content-between align-items-center">
            <h2>{{ a.attributes.name }}</h2>
            <button 
                class="btn btn-sm btn-outline-secondary" 
                @click="downloadActivityRegistrations(a.id, a.attributes.name)"
                title="Descarregar inscripcions de l'activitat"
            >
                📥 Inscripcions
            </button>
        </div>
        <p>{{ a.attributes.description }}</p>
        <div v-for="(s, j) in a.attributes.sessions.data" :key="s.id" class="mb-5">
            <h4>{{ s.attributes.name }}</h4>
            <p>{{ s.attributes.date }}</p>
            <p v-if="s.attributes.description" v-html="s.attributes.description"></p>
            <div class="d-flex gap-2">
                <RouterLink class="it-link btn btn-primary" :to="`/session/${s.attributes.uuid}`">
                    Veure
                </RouterLink>
                <button 
                    class="btn btn-sm btn-outline-secondary" 
                    @click="downloadSessionRegistrations(s.id, s.attributes.name)"
                    title="Descarregar inscripcions de la sessió"
                >
                    📥 Inscripcions
                </button>
            </div>
        </div>
    </div>
</template>
