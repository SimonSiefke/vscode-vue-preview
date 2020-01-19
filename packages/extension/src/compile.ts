import { compileTemplate, parse } from '@vue/compiler-sfc'

export const compile = (source: string) => {
  const parsed = parse(source, { filename: 'x.vue' })
  const previewProps = parsed.descriptor.customBlocks.find(block => block.type === 'preview-props')
    ?.content //?
  const template = parsed.descriptor.template.content //?
  const style = parsed.descriptor.styles[0]?.content //?
  const script = parsed.descriptor.script?.content //?
  // if (script) {
  //   script = '(' + script.slice(script.indexOf('export default') + 'export default'.length) // convert to object
  //   if (!script.endsWith('}')) {
  //     script = script.slice(0, script.lastIndexOf('}') + 1)
  //   }
  //   script += ')' // convert to object
  //   console.log(script)
  // }

  const compiledTemplate = compileTemplate({ source: template, filename: 'x.vue' }).code //?
  // console.log(compiledTemplate)
  // let imports = compiledTemplate.slice(0, compiledTemplate.indexOf('\n\n'))
  // imports
  // compiledTemplate = compiledTemplate.replace(/import (.*)? from "vue"/, 'const $1 = window.Vue')

  // compiledTemplate = compiledTemplate.slice(compiledTemplate.indexOf('\n') + 1, -2)

  return {
    render: compiledTemplate,
    style,
    script,
    previewProps,
  }
}

compile(`<template>

<h1>live render with vue 3 is super awesome
{{x}}

</h1>

</template>

<style>

h1{
color:orange;
font-size:42px;

}
</style>

<script>
import {ref} from 'vue'

export default {
  setup(){
    const x = ref(0)
    return {
      x
    }
  }
}

</script>`) //?

// compile(`<template>

// {{world}}
// </template>

// <script>
// export default {}
// </script>`) //?

// compile(`<template>
// <h1>hello {{world}}</h1>

// </template>

// <style>
// h1{
//   font-size: 29px;
// }

// </style>

// <script>

// export default {
//   setup(){
//     return {
//       world: 'world'
//     }
//   }
// }

// </script>

// `) //?

// compile({ source: `<template>
// <div>
//   <p>hello {{ message }}</p>
// </div>
// </template>

// <script>
// export default {
// name: 'App',
// props: {
//   message: {
//     type: String,
//     required: true,
//   },
// },
// }
// </script>

// <preview-props>
// {
// "message" : "hello world"
// }
// </preview-props>

// <style lang="scss" scoped>
// p{
// border: 4px solid orange;
// margin-top: 4rem;
// padding: 4rem;
// display: block
// }
// body{
// background: rgb(71, 189, 110);
// }
// </style>`})//?

// const staticRenderFns = '[' + compiled.staticRenderFns.map(toFunction).join(',') + ']'

// render //?
