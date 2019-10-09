"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_compiler_utils_1 = require("@vue/component-compiler-utils");
const VueTemplateCompiler = require("vue-template-compiler");
exports.compile = ({ source }) => {
    var _a, _b;
    const parsed = component_compiler_utils_1.parse({
        source: source,
        // @ts-ignore
        compiler: VueTemplateCompiler,
        filename: 'x.vue',
    }); //?
    parsed;
    const template = parsed.template.content; //?
    const style = (_a = parsed.styles[0]) === null || _a === void 0 ? void 0 : _a.content; //?
    let script = (_b = parsed.script) === null || _b === void 0 ? void 0 : _b.content; //?
    if (script) {
        script = '(' + script.slice(script.indexOf('export default') + 'export default'.length) + ')';
    }
    const compiledTemplate = VueTemplateCompiler.compile(template); //?
    const render = compiledTemplate.render;
    return {
        render,
        style,
        script
    };
};
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
//# sourceMappingURL=compile.js.map