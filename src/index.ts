const templateCompiler = require('vue-template-compiler')
import * as fs from 'fs'
import * as path from 'path'
import { parse, SFCDescriptor, SFCBlock } from '@vue/component-compiler-utils'
import * as VueTemplateCompiler from 'vue-template-compiler'

const file = fs.readFileSync(path.join(__dirname, '../playground/App.vue'), 'utf-8')

const parsed = parse({
  source: file,
  compiler: templateCompiler,
  filename: 'x.vue',
}) //?

const template = parsed.template.content //?
const style = parsed.styles[0].content //?
const script = parsed.script.content //?

script
const compiled = VueTemplateCompiler.compile(template) //?
const toFunction = code => `function render () {${code}}`
const render = toFunction(compiled.render)
const staticRenderFns = '[' + compiled.staticRenderFns.map(toFunction).join(',') + ']'

render //?

const generateBodyCode = ({ template, style, script }) => `
<html>

  <body>
    <div id="app"></div>
    <script>
      import Example from './Example.vue'
      new Vue({
        el: '#app',
        template: \`${template}\`
      })
    </script>
  </body>
</html>
`

const generatedHeadCode = ({ style }) => `
  <head>
      <style>
        ${style}
      </style>
    </head>`

// generateCode({template,style,script})//?
