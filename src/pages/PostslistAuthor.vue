
<template>
  <div>
    <PostsList :userId="route.params.id"/>
  </div>
</template>

<script setup >
import PostsList from '@/components/PostsList.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

</script>