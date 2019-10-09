<template>
  <div>
    <p>hello {{ name }}</p>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      name: 'world',
    }
  },
}
</script>

<style lang="scss" scoped>
p{
  border: 4px solid orange;
  margin-top: 4rem;
  padding: 4rem;
  display: block
}
body{
  background: rgb(7, 125, 221);
}
</style>