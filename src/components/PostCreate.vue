<template>
  <div class="wrapper">
    <form @submit.prevent="onSubmit" action="">
      <h3></h3>
      <h3>Создание поста</h3>
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
          @input="adjustHeight($event, 'textarea1')"
          ref="textarea1"
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
          @input="adjustHeight($event, 'textarea2')"
          ref="textarea2"
          placeholder="Полное описание"
        ></textarea>
        <span
          v-if="errors.fullDescription"
          class="error"
        >
          {{ errors.fullDescription }}
        </span>
      </div>
      <button>создать пост</button>
      <div @click="emit('close')" class="close">×</div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import axios from 'axios'

const props = defineProps({
  userId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close'])

const { handleSubmit, errors, defineField } = useForm({
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
    },
  },
})

const [title] = defineField('title')
const [briefDescription] = defineField('briefDescription')
const [fullDescription] = defineField('fullDescription')

const textarea1 = ref(null)
const textarea2 = ref(null)

const adjustHeight = (event, textareaRef) => {
  const textarea = textareaRef === 'textarea1' ? textarea1 : textarea2
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

const onSubmit = handleSubmit((values) => {
  const link = '/api/post'
  const data = {  title: title.value, briefDescription: briefDescription.value, fullDescription: fullDescription.value }
  const params = { params: { userInfoId: props.userId } }
    return axios.post(link, data, params)
      .then((response) => {
        emit('close')
        if (response.data) return response.data
      })
      .catch((error) => {
        console.log('Ошибка при создании записи')
      })
})

onMounted(() => {
  adjustHeight(null, 'textarea1')
  adjustHeight(null, 'textarea2')
})

</script>

<style scoped lang="sass">
  .wrapper
    position: fixed
    top: 0
    &::after
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background-color: rgba(55,55,55,.6)
      backdrop-filter: blur(5px)
      z-index: 20
      overflow: hidden
  form
    filter: none
    position: relative
    width: 480px
    display: flex
    flex-direction: column
    gap: 12px
    font-size: 18px
    font-weight: 400
    background-color: #fff
    border-radius: 12px
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2)
    margin: 0 auto
    padding: 24px 24px 36px 24px
    z-index: 30
  h3
    text-align: center
    font-size: 22px
    font-weight: 400
    margin-bottom: 16px

@media (max-width: 768px)
  .wrapper
    padding-left: 16px
    padding-right: 16px
  form
    width: auto
</style>