import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../pages/Main.vue'),
    },
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('../pages/Post.vue'),
    },
    {
      path: '/post-by-author/:id',
      name: 'post-by-author',
      component: () => import('../pages/PostslistAuthor.vue'),
    },
  ],
})

export default router
