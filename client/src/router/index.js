import Vue from 'vue'
import Router from 'vue-router'
import ViewHome from '../views/ViewHome'
import ViewPost from '../views/ViewPost'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: ViewHome
    },
    {
      path: '/post/:id',
      name: 'Post',
      component: ViewPost,
      props: true
    }
  ]
})
  