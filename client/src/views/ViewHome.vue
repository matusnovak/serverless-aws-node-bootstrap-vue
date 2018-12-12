<template>
  <div id="home">
    <div class="actions mb-3">
      <b-btn variant="primary" @click="addPost">Create a post</b-btn>
    </div>
    <template v-if="!!posts && posts.length !== 0">
      <div id="posts" v-for="post in posts" :key="post.id">
        <post :post="post" />
      </div>
    </template>
    <template v-else-if="!!posts">
      <h3>No posts found...</h3>
    </template>
    <template v-else>
      <h3>Loading posts...</h3>
    </template>

    <dialog-post ref="dialogPost" v-on:submit="handleSubmit"/>
  </div>
</template>

<script>
import DialogPost from '../dialogs/DialogPost'
import Post from '../components/Post'

export default {
  data() {
    return {
      posts: null
    }
  },
  methods: {
    fetch() {
      this.$http.get('production/rest/post').then(response => {
        this.posts = response.data
      })
    },
    addPost() {
      if (global.loggedin) {
        this.$refs.dialogPost.show()
      } else {
        global.dialogLogin.show()
      }
    },
    handleSubmit(post) {
      this.posts.unshift(post)
    }
  },
  mounted() {
		this.$nextTick(() => {
      this.fetch()
    })
  },
  components: {
    DialogPost,
    Post
  }
}
</script>
