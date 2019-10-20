<template>
  <button @click="count++">
    {{count}}
  </button>
</template>

<script>
export default {
  setup(){
    const count = ref(0)
    return {
      count
    }
  }
}
</script>

<style>

</style>