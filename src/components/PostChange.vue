<template>
  <form>
    <h3>Информация</h3>
    <div>
      <input
        v-model="title"
        placeholder="Заголовок"
        type="text"
      >
      <span
        v-if="errors.title"
        class="error"
      >
        {{ errors.title }}
      </span>
    </div>
    <div>
      <textarea
        v-model="briefDescription"
        @input="adjustHeight($event, 'textareaBbiefDescription')"
        ref="textareaBbiefDescription"
        placeholder="Краткое описание"
      ></textarea>
      <span
        v-if="errors.briefDescription"
        class="error"
      >
        {{ errors.briefDescription }}
      </span>
    </div>
    <div>
      <textarea
        v-model="fullDescription"
        @input="adjustHeight($event, 'textareaFullDescription')"
        ref="textareaFullDescription"
        placeholder="Полное описание"
      ></textarea>
      <span
        v-if="errors.fullDescription"
        class="error"
      >
        {{ errors.fullDescription }}
      </span>
    </div>
    <div class="date">
      {{ post.dateTime }}
    </div>
    <div class="post__buttons">
      <button @click.prevent="updatePost">Обновить</button>
      <button @click.prevent="deletePost" class="button-delete">Удалить</button>
    </div>

  </form>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, watch  } from 'vue'
import { useForm, useField } from 'vee-validate'
import { useRouter } from 'vue-router'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const { handleSubmit, errors, setValues, defineField } = useForm({
  validateOnMount: false,
  validationSchema: {
    title (value) {
      if (!value) return 'Введите название'
      if (value.length > 50) return 'Максимальное длина названия - 100 символов'
      return true
    },
    briefDescription (value) {
      if (!value) return 'Введите описание'
      if (value.length > 100) return 'Максимальное длина - 100 символов'
      return true
    },
    fullDescription (value) {
      if (!value) return 'Введите описание'
      if (value.length > 255) return 'Максимальное длина - 100 символов'
      return true
    }
  },
})

const { value: title } = useField('title')
const { value: briefDescription } = useField('briefDescription')
const { value: fullDescription } = useField('fullDescription')

const updatePost = handleSubmit((values) => {
  const link = '/api/post'
  const data = { id:props.post.id, title: title.value, briefDescription: briefDescription.value, fullDescription: fullDescription.value }
    return axios.put(link, data)
      .then((response) => {
        if (response.data) {
          props.post.dateTime = response.data.dateTime
          props.post.title = response.data.title
          props.post.briefDescription = response.data.briefDescription
          props.post.fullDescription = response.data.fullDescription
          return response.data
        }
      })
      .catch((error) => {
        console.log('Ошибка обновления записи')
      })
})

const deletePost = async () => {
  const link = `/api/post/${props.post.id}`
    return axios.delete(link)
      .then((response) => {
        router.push({ name: 'main' })
        return response
      })
      .catch((error) => {
        console.log('Ошибка удаления записи')
      })
}

watch(() => props.post,(newPost) => {
  if (newPost) {
    const plainPost = JSON.parse(JSON.stringify(newPost))
    setValues({
      title: plainPost.title,
      briefDescription: plainPost.briefDescription,
      fullDescription: plainPost.fullDescription,
    })
  }
},
{ immediate: true, deep: true }
)

const textareaBbiefDescription = ref(null)
const textareaFullDescription = ref(null)

onMounted(() => {
  adjustHeight(null, 'textareaBbiefDescription')
  adjustHeight(null, 'textareaFullDescription')
})

const adjustHeight = (event, textareaRef) => {
  if (!textareaRef) return
  let textarea
  if (textareaRef === 'textareaBbiefDescription') textarea = textareaBbiefDescription
  else if (textareaRef === 'textareaFullDescription') textarea = textareaFullDescription
  if (textarea.value) textarea.value.style.height = textarea.value.scrollHeight + 'px'
}

</script>

<style scoped lang="sass">
.date
  height: 28px
  display: flex
  align-items: center
  font-size: 14px
  border: 1px solid grey
  border-radius: 4px 
  padding: 4px
.post__buttons
  display: flex
  justify-content: space-between
  & button 
    width: 45%
    margin: 0
</style>