<template>
  <div class="container">
    <PostsList v-if="ready"/>
  </div>
</template>

<script setup>
import { ref, onMounted, } from 'vue'
import axios from 'axios'
import PostsList from '@/components/PostsList.vue'

const ready = ref(false)

const authorization = async (param) => {
  const link = '/api-auth/login'

  const data = { params: { username: 'Kantemir', password: 'Antiochus'} }
  return axios
    .post(link, null, data)
    .then((response) => {
      ready.value = true
      return response.data
    })
    .catch((error) => {
      console.log('Ошибка авторизации')
    })
}

onMounted(() => {
  authorization()
})

</script>

<style scoped lang="sass">
.container
  position: relative
  width: 100%
  min-height: 100vh
</style>
