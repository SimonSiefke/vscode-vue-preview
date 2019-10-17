<template>
  <div>
    <p>hello {{ message }}</p>
    <button>its a button</button>
    <p @click="count++">{{ count }}</p>
    <button>ok</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      count: 222,
    }
  },
}
</script>

<preview-props>
{
  "message" : "world"
}
</preview-props>

<style lang="scss" scoped>

p {
  border: 4px solid orange;
  margin-top: 4rem;
  padding: 4rem;
  display: block
}
body{
  background: rgb(35, 150, 243);
}
</style>