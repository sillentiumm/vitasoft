<template>
  <form @submit.prevent="updatePost" action="">
    <h3>Добавить комментарий</h3>
    <div>
      <input
        v-model="name"
        placeholder="Имя"
        type="text"
      >
      <span
        v-if="errors.name"
        class="error"
      >
        {{ errors.name }}
      </span>
    </div>
    <div>
      <input
        v-model="email"
        placeholder="Email"
        type="text"
      >
      <span
        v-if="errors.email"
        class="error"
      >
        {{ errors.email }}
      </span>
    </div>
    <div>
      <textarea
        v-model="comment"
        @input="adjustHeight($event, 'textareaComment')"
        ref="textareaComment"
        placeholder="Комментарий"
      ></textarea>
      <span
        v-if="errors.comment"
        class="error"
      >
        {{ errors.comment }}
      </span>
    </div>

    <button @click="addComment">Отправить</button>
  </form>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['addComment'])

const { handleSubmit, errors, resetForm, defineField } = useForm({
  validateOnMount: false,
  validationSchema: {

    name (value) {
      if (!value) return 'Введите ваше имя'
      if (value.length > 50) return 'Максимальное длина - 50 символов'
      return true
    },
    email (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) return 'Введите ваш email'
      if (!emailRegex.test(value)) return 'Некорректный формат email'
      if (value.length > 100) return 'Максимальное длина - 100 символов'
      return true
    },
    comment (value) {
      if (!value) return 'Введите комментарий'
      if (value.length > 255) return 'Максимальное длина - 255 символов'
      return true
    },
  },
})

const [name] = defineField('name')
const [email] = defineField('email')
const [comment] = defineField('comment')

const textareaComment = ref(null)

const adjustHeight = (event, textareaRef) => {
  if (!textareaRef) return
  let textarea 
   if (textareaRef === 'textareaComment') textarea = textareaComment

  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

const addComment = handleSubmit((values) => {
  const link = '/api/comment'
  const data = { userInfo:name.value, email: email.value, textComment: comment.value }
  const params = { params: { postId:props.id }}

  return axios.post(link, data, params)
    .then((response) => {
      if (response.data) {
        resetForm({
          values: {
            name: '',
            email: '',
            comment: '',
          },
        })
        emit('addComment')
        return response.data
      }
    })
    .catch((error) => {
      console.log('Ошибка при добавлении комментария')
    })
})

onMounted(() => {
  adjustHeight(null, 'textareaComment')
})

</script>