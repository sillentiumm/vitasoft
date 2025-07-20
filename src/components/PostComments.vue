<template>
  <div class="">
    <h3>Комментарии</h3>
    <div class="comments">
      <div
        v-for="comment in comments"
        @click="deleteComment(comment.id)"
        :key="comment.id"
        class="comment"
      >
        <button class="close close-mini">×</button>
        <p> 
          <IconAvatar/>
          {{ comment.userInfo }}
        </p>
        <p class="comment__email">{{ comment.email }}</p>
        <p>{{ comment.textComment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'

import IconAvatar from '@/components/icons/IconAvatar.vue'

const props = defineProps({
  comments: {
    type: null,
    required: true
  }
})

const emit = defineEmits(['deleteComment'])

const deleteComment = async (id) => {
  const link = `/api/comment/${id}`
    return axios.delete(link)
      .then((response) => {
        emit('deleteComment')
        if (response.data) return response.data
      })
      .catch((error) => {
        console.log('Ошибка удаления комментария')
      })
}


</script>

<style scoped lang="sass">
.comments
  display: flex
  flex-direction: column
  gap: 12px
  border-bottom: 1px solid grey
.comment
  position: relative
  border-bottom: 1px solid lightgrey
  border-radius: 4px
  padding-top: 8px
  padding-bottom: 16px
  &__email
    margin-bottom: 12px
</style>