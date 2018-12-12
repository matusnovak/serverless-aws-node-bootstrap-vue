<template>
  <div id="app">

    <b-navbar toggleable="md" type="light" variant="light" class="mb-3 border-bottom box-shadow">
      <b-container>
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand @click="$router.push('/')">NavBar</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">

          <b-navbar-nav>
            <b-nav-item href="#">Link #1</b-nav-item>
            <b-nav-item href="#">Link #2</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown v-if="!loggedin" text="User" right>
              <b-dropdown-item @click="$refs.dialogLogin.show()">Login</b-dropdown-item>
              <b-dropdown-item @click="$refs.dialogRegister.show()">Register</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown v-else text="User" right>
              <b-dropdown-item @click="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>

    <b-container>
      <router-view></router-view>
    </b-container>

    <dialog-register v-on:submit="handleLoggin" ref="dialogRegister"/>
    <dialog-login v-on:submit="handleLoggin" ref="dialogLogin"/>
  </div>
</template>

<script>
import cookies from 'browser-cookies'
import DialogRegister from './dialogs/DialogRegister'
import DialogLogin from './dialogs/DialogLogin'

export default {
  name: 'app',
  data() {
    global.loggedin = !!cookies.get('jwt')
    return {
      loggedin: global.loggedin
    }
  },
  methods: {
    handleLoggin() {
      this.loggedin = true
      global.loggedin = true
    },
    logout() {
      this.$http.post('production/rest/user/logout', {}).then(() => {
        this.loggedin = false
        global.loggedin = false
      })
    }
  },
  mounted() {
		this.$nextTick(() => {
      global.dialogLogin = this.$refs.dialogLogin
    })
  },
  components: {
    DialogRegister,
    DialogLogin
  }
}
</script>

<style>
.border-top {
  border-top: 1px solid #e5e5e5;
}
.border-bottom {
  border-bottom: 1px solid #e5e5e5;
}
.box-shadow {
  box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05);
}
</style>