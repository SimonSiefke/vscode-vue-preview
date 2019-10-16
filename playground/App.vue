<template>
  <div>
    <p>hello {{ message }}</p>
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