<template>
  <div>
    <!-- Modal Component -->
    <b-modal ref="modal" title="Create a mew comment!" @ok="ok">
      <b-form @submit="submit" @cancel="hide" v-if="show">
        <b-form-group label="Comment body:">
          <b-form-textarea
                        :rows="3"
                        :max-rows="6"
                        v-model="form.text"
                        required
                        placeholder="Enter something"
                        :state="!$v.form.text.$invalid"
                        aria-describedby="inputTextFeedback" />
          <b-form-invalid-feedback id="inputTextFeedback">
            This is a required field and must be at least 10 characters
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>

      <b-alert show variant="danger" dismissible v-if="!!message">{{message}}</b-alert>
    </b-modal>
  </div>
</template>

<script>
import cookies from 'browser-cookies'
import { validationMixin } from 'vuelidate'
import { required, minLength } from "vuelidate/lib/validators"

export default {
  data() {
    return {
      form: {
        text: ''
      },
      message: ''
    }
  },
  mixins: [
    validationMixin
  ],
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  validations: {
    form: {
      text: {
        required,
        minLength: minLength(10)  
      }
    }
  },
  methods: {
    show () {
      this.form.text = ''
      this.$nextTick(() => { this.$v.$reset() })
      this.$refs.modal.show()
    },
    hide () {
      this.$refs.modal.hide()
    },
    ok (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      this.submit()
    },
    submit() {
      if (!this.$v.$invalid) {
        const config = {
          headers: {
            'Authorization': 'Bearer ' + cookies.get('jwt')
          }
        }
        this.$http.post(`production/rest/post/${this.post.id}/comment`, this.form, config).then(response => {
          this.$emit('submit', response.data)
          this.hide()
        }).catch(err => {
          this.message = err.response.data.message || err.message
        })
      } else {
        this.$v.$touch()
      }
    }
  }
}
</script>
