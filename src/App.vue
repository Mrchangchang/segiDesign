<template>
  <div id="app">
    <AddPage/>
  </div>
</template>

<script>
import AddPage from './views/AddPage'
export default {
  components: {
    AddPage
  },
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
