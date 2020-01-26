const path = require('path')
const fs = require('fs-extra')
const { exec } = require('child_process')

const root = path.join(__dirname, '..')

if (!fs.existsSync(path.join(root, 'dist'))) {
  fs.mkdirSync(path.join(root, 'dist'))
}

// @ts-ignore
const pkg = require('../packages/extension/package.json')

pkg.main = `./packages/extension/${pkg.main}`

// delete pkg.dependencies
// delete pkg.devDependencies
delete pkg.enableProposedApi
delete pkg.scripts

fs.writeFileSync(path.join(root, 'dist/package.json'), `${JSON.stringify(pkg, null, 2)}\n`)
fs.copyFileSync(
  path.join(root, 'packages/extension/package-lock.json'),
  path.join(root, 'dist/package-lock.json')
)
exec('cd dist && npm ci', (err, stdout, stderr) => {
  if (!err) {
    return
  }
  console.error(err)
  console.error(stderr)
  throw err
})

for (const file of ['README.md', 'LICENSE', 'CHANGELOG.md']) {
  fs.copySync(path.join(root, file), `dist/${file}`)
}

for (const file of fs.readdirSync(path.join(root, 'packages/extension/images'))) {
  if (
    [
      'icon.png',
      'bolt_original_darkgray_optimized.svg',
      'bolt_original_lightgray_optimized.svg',
      'refresh_original_darkgray_optimized.svg',
      'refresh_original_lightgray_optimized.svg',
    ].includes(file)
  ) {
    fs.copySync(path.join(root, `packages/extension/images/${file}`), `dist/images/${file}`)
  } else if (
    ['bolt_original_yellow_optimized.svg', 'bolt_original_red_optimized.svg'].includes(file)
  ) {
    fs.copySync(
      path.join(root, `packages/extension/images/${file}`),
      `dist/packages/extension/images/${file}`
    )
  }
}

fs.copySync(path.join(root, 'packages/preview/dist'), path.join(root, 'dist/packages/preview/dist'))

// TODO remove this once webpack is working
fs.copySync(
  path.join(root, 'packages/extension/dist'),
  path.join(root, 'dist/packages/extension/dist')
)

const compiled = fs.readFileSync(
  path.join(root, 'packages/extension/dist/webviewUtils.js'),
  'utf-8'
)
const replaced = compiled.replace("const ROOT = '../../'", `const ROOT = '.'`)
fs.writeFileSync(path.join(root, 'dist/packages/extension/dist/webviewUtils.js'), replaced)
