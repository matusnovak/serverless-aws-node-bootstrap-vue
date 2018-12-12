<template>
  <b-card class="mb-3" :title="post.title" :sub-title="'Created at ' + created + ' by ' + post.author">
    <b-link :to="'/post/' + this.post.id" class="card-link">{{post.comments}} comments</b-link>
  </b-card>
</template>

<script>
export default {
  data() {
    const date = new Date(this.post.created)
    return {
      created: date.toLocaleTimeString() + ' ' + date.toLocaleDateString()
    }
  },
  props: {
    post: {
      required: true,
      type: Object
    }
  }
}
</script>
