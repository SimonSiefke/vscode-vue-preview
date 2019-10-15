import { parse } from '@vue/component-compiler-utils'
import * as VueTemplateCompiler from 'vue-template-compiler'

export const compile = ({ source }) => {
  const parsed = parse({
    source: source,
    // @ts-ignore
    compiler: VueTemplateCompiler,
    filename: 'x.vue',
  }) //?
  parsed
  const previewProps = parsed.customBlocks.find(block=>block.type==='preview-props')?.content//?
  const template = parsed.template.content //?
  const style = parsed.styles[0]?.content //?
  let script = parsed.script?.content //?
  if(script){
    script = '('+script.slice(script.indexOf('export default') + 'export default'.length)+')' // convert to object
  }
  const compiledTemplate = VueTemplateCompiler.compile(template) //?
  const render = compiledTemplate.render
  return {
    render,
    style,
    script,
    previewProps
  }
}

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
