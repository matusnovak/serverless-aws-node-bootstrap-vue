<template>
  <div class="comment mt-3">
    <h4 class="text-primary mb-0">{{comment.author}}</h4>
    <p class="text-secondary mb-0">Created at {{created}}</p>
    <p class="body mb-0">{{comment.text}}</p>
  </div>
</template>

<script>
export default {
  data() {
    const date = new Date(this.comment.created)
    return {
      created: date.toLocaleTimeString() + ' ' + date.toLocaleDateString()
    }
  },
  props: {
    comment: {
      required: true,
      type: Object
    }
  }
}
</script>
