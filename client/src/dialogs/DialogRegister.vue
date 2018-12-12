<template>
  <div>
    <!-- Modal Component -->
    <b-modal ref="modal" title="Register" @ok="ok">
      <b-form @submit="submit" @cancel="hide" v-if="show">
        <b-form-group label="Username:">
          <b-form-input type="text"
                        v-model="form.username"
                        required
                        placeholder="Enter a new username"
                        :state="!$v.form.username.$invalid"
                        aria-describedby="inputUsernameFeedback" />
          <b-form-invalid-feedback id="inputUsernameFeedback">
            This is a required field and must be at least 3 characters long
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Password:">
          <b-form-input type="password"
                        v-model="form.password"
                        required
                        placeholder="Enter a new password"
                        :state="!$v.form.password.$invalid"
                        aria-describedby="inputPasswordFeedback" />
          <b-form-invalid-feedback id="inputPasswordFeedback">
            This is a required field and must be at least 3 characters long
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form>

      <b-alert show variant="danger" dismissible v-if="!!message">{{message}}</b-alert>
    </b-modal>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength } from "vuelidate/lib/validators"

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      message: ''
    }
  },
  mixins: [
    validationMixin
  ],
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3)  
      },
      password: {
        required,
        minLength: minLength(3)  
      }
    }
  },
  methods: {
    show () {
      this.form.username = ''
      this.form.password = ''
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
        this.$http.post('production/rest/user/register', this.form).then(response => {
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
