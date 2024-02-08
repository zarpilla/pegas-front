<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="d-flex justify-content-center mt-4 mb-4">
    <div class="w-25 d-none d-md-flex">
      <img src="@/assets/img/logo.svg" class="w-100 text-center" alt="" />
    </div>
    <div class="w-50 d-flex d-md-none">
      <img src="@/assets/img/logo.svg" class="w-100 text-center" alt="" />
    </div>
  </div>  
</template>

<style scoped>
@media (min-width: 1024px) {

}
</style>
