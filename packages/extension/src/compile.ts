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
  const template = parsed.template.content //?
  const style = parsed.styles[0]?.content //?
  let script = parsed.script?.content //?
  if(script){
    script = '('+script.slice(script.indexOf('export default') + 'export default'.length)+')'
  }
  const compiledTemplate = VueTemplateCompiler.compile(template) //?
  const render = compiledTemplate.render
  return {
    render,
    style,
    script
  }
}

// compile({ source: `<template><h1>hello</h1></template><style scoped>
// button{
//   color:green;
// }
// </style><script>
// export default {
//   data(){
//     return {
//       count: 0
//     }
//   }
// }
// </script>`})//?

// const staticRenderFns = '[' + compiled.staticRenderFns.map(toFunction).join(',') + ']'

// render //?
