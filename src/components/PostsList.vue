<template>
  <div class="wrapper">
    <PostCreate
      v-if="createPostVisible"
      @close="updatePosts"
      :userId="userId"
    />
    <h3 v-if="blogName">{{ blogName }}</h3>
    <h3 v-else>Список записей</h3>
    <div class="postslist">
      <div
        v-for="post in sortedPosts"
        :key="post.postId"
        @click="routerToPost(post.postId)"
        class="post"
      >
        <router-link
          :to="{ name: 'post-by-author', params: { id: post.userInfoId } }"
          @click.stop
        > 
          <IconAvatar/>
          {{ post.fullName }}
        </router-link>
        <h4> {{ post.title }} </h4>
        <p> {{ post.briefDescription }} </p>
        <p> {{ post.fullDescription }} </p>
        <p> {{ post.dateTime }} </p>
        <span v-if="post.comments.length"> Комментариев: {{ post.comments.length }} </span>
        <span v-else> Нет комментариев</span>
      </div>
    </div>
    <button
      v-if="userId"
      @click="createPostVisible= !createPostVisible"
      class="post-add"
    >
      создать запись
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

import PostCreate from '@/components/PostCreate.vue'
import IconAvatar from '@/components/icons/IconAvatar.vue'

const props = defineProps({
  userId: {
    type: String,
    default: null
  }
})

const router = useRouter()
const route = useRoute()
const postslist = reactive([])
const createPostVisible = ref(false)

const ready = ref(false)
const blogName = ref(null)

const sortedPosts = computed(() => {
  if (!ready) return []
  let authorSorted = postslist
  if (props.userId) authorSorted = postslist.filter(item => item.userInfoId === Number(route.params.id))
  
  return [...authorSorted].sort((a, b) => {
    const dateA = parseDate(a.dateTime)
    const dateB = parseDate(b.dateTime)
    return dateB - dateA
  })
})

const parseDate = (dateString) => {
  const [datePart, timePart] = dateString.split(' ')
  const [day, month, year] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes)
}

const routerToPost = (postId) => {
  router.push({ name: 'post', params: { id: postId } })
}

const updatePosts = () => {
  createPostVisible.value= !createPostVisible.value
  getUserInfo()
}

const getUserInfo = () => {
  const link = '/api/userInfo/findAll'
    return axios.get(link)
      .then((response) => {
        if (!response.data) return
        postslist.length = 0
        response.data.forEach(userInfo => {
          if(props.userId) blogName.value = response.data.find(el => el.id === Number(props.userId)).blogName
          userInfo.post.forEach(post => {
            const data = { 
              userInfoId: userInfo.id, fullName: userInfo.fullName, blogName: userInfo.blogName, postId: post.id,
              title:post.title, dateTime: post.dateTime, briefDescription: post.briefDescription,
              fullDescription: post.fullDescription, comments: post.comments
            }
            postslist.push(data)
            ready.value = true
          })
        })
      })
      .catch((error) => {
        router.push({ name: 'main' })
        console.log('Ошибка получения списка постов')
      })
}

onMounted(() => {
  getUserInfo()
})

</script>

<style scoped lang="sass">
a
  color: #000
  font-size: 20px
  font-weight: 500
  text-decoration: none
h3
  font-size: 30px
  font-weight: 400
  color: #fff
h4
  font-size: 20px
  font-weight: 500
p
  font-size: 16px
  border: 1px solid #1F2128
  padding: 4px
span
  flex: 1
  display: flex
  align-items: flex-end
  padding-top: 12px
.wrapper
  width: 100%
  min-height: 100vh
  background-color: #1F2128
.postslist
  max-width: 1200px
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 16px
  padding: 10px
  margin: 0 auto
.post
  display: flex
  flex-direction: column
  gap: 8px
  background-color: #fff
  font-weight: 400
  border: none
  border-radius: 8px
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2)
  padding: 16px 12px 24px 12px
  &-add 
    display: flex
    justify-content: center
    align-items: center
    margin: 0 auto
    margin-top: 24px
@media (max-width: 1200px) 
  .postslist
    max-width: inherit
    grid-template-columns: repeat(2, 1fr)

@media (max-width: 768px)
  .wrapper
    padding-bottom: 112px
  .postslist
    grid-template-columns: repeat(1, 1fr)
    padding-left: 16px
    padding-right: 16px
  .post-add
    width: calc( 100% - 32px )
    max-width: 356px
    margin: 0 auto
    margin-top: 24px
</style>