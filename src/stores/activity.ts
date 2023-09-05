import service from "@/service/index";
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useActivityStore = defineStore('activity', () => {
  
  const activities = ref([])
  
  async function load() {
    const query = `activities?populate=sessions&sort=updatedAt:desc`
    const { data } = await service({ requiresAuth: false }).get(query)

    if (data.data && data.data.length) {
      return data.data
    } 
    return []
  }

  async function loadSession(sessionId: string) {
    const query = `sessions?filters[uuid][$eq]=${sessionId}&populate=activity`
    const { data } = await service({ requiresAuth: false }).get(query)

    if (data.data && data.data.length) {
      return data.data[0]
    } 
    return null
  }

  return { activities, load, loadSession }
})
