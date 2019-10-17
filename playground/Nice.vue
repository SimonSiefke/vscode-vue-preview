<template>
  <div id="app">
    <button @click="count--">
    {{ count }}
    </button>
    <p>live preview</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 222
    };
  }
};
</script>

<style>
button{
  all:unset;
  background: #509be6;
  color: #ffffff;
  padding: 1rem;
  border: 1rem dotted salmon;
  border-radius: 1rem
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 60px;
}
</style>
