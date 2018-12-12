<template>
  <div id="posts">
    <div class="actions mb-3">
      <b-link to="/">&lt;&lt; Go Back</b-link>
    </div>
    <template v-if="!!post">
      <post-details :post="post" />
    </template>
    <template v-else>
      <h3>Loading post...</h3>
    </template>
  </div>
</template>

<script>
import PostDetails from '../components/PostDetails'

export default {
  data() {
    return {
      post: null
    }
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: {
    fetch() {
      this.$http.get(`production/rest/post/${this.id}`).then(response => {
        this.post = response.data
      })
    }
  },
  mounted() {
		this.$nextTick(() => {
      this.fetch()
    })
  },
  components: {
    PostDetails
  }
}
</script>
