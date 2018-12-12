<template>
  <b-card class="mb-3" :title="post.title" :sub-title="'Created at ' + created + ' by ' + post.author">
    <b-btn variant="primary" @click="addComment">Add a comment</b-btn>
    <p v-if="!!comments && comments.length !== 0" class="card-text">
      <ul class="comment-list">
        <li v-for="comment in comments" :key="comment.id">
          <comment :comment="comment" />
        </li>
      </ul>
    </p>
    <p v-else-if="!!comments" class="card-text">
      There are no comments in this post.
    </p>
    <p v-else class="card-text">
      Loading comments...
    </p>

    <dialog-comment ref="dialogComment" :post="post" v-on:submit="handleSubmit"/>
  </b-card>
</template>

<script>
import Comment from './Comment'
import DialogComment from '../dialogs/DialogComment'

export default {
  data() {
    const date = new Date(this.post.created)
    return {
      created: date.toLocaleTimeString() + ' ' + date.toLocaleDateString(),
      comments: null
    }
  },
  methods: {
    fetch() {
      this.$http.get(`production/rest/post/${this.post.id}/comment`).then(response => {
        this.comments = response.data || []
      })
    },
    addComment() {
      if (global.loggedin) {
        this.$refs.dialogComment.show()
      } else {
        global.dialogLogin.show()
      }
    },
    handleSubmit(comment) {
      this.comments.unshift(comment)
    }
  },
  mounted() {
		this.$nextTick(() => {
      this.fetch()
    })
  },
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  components: {
    Comment,
    DialogComment
  }
}
</script>

<style scoped>
.comment-list {
  list-style: none;
}
</style>
