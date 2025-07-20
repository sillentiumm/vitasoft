<template>
  <div class="wrapper">
    <div class="post">
      <router-link
        to="/"
        class="close"
      >
        ×
      </router-link> 
      <PostChange
        :post="post"
        v-if="ready"
      />
      <PostComments
        :comments="post.comments"
        @deleteComment="updatePost"
        v-if="commentsLength"
      />
      <PostAddComment
        :id="post.id"
        @addComment="updatePost"
        v-if="ready"
      />
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import PostChange from '@/components/PostChange.vue'
import PostAddComment from '@/components/PostAddComment.vue'
import PostComments from '@/components/PostComments.vue'

const route = useRoute()
const router = useRouter()
const post = reactive({})
const commentsLength = ref('0')
const ready = ref(false)

const getPostById = async () => {
  const link = `/api/post/${route.params.id}`
    return axios.get(link)
      .then((response) => {
        Object.assign(post, response.data)
        commentsLength.value = response.data.comments.length
        ready.value = true
        if (response.data) return response.data
      })
      .catch((error) => {
        router.push({ name: 'main' })
        console.log('Ошибка получения поста по id')
      })
}

const updatePost = () => {
  getPostById()
}

onMounted(() => {
  getPostById()
})

</script>

<style scoped lang="sass">
a
  color: #000
  font-size: 32px
  font-weight: 500
  text-decoration: none
.post
  position: relative
  width: 480px
  display: flex
  flex-direction: column
  gap: 16px
  font-size: 18px
  font-weight: 400
  background-color: #fff
  border-radius: 12px
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2)
  margin: 0 auto
  padding: 48px 24px 48px 24px
form 
  position: relative
  display: flex
  flex-direction: column
  gap: 12px
  padding-bottom: 24px
  &::after
    content: ''
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    height: 1px
    background-color: grey
h3
  text-align: center
  font-size: 22px
  font-weight: 400
  margin-bottom: 16px
input, textarea
  font-size: 18px
  font-weight: 400
input 
  margin-bottom: 4px

@media (max-width: 768px)
  .wrapper
    padding-left: 16px
    padding-right: 16px
  .post
    width: auto
</style>